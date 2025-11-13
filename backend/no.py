from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from ultralytics import YOLO
import cv2
import tempfile
import os

# ======================
# CONFIGURACIÓN INICIAL
# ======================
MODEL_ISS_PATH = "models/best_iss.pt"
MODEL_IMPACT_PATH = "models/best_impact.pt"

model_iss = YOLO(MODEL_ISS_PATH)
model_impact = YOLO(MODEL_IMPACT_PATH)

app = FastAPI()

# CORS para permitir conexión desde tu frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # puedes poner ["http://localhost:5173"] para más seguridad
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================
# ENDPOINT PRINCIPAL
# ======================

# Total frames: Frames processed
# total_iss: Total detected structures (ISS)
# total_impacts: detected impacts in a video/photo
@app.post("/detect/")
async def detect_video(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_video:
        temp_video.write(await file.read())
        temp_path = temp_video.name

    cap = cv2.VideoCapture(temp_path)
    total_frames, total_iss, total_impacts = 0, 0, 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        total_frames += 1

        iss_result = model_iss(frame, conf=0.2, verbose=False)[0]
        imp_result = model_impact(frame, conf=0.3, verbose=False)[0]

        total_iss += len(iss_result.boxes)
        total_impacts += len(imp_result.boxes)

    cap.release()
    os.remove(temp_path)

    return JSONResponse({
        "frames": total_frames,
        "total_iss": total_iss,
        "total_impacts": total_impacts
    })
