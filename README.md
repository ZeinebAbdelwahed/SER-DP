# SER Wellness Platform — Run Instructions

## Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Python AI service running on http://localhost:8000 (your wav2vec2 model)

## Backend Setup
```bash
cd backend
cp .env .env.local   # edit values as needed
npm run dev          # starts on port 5000

# Seed database (run once)
npm run seed
```

## Frontend Setup
```bash
cd frontend
npm install
npm run dev          # starts on port 5173
```

## Python AI Service Expected Contract
The Node.js backend calls:
```
POST http://localhost:8000/predict
Content-Type: multipart/form-data
Body: { file: <audio file> }

Response:
{
  "emotion": "happy",
  "confidence": 0.87,
  "probabilities": { "happy": 0.87, "calm": 0.06, ... }
}
```

## Environment Variables (backend/.env)
| Variable | Description |
|---|---|
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | Secret for JWT tokens |
| PYTHON_AI_URL | URL of your Python prediction service |
| TMDB_API_KEY | (optional) TMDb API key for movie posters |
| WATCHMODE_API_KEY | (optional) Watchmode for streaming links |
| OMDB_API_KEY | (optional) OMDb fallback |

## Tech Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + Zustand + Recharts
- **Backend**: Node.js + Express + TypeScript + MongoDB + Mongoose
- **AI**: wav2vec2 Python service (your existing model)
