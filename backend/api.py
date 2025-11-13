from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import shutil
import uuid
import os
import base64
from processing.detector import process_video, process_image

app = FastAPI()

# CORS para permitir React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads/"
OUTPUT_DIR = "outputs/"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)


def _encode_file(path: str) -> str:
    with open(path, "rb") as file_handle:
        return base64.b64encode(file_handle.read()).decode("utf-8")


def _build_payload(request: Request, media_type: str, mime_type: str, result: dict) -> dict:
    output_path = result["output_path"]
    file_name = os.path.basename(output_path)
    http_url = str(request.url_for("get_file", filename=file_name))

    payload = {
        "status": "ok",
        "type": media_type,
        "fileName": file_name,
        "mimeType": mime_type,
        "detectedElements": result["detected_elements"],
        "impactAlerts": result["impact_alerts"],
        "httpUrl": http_url,
    }

    if media_type == "image":
        try:
            payload["fileData"] = _encode_file(output_path)
        except FileNotFoundError as exc:
            raise HTTPException(status_code=500, detail="Processed file not found") from exc

    return payload


@app.get("/file/{filename}")
async def get_file(filename: str):
    safe_name = os.path.basename(filename)
    file_path = os.path.join(OUTPUT_DIR, safe_name)
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    return FileResponse(file_path, media_type="application/octet-stream", filename=safe_name)


@app.post("/analyze")
async def analyze_file(request: Request, file: UploadFile = File(...)):
    file_id = str(uuid.uuid4())
    input_path = os.path.join(UPLOAD_DIR, f"{file_id}_{file.filename}")

    # Guardar archivo recibido
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        if file.content_type and file.content_type.startswith("video/"):
            output_path = os.path.join(OUTPUT_DIR, f"{file_id}.mp4")
            result = process_video(input_path, output_path)
            return _build_payload(request, "video", "video/mp4", result)

        if file.content_type and file.content_type.startswith("image/"):
            output_path = os.path.join(OUTPUT_DIR, f"{file_id}.jpg")
            result = process_image(input_path, output_path)
            return _build_payload(request, "image", "image/jpeg", result)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail="Error procesando el archivo") from exc

    raise HTTPException(status_code=415, detail="Tipo de archivo no soportado")
