import { useEffect, useRef, useState } from "react";

const FALLBACK_VIDEO = "/projects/video.mp4";
const FALLBACK_IMAGE = "FitYou.png";
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const ANALYZE_ENDPOINT = `${API_BASE_URL}/analyze`;

export const VideoCopy = ({
  source,
  mediaType = "video",
  onUpload,
  error,
  autoPlay = true,
  detectedElements = 0,
  impactAlerts = 0,
}) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null); // { src, type, isObjectUrl }
  const [processedMedia, setProcessedMedia] = useState(null); // API response
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState(error ?? null);

  useEffect(() => {
    if (!preview?.isObjectUrl || !preview?.src) {
      return undefined;
    }
    const { src } = preview;
    return () => {
      URL.revokeObjectURL(src);
    };
  }, [preview]);

  const handleUploadButtonClick = () => {
    inputRef.current?.click();
  };

  const buildMediaSourceFromResult = (result) => {
    if (!result) {
      return "";
    }
    if (result.type === "image" && result.fileData) {
      return `data:${result.mimeType};base64,${result.fileData}`;
    }
    return result.httpUrl;
  };

  const analyzeFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    setIsProcessing(true);
    setUploadError(null);
    try {
      const response = await fetch(ANALYZE_ENDPOINT, {
        method: "POST",
        body: formData,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        const detail = payload?.detail || payload?.message || "Error al procesar el archivo";
        throw new Error(detail);
      }

      const result = payload;
      const src = buildMediaSourceFromResult(result);
      setProcessedMedia({ ...result, src });
      setPreview(null);

      if (typeof onUpload === "function") {
        onUpload({ file, analysis: result });
      }
    } catch (err) {
      console.error(err);
      setUploadError(err.message || "No pudimos comunicarnos con el servidor.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const blobUrl = URL.createObjectURL(file);
    setPreview({
      src: blobUrl,
      type: file.type.startsWith("image/") ? "image" : "video",
      isObjectUrl: true,
    });
    analyzeFile(file);
    event.target.value = "";
  };

  const activeMediaType = processedMedia?.type ?? preview?.type ?? mediaType;
  const isVideo = activeMediaType === "video";

  const processedSource = processedMedia?.src ?? null;
  const previewSource = preview?.src ?? null;
  const fallbackSource =
    source?.trim?.()
      ? source
      : isVideo
        ? FALLBACK_VIDEO
        : FALLBACK_IMAGE;
  const mediaSource = processedSource ?? previewSource ?? fallbackSource;

  const totalDetected = processedMedia?.detectedElements ?? detectedElements;
  const totalImpacts = processedMedia?.impactAlerts ?? impactAlerts;

  return (
    <section id="VideoCopy" className="media-panel mx-auto max-w-3xl px-4 py-17 sm:px-6">
      <div className="media-wrapper relative mx-auto aspect-video w-full max-w-2xl overflow-hidden rounded-2xl border border-border/40 bg-card/30 shadow-2xl backdrop-blur">
        {isVideo ? (
          <video
            className="media-element h-full w-full object-cover"
            src={mediaSource}
            controls
            loop
            muted={autoPlay}
            autoPlay={autoPlay}
            playsInline
          >
            Tu navegador no soporta el video HTML5.
          </video>
        ) : (
          <img
            className="media-element media-image h-full w-full object-cover"
            src={mediaSource}
            alt="Space capture"
          />
        )}

        {isProcessing ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 text-sm font-medium text-foreground/80">
            Procesando archivo…
          </div>
        ) : null}
      </div>

      <div className="media-controls mt-6 flex flex-col items-center gap-3 text-sm text-muted-foreground">
        <label className="upload-button">
          <input
            ref={inputRef}
            type="file"
            accept="video/*,image/*"
            onChange={handleFileChange}
            hidden
          />
        </label>
        <button
          type="button"
          onClick={handleUploadButtonClick}
          disabled={isProcessing}
          className="rounded-full border border-border/50 px-5 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-primary hover:text-primary-foreground bg-primary text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isProcessing ? "Analizando…" : "Añadir multimedia"}
        </button>

        <div className="mt-4 grid w-full gap-3 sm:grid-cols-2">
          <div className="w-full rounded-xl border border-border/40 bg-card/40 px-4 py-3 text-left shadow-inner">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Elementos detectados</p>
            <p className="text-2xl font-semibold text-foreground">#{totalDetected}</p>
          </div>
          <div className="w-full rounded-xl border border-border/40 bg-card/40 px-4 py-3 text-left shadow-inner">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Alertas de impactos</p>
            <p className="text-2xl font-semibold text-foreground">#{totalImpacts}</p>
          </div>
        </div>

        <div className="w-full rounded-xl border border-dashed border-border/50 bg-card/30 px-4 py-4 text-left text-foreground shadow-inner">
          {processedMedia ? (
            <>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Archivo procesado</p>
              <p className="text-sm font-semibold">{processedMedia.fileName}</p>
              <p className="text-xs text-muted-foreground">{processedMedia.mimeType}</p>
              <a
                href={processedMedia.httpUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex text-xs font-semibold text-primary underline"
              >
                Abrir o descargar resultado
              </a>
              <p className="mt-3 text-xs text-muted-foreground">
                El archivo ya contiene las bounding boxes y anotaciones generadas por los modelos. Usa los datos para reportes o para descargar el video/imágen final.
              </p>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">
              Sube un video o imagen para que la API procese la información, añada las cajas delimitadoras y devuelva estadísticas.
            </p>
          )}
        </div>

        {uploadError ? <p className="upload-error text-xs text-destructive">{uploadError}</p> : null}
      </div>
    </section>
  );
};
