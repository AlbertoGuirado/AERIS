import { useEffect, useRef, useState } from "react";

const FALLBACK_VIDEO = "/projects/video.mp4";
const FALLBACK_IMAGE = "FitYou.png";
const DEFAULT_API_URL_LOCAL = "http://localhost:8000";
const DEFAULT_API_URL = "https://aeris-backend.up.railway.app";

const trimTrailingSlash = (value) =>
  typeof value === "string" ? value.replace(/\/+$/, "") : "";

const isLocalHost = (hostname) => {
  if (!hostname) return false;
  const lower = hostname.toLowerCase();
  return (
    lower === "localhost" ||
    lower === "127.0.0.1" ||
    lower === "::1" ||
    lower.startsWith("192.168.") ||
    lower.startsWith("10.") ||
    lower.endsWith(".local")
  );
};

const resolveApiBaseUrl = () => {
  const envUrl = trimTrailingSlash(import.meta.env?.VITE_API_URL);
  if (envUrl) {
    return envUrl;
  }
  /*
  if (typeof window !== "undefined" && window.location?.origin) {
    const { origin, hostname } = window.location;
    if (origin && hostname && !isLocalHost(hostname)) {
      return trimTrailingSlash(origin);
    }
  }*/
  if (typeof window !== "undefined" && isLocalHost(window.    location.hostname)) {
    return DEFAULT_API_URL_LOCAL; // desarrollo local
  }
  return DEFAULT_API_URL;
};

const API_BASE_URL = resolveApiBaseUrl();
const ANALYZE_ENDPOINT = `${API_BASE_URL}/analyze`;
const FILE_ENDPOINT = `${API_BASE_URL}/file`;

const normalizeFileUrl = (httpUrl, fileName) => {
  if (typeof httpUrl === "string" && /^https?:\/\//i.test(httpUrl)) {
    return httpUrl;
  }
  if (fileName) {
    return `${FILE_ENDPOINT}/${encodeURIComponent(fileName)}`;
  }
  if (typeof httpUrl === "string" && httpUrl.trim()) {
    const sanitized = httpUrl.replace(/^\//, "");
    return `${API_BASE_URL}/${sanitized}`;
  }
  return "";
};

const clampConfidence = (value) => {
  if (Number.isFinite(value)) {
    if (value < 0) return 0;
    if (value > 1) return 1;
    return value;
  }
  return 0;
};

export const VideoCopy = ({
  source,
  mediaType = "video",
  onUpload,
  error,
  autoPlay = true,
  detectedElements = 0,
  impactAlerts = 0,
  impactConfidence = 0.3,
  objectConfidence = 0.02,
}) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null); // { src, type, isObjectUrl }
  const [processedMedia, setProcessedMedia] = useState(null); // API response
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState(error ?? null);

  const normalizedImpactConfidence = clampConfidence(impactConfidence);
  const normalizedObjectConfidence = clampConfidence(objectConfidence);

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
    return normalizeFileUrl(result.httpUrl, result.fileName);
  };

  const analyzeFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("impact_confidence", String(normalizedImpactConfidence));
    formData.append("object_confidence", String(normalizedObjectConfidence));
    setIsProcessing(true);
    setUploadError(null);
    try {
      const response = await fetch(ANALYZE_ENDPOINT, {
        method: "POST",
        body: formData,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        const detail = payload?.detail || payload?.message || "Error processing the file";
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
    const message = (err && err.message) || "We could not reach the server.";
    const normalizedMessage = (() => {
      const lowered = message.toLowerCase();
      if (lowered.includes("network") || lowered.includes("fetch") || lowered.includes("failed")) {
        return `We could not reach the API at ${ANALYZE_ENDPOINT}. Check that the backend is running and that the URL is correct.`;
      }
      return message;
    })();
    setUploadError(normalizedMessage);
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
    <section id="VideoCopy" className="media-panel mx-auto max-w-3xl px-4 py-18 sm:px-6">
      <div className="media-wrapper relative mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-border/40 bg-card/30 shadow-2xl backdrop-blur">
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
            Your browser does not support HTML5 video.
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
            Processing file...
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
          {isProcessing ? "Analyzing..." : "Add media"}
        </button>

        <div className="mt-4 grid w-full gap-3 sm:grid-cols-2">
          <div className="w-full rounded-xl border border-border/40 bg-card/40 px-4 py-3 text-left shadow-inner">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Detected elements</p>
            <p className="text-2xl font-semibold text-foreground">#{totalDetected}</p>
          </div>
          <div className="w-full rounded-xl border border-border/40 bg-card/40 px-4 py-3 text-left shadow-inner">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Impact alerts</p>
            <p className="text-2xl font-semibold text-foreground">#{totalImpacts}</p>
          </div>
        </div>

        <div className="w-full rounded-xl border border-dashed border-border/50 bg-card/30 px-4 py-4 text-left text-foreground shadow-inner">
          {processedMedia ? (
            <>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Processed file</p>
              <p className="text-sm font-semibold">{processedMedia.fileName}</p>
              <p className="text-xs text-muted-foreground">{processedMedia.mimeType}</p>
              <a
                href={normalizeFileUrl(processedMedia.httpUrl, processedMedia.fileName)}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex text-xs font-semibold text-primary underline"
              >
                Open or download result
              </a>
              <p className="mt-3 text-xs text-muted-foreground">
                The file already includes the bounding boxes and annotations generated by the models. Use the data for reports or to download the final video/image.
              </p>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">
              Upload a video or image so the API can process the information, add the bounding boxes, and return statistics.
            </p>
          )}
        </div>

        {uploadError ? <p className="upload-error text-xs text-destructive">{uploadError}</p> : null}
      </div>
    </section>
  );
};
