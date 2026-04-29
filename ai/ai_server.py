"""
Serveur Flask pour l'inférence wav2vec2 SER.
POST /predict  ->  { emotion, confidence, probabilities }
"""

import os
import tempfile
import numpy as np
import torch
import torch.nn as nn
import librosa
from flask import Flask, request, jsonify
from transformers import Wav2Vec2Model

# ── Configuration ────────────────────────────────────────────────────────────
LABELS = ['angry', 'calm', 'disgust', 'fearful', 'happy', 'neutral', 'sad', 'surprise']
NUM_CLASSES = len(LABELS)
SR = 16000
MAX_LENGTH = 48000          # 3 secondes @ 16 kHz
MODEL_PATH = os.environ.get('MODEL_PATH', 'models/wav2vec2_best.pth')

# ── Architecture (identique à 03_Training.ipynb) ─────────────────────────────
class Wav2Vec2ForSER(nn.Module):
    def __init__(self, num_classes: int):
        super().__init__()
        self.wav2vec2 = Wav2Vec2Model.from_pretrained('facebook/wav2vec2-base')
        # Geler feature extractor + 8 premières couches transformer
        self.wav2vec2.feature_extractor._freeze_parameters()
        for i, layer in enumerate(self.wav2vec2.encoder.layers):
            if i < 8:
                for param in layer.parameters():
                    param.requires_grad = False
        hidden_size = self.wav2vec2.config.hidden_size  # 768
        self.classifier = nn.Sequential(
            nn.Linear(hidden_size, 256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(128, num_classes),
        )

    def forward(self, input_values: torch.Tensor) -> torch.Tensor:
        outputs = self.wav2vec2(input_values)
        pooled = outputs.last_hidden_state.mean(dim=1)   # mean pooling
        return self.classifier(pooled)


# ── Chargement du modèle ─────────────────────────────────────────────────────
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f'[AI Server] Device: {device}')

# Télécharger depuis GCS si le modèle n'existe pas localement
GCS_BUCKET = os.environ.get('GCS_BUCKET', '')
if GCS_BUCKET and not os.path.exists(MODEL_PATH):
    print(f'[AI Server] Downloading model from gs://{GCS_BUCKET}/models/wav2vec2_best.pth ...')
    os.makedirs(os.path.dirname(MODEL_PATH) or '.', exist_ok=True)
    from google.cloud import storage as gcs
    client = gcs.Client()
    bucket = client.bucket(GCS_BUCKET)
    blob = bucket.blob('models/wav2vec2_best.pth')
    blob.download_to_filename(MODEL_PATH)
    print(f'[AI Server] Model downloaded to {MODEL_PATH}')

model = Wav2Vec2ForSER(NUM_CLASSES)
state = torch.load(MODEL_PATH, map_location=device, weights_only=True)
model.load_state_dict(state)
model.to(device)
model.eval()
print(f'[AI Server] Model loaded from {MODEL_PATH}')

# ── Flask app ────────────────────────────────────────────────────────────────
app = Flask(__name__)


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'device': str(device)})


@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    audio_file = request.files['file']
    filename = audio_file.filename or 'audio.wav'
    ext = os.path.splitext(filename)[1] or '.wav'

    # Sauvegarder temporairement
    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        audio_file.save(tmp.name)
        tmp_path = tmp.name

    try:
        # Charger et normaliser l'audio (16 kHz mono, 3 s)
        y, _ = librosa.load(tmp_path, sr=SR, mono=True, duration=3.0)
        if len(y) < MAX_LENGTH:
            y = np.pad(y, (0, MAX_LENGTH - len(y)))
        else:
            y = y[:MAX_LENGTH]

        input_values = torch.tensor(y, dtype=torch.float32).unsqueeze(0).to(device)

        with torch.no_grad():
            logits = model(input_values)
            probs = torch.softmax(logits, dim=1).squeeze().cpu().numpy()

        pred_idx = int(np.argmax(probs))
        emotion = LABELS[pred_idx]
        confidence = float(probs[pred_idx])
        probabilities = {LABELS[i]: float(probs[i]) for i in range(NUM_CLASSES)}

        return jsonify({
            'emotion': emotion,
            'confidence': confidence,
            'probabilities': probabilities,
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        try:
            os.unlink(tmp_path)
        except OSError:
            pass


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=False)
