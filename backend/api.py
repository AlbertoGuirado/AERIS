from fastapi import FastAPI, File, UploadFile, HTTPException, Request, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import shutil
import uuid
import os
import base64
import mimetypes
import logging
from pathlib import Path
from typing import Literal
from processing.detector import (
    process_video,
    process_image,
    CONF_ISS,
    CONF_IMPACT,
)

logger = logging.getLogger(__name__)

app = FastAPI()

# CORS para permitir React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://aeris-proyect.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
OUTPUT_DIR = BASE_DIR / "outputs"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def _guess_media_type(filename: str) -> str:
    mime_type, _ = mimetypes.guess_type(filename)
    return mime_type or "application/octet-stream"


def _encode_file(path: str | Path) -> str:
    path = Path(path)
    with path.open("rb") as file_handle:
        return base64.b64encode(file_handle.read()).decode("utf-8")


def _build_payload(
    request: Request,
    media_type: Literal["video", "image"],
    mime_type: str,
    result: dict,
) -> dict:
    output_path = Path(result["output_path"])
    file_name = output_path.name
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
            logger.exception("Processed image missing at %s", output_path)
            raise HTTPException(status_code=500, detail="Processed file not found") from exc

    return payload


@app.get("/file/{filename}")
async def get_file(filename: str):
    safe_name = os.path.basename(filename)
    file_path = OUTPUT_DIR / safe_name
    if not file_path.is_file():
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    media_type = _guess_media_type(safe_name)
    response = FileResponse(file_path, media_type=media_type)
    response.headers["Content-Disposition"] = f'inline; filename="{safe_name}"'
    return response


def _detect_media_kind(upload: UploadFile, fallback_name: str) -> Literal["video", "image", "unknown"]:
    content_type = (upload.content_type or "").lower()
    if content_type.startswith("video/"):
        return "video"
    if content_type.startswith("image/"):
        return "image"

    guessed_type, _ = mimetypes.guess_type(fallback_name)
    if guessed_type:
        guessed_type = guessed_type.lower()
        if guessed_type.startswith("video/"):
            return "video"
        if guessed_type.startswith("image/"):
            return "image"
    return "unknown"


@app.post("/analyze")
async def analyze_file(
    request: Request,
    file: UploadFile = File(...),
    object_confidence: float = Form(CONF_ISS),
    impact_confidence: float = Form(CONF_IMPACT),
):
    file_id = str(uuid.uuid4())
    original_name = os.path.basename(file.filename) if file.filename else "upload.bin"
    input_path = UPLOAD_DIR / f"{file_id}_{original_name}"

    logger.info(
        "Recibido archivo %s (%s) con confidencias object=%.3f impact=%.3f",
        original_name,
        file.content_type,
        object_confidence,
        impact_confidence,
    )

    # Guardar archivo recibido
    with input_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    media_kind = _detect_media_kind(file, original_name)
    logger.info("Procesando %s como %s", original_name, media_kind)

    try:
        if media_kind == "video":
            output_path = OUTPUT_DIR / f"{file_id}.mp4"
            result = process_video(
                str(input_path),
                str(output_path),
                iss_confidence=object_confidence,
                impact_confidence=impact_confidence,
            )
            return _build_payload(request, "video", "video/mp4", result)

        if media_kind == "image":
            output_path = OUTPUT_DIR / f"{file_id}.jpg"
            result = process_image(
                str(input_path),
                str(output_path),
                iss_confidence=object_confidence,
                impact_confidence=impact_confidence,
            )
            return _build_payload(request, "image", "image/jpeg", result)
    except ValueError as exc:
        logger.warning("Error de validacion al procesar %s: %s", original_name, exc)
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        logger.exception("Error no controlado procesando %s", original_name)
        raise HTTPException(status_code=500, detail=f"Error procesando el archivo: {exc}") from exc

    logger.warning("Tipo de archivo no soportado: %s (%s)", original_name, file.content_type)
    raise HTTPException(status_code=415, detail="Tipo de archivo no soportado")
