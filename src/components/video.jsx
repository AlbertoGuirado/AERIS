import { useRef } from "react";

const FALLBACK_VIDEO =
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
const FALLBACK_IMAGE =
  "FitYou.png";

export const Video = ({
  source,
  mediaType = "video",
  onUpload,
  error,
  autoPlay = true,
}) => {
  const inputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file && typeof onUpload === "function") {
      onUpload(file);
    }
    event.target.value = "";
  };

  const isVideo = mediaType === "image";
  const mediaSource = source?.trim?.()
    ? source
    : isVideo
      ? FALLBACK_VIDEO
      : FALLBACK_IMAGE;

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

      {onUpload ? (
        <div className="media-controls mt-6 flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <label className="upload-button">
            <input
              ref={inputRef}
              type="file"
              accept="video/*,image/*"
              onChange={handleFileChange}
              hidden
            />
            <span>Agregar video o imagen</span>
          </label>
          <p className="upload-hint text-center text-xs sm:text-sm">
            Formatos compatibles: MP4, MOV, JPG, PNG y más.
          </p>
          {error ? <p className="upload-error">{error}</p> : null}
        </div>
      ) : null}
    </section>
  );
};
