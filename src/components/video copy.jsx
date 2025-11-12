import { useEffect, useRef, useState } from "react";

const FALLBACK_VIDEO =
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
const FALLBACK_IMAGE =
  "FitYou.png";

  
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
  const [localMedia, setLocalMedia] = useState({ src: "", type: "video" });

  useEffect(() => {
    return () => {
      if (localMedia.src) {
        URL.revokeObjectURL(localMedia.src);
      }
    };
  }, [localMedia.src]);

  const handleUploadButtonClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const blobUrl = URL.createObjectURL(file);
    setLocalMedia({
      src: blobUrl,
      type: file.type.startsWith("image/") ? "image" : "video",
    });

    if (typeof onUpload === "function") {
      onUpload(file);
    }
    event.target.value = "";
  };

  const activeMediaType = localMedia.src ? localMedia.type : mediaType;
  const isVideo = activeMediaType === "video";
  const mediaSource =
    localMedia.src ||
    (source?.trim?.()
      ? source
      : isVideo
        ? FALLBACK_VIDEO
        : FALLBACK_IMAGE);

  return (
    <section className="media-panel mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="media-wrapper mx-auto aspect-video w-full max-w-2xl overflow-hidden rounded-2xl border border-border/40 bg-card/30 shadow-2xl backdrop-blur">
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
      </div>

      <div className="media-controls mt-6 flex flex-col items-center gap-2 text-sm text-muted-foreground">
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
          className="rounded-full border border-border/50 px-5 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-primary hover:text-primary-foreground bg-primary text-primary-foreground cursor-pointer"
        >
          Anadir multimedia
        </button>
        <div className="mt-4 grid w-full gap-3 sm:grid-cols-2">
          <div className="w-full rounded-xl border border-border/40 bg-card/40 px-4 py-3 text-left shadow-inner">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Elementos detectados
            </p>
            <p className="text-2xl font-semibold text-foreground">#{detectedElements}</p>
          </div>
          <div className="w-full rounded-xl border border-border/40 bg-card/40 px-4 py-3 text-left shadow-inner">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Alerta de impactos
            </p>
            <p className="text-2xl font-semibold text-foreground">#{impactAlerts}</p>
          </div>
        </div>
        
        {error ? <p className="upload-error">{error}</p> : null}
      </div>
    </section>
  );
};
