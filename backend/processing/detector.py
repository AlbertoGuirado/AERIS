from typing import Optional, Tuple
import os
import subprocess
import shutil
from pathlib import Path

import cv2
from ultralytics import YOLO

MODEL_ISS_PATH = os.getenv("MODEL_ISS_PATH", "models/best_iss.pt")
MODEL_IMPACT_PATH = os.getenv("MODEL_IMPACT_PATH", "models/best_impact.pt")
SOURCE_PATH = os.getenv("SOURCE_PATH", "testVideo.mp4")
DEFAULT_VIDEO_OUTPUT = os.getenv("VIDEO_OUTPUT_PATH", "output.mp4")
DEFAULT_IMAGE_OUTPUT = os.getenv("IMAGE_OUTPUT_PATH", "output_image.jpg")

CONF_ISS = float(os.getenv("CONF_ISS", 0.2))
CONF_IMPACT = float(os.getenv("CONF_IMPACT", 0.3))
IOU_THRESH = float(os.getenv("IOU_THRESH", 0.3))

_model_iss = None
_model_impacts = None

_DEFAULT_CODECS = ("mp4v", "XVID", "avc1", "H264")
_CODEC_PREFS = tuple(
    filter(
        None,
        (
            os.getenv("VIDEO_WRITER_CODECS") or ",".join(_DEFAULT_CODECS)
        ).replace(" ", "").split(","),
    )
)
_FFMPEG_BINARY = shutil.which(os.getenv("FFMPEG_BIN", "ffmpeg"))


def _load_models():
    """Carga perezosa para reutilizar los pesos durante toda la vida del servidor."""
    global _model_iss, _model_impacts
    if _model_iss is None:
        _model_iss = YOLO(MODEL_ISS_PATH)
    if _model_impacts is None:
        _model_impacts = YOLO(MODEL_IMPACT_PATH)
    return _model_iss, _model_impacts


def _clamp_conf(value: Optional[float], default: float) -> float:
    """Garantiza que la confianza enviada esta entre 0 y 1."""
    if value is None:
        return default
    try:
        parsed = float(value)
    except (TypeError, ValueError):
        return default
    return max(0.0, min(1.0, parsed))


def _init_video_writer(path: str, fps: float, width: int, height: int) -> Tuple[cv2.VideoWriter, str]:
    """Intenta crear un VideoWriter probando varios codecs hasta encontrar uno soportado."""
    path = str(path)
    last_error = None
    for codec in _CODEC_PREFS:
        fourcc = cv2.VideoWriter_fourcc(*codec)
        writer = cv2.VideoWriter(path, fourcc, fps, (width, height))
        if writer.isOpened():
            return writer, codec
        last_error = codec
        writer.release()
    raise ValueError(
        "No se pudo inicializar el escritor de video. "
        f"Verifica los codecs instalados (intentados: {', '.join(_CODEC_PREFS)}). "
        f"Ultimo intento fallido con codec: {last_error}"
    )


def _transcode_to_h264(source_path: str, target_path: str) -> str:
    """Convierte el video temporal al formato H.264 compatible con navegadores."""
    source = Path(source_path)
    target = Path(target_path)
    if _FFMPEG_BINARY is None:
        os.replace(source, target)
        print("[detector] ffmpeg no disponible: entregando video en codec original (puede no funcionar en navegadores).")
        return "copy"

    preset = os.getenv("FFMPEG_PRESET", "veryfast")
    cmd = [
        _FFMPEG_BINARY,
        "-y",
        "-loglevel",
        "error",
        "-i",
        str(source),
        "-c:v",
        "libx264",
        "-preset",
        preset,
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        "-an",
        str(target),
    ]
    process = subprocess.run(cmd, capture_output=True, text=True, check=False)
    if process.returncode != 0:
        raise RuntimeError(
            "ffmpeg no pudo convertir el video a H.264: "
            f"{process.stderr.strip() or process.stdout.strip()}"
        )
    try:
        source.unlink()
    except FileNotFoundError:
        pass
    return "h264"


def calculate_iou(box1, box2):
    xA = max(box1[0], box2[0])
    yA = max(box1[1], box2[1])
    xB = min(box1[2], box2[2])
    yB = min(box1[3], box2[3])
    inter_area = max(0, xB - xA) * max(0, yB - yA)
    if inter_area == 0:
        return 0
    box1_area = (box1[2] - box1[0]) * (box1[3] - box1[1])
    box2_area = (box2[2] - box2[0]) * (box2[3] - box2[1])
    return inter_area / float(box1_area + box2_area - inter_area)


def process_frame(
    frame,
    model_iss,
    model_impacts,
    frame_id=None,
    iss_confidence=None,
    impact_confidence=None,
):
    """Aplica ambos modelos a un frame y devuelve el frame anotado junto con los conteos."""
    iss_threshold = _clamp_conf(iss_confidence, CONF_ISS)
    impact_threshold = _clamp_conf(impact_confidence, CONF_IMPACT)

    iss_result = model_iss(frame, conf=iss_threshold, iou=IOU_THRESH, verbose=False)[0]
    iss_boxes = iss_result.boxes.xyxy.cpu().numpy()
    iss_classes = iss_result.boxes.cls.cpu().numpy() if iss_result.boxes.cls is not None else []
    iss_conf = iss_result.boxes.conf.cpu().numpy() if iss_result.boxes.conf is not None else []
    iss_names = iss_result.names

    imp_result = model_impacts(frame, conf=impact_threshold, iou=IOU_THRESH, verbose=False)[0]
    imp_boxes = imp_result.boxes.xyxy.cpu().numpy()
    imp_classes = imp_result.boxes.cls.cpu().numpy() if imp_result.boxes.cls is not None else []
    imp_conf = imp_result.boxes.conf.cpu().numpy() if imp_result.boxes.conf is not None else []
    imp_names = imp_result.names

    for idx, iss_box in enumerate(iss_boxes):
        x1, y1, x2, y2 = map(int, iss_box)
        cls_name = iss_names.get(int(iss_classes[idx]), f"class_{int(iss_classes[idx])}") if len(iss_classes) else "ISS"
        conf_val = float(iss_conf[idx]) if len(iss_conf) else 0.0
        label = f"ISS: {cls_name} {conf_val:.2f}"
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 140, 255), 2)
        cv2.putText(frame, label, (x1, max(y1 - 10, 0)), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 140, 255), 2)

    for imp_idx, imp_box in enumerate(imp_boxes):
        x1, y1, x2, y2 = map(int, imp_box)
        impact_conf = float(imp_conf[imp_idx]) if len(imp_conf) else 0.0
        impact_cls = imp_names.get(int(imp_classes[imp_idx]), f"class_{int(imp_classes[imp_idx])}") if len(imp_classes) else "Impacto"
        x_center = 0.5 * (imp_box[0] + imp_box[2])
        y_center = 0.5 * (imp_box[1] + imp_box[3])

        matched_labels = []
        for iss_idx, iss_box in enumerate(iss_boxes):
            iou = calculate_iou(imp_box, iss_box)
            if iou > 0:
                iss_conf_val = float(iss_conf[iss_idx]) if len(iss_conf) else 0.0
                iss_label = iss_names.get(int(iss_classes[iss_idx]), f"class_{int(iss_classes[iss_idx])}") if len(iss_classes) else "ISS"
                matched_labels.append(f"{iss_label} (obj {iss_conf_val:.2f}, IoU {iou:.2f})")

        details = "; ".join(matched_labels) if matched_labels else "sin objeto asociado"
        print(
            f"[frame {frame_id}] Impacto {impact_cls} conf={impact_conf:.2f} "
            f"centro=({x_center:.1f}, {y_center:.1f}) -> {details}"
        )

        impact_label = f"Impacto: {impact_cls} {impact_conf:.2f}"
        coord_label = f"({int(x_center)}, {int(y_center)})"
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
        cv2.putText(frame, impact_label, (x1, min(y2 + 20, frame.shape[0] - 10)),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
        cv2.putText(frame, coord_label, (x1, min(y2 + 40, frame.shape[0] - 5)),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
        cv2.circle(frame, (int(x_center), int(y_center)), 4, (0, 0, 255), -1)

    return frame, len(iss_boxes), len(imp_boxes)


def process_image(input_path, output_path, iss_confidence=None, impact_confidence=None):
    """Procesa una imagen, guarda el archivo resultante y devuelve los conteos."""
    model_iss, model_impacts = _load_models()
    frame = cv2.imread(input_path)
    if frame is None:
        raise ValueError(f"No se pudo leer la imagen: {input_path}")

    processed_frame, iss_count, impact_count = process_frame(
        frame,
        model_iss,
        model_impacts,
        frame_id=0,
        iss_confidence=iss_confidence,
        impact_confidence=impact_confidence,
    )
    cv2.imwrite(output_path, processed_frame)
    return {
        "output_path": output_path,
        "detected_elements": int(iss_count),
        "impact_alerts": int(impact_count),
    }


def process_video(input_path, output_path, iss_confidence=None, impact_confidence=None):
    """Procesa un video completo acumulando detecciones y guardando un MP4 anotado."""
    model_iss, model_impacts = _load_models()
    cap = cv2.VideoCapture(input_path)
    if not cap.isOpened():
        raise ValueError(f"No se pudo abrir el video: {input_path}")

    fps = cap.get(cv2.CAP_PROP_FPS)
    fps = fps if fps and fps > 0 else 30.0
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    if width == 0 or height == 0:
        cap.release()
        raise ValueError("No se pudo determinar la resolucion del video de entrada.")

    final_output_path = Path(output_path)
    temp_output_path = final_output_path.with_suffix(".tmp.mp4")
    if temp_output_path.exists():
        try:
            temp_output_path.unlink()
        except OSError:
            pass
    writer, codec_used = _init_video_writer(str(temp_output_path), fps, width, height)

    total_iss = 0
    total_impacts = 0
    frame_id = 0

    try:
        print(
            f"[detector] Procesando video {input_path} -> {final_output_path} "
            f"usando codec base {codec_used} ({width}x{height}@{fps:.2f}fps)"
        )
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            frame_id += 1
            processed_frame, iss_count, impact_count = process_frame(
                frame,
                model_iss,
                model_impacts,
                frame_id=frame_id,
                iss_confidence=iss_confidence,
                impact_confidence=impact_confidence,
            )
            total_iss += iss_count
            total_impacts += impact_count
            writer.write(processed_frame)
    finally:
        cap.release()
        writer.release()

    try:
        encoding_mode = _transcode_to_h264(str(temp_output_path), str(final_output_path))
        print(f"[detector] Video final exportado como {final_output_path} (modo {encoding_mode})")
    except Exception as exc:
        try:
            temp_output_path.unlink()
        except FileNotFoundError:
            pass
        raise ValueError(f"No se pudo convertir el video a un formato compatible: {exc}") from exc

    return {
        "output_path": str(final_output_path),
        "detected_elements": int(total_iss),
        "impact_alerts": int(total_impacts),
    }


if __name__ == "__main__":
    if SOURCE_PATH.lower().endswith((".mp4", ".avi", ".mov", ".mkv")):
        result = process_video(SOURCE_PATH, DEFAULT_VIDEO_OUTPUT)
    else:
        result = process_image(SOURCE_PATH, DEFAULT_IMAGE_OUTPUT)

    print(f"Elementos detectados: {result['detected_elements']}")
    print(f"Impactos detectados: {result['impact_alerts']}")
    print(f"Resultado guardado en: {result['output_path']}")
