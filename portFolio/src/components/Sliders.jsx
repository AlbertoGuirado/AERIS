import { useEffect, useId, useState } from "react";

const clampConfidence = (value) => {
  if (Number.isFinite(value)) {
    if (value < 0) return 0;
    if (value > 1) return 1;
    return value;
  }
  return 0;
};

const formatConfidence = (value) => clampConfidence(value).toFixed(2);

const SliderControl = ({ label, value, onChange }) => {
  const sliderId = useId();
  const safeValue = clampConfidence(value);

  const handleChange = (event) => {
    const nextValue = clampConfidence(parseFloat(event.currentTarget.value));
    if (typeof onChange === "function") {
      onChange(nextValue);
    }
  };

  return (
    <div className="rounded-2xl border border-border/40 bg-card/40 px-4 py-3 shadow-lg transition hover:border-primary/60 hover:shadow-primary/10">
      <label
        className="flex items-center justify-between text-sm font-medium text-muted-foreground"
        htmlFor={sliderId}
      >
        <span className="text-foreground">{label}</span>
        <span className="tabular-nums text-primary">{formatConfidence(safeValue)}</span>
      </label>
      <input
        id={sliderId}
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={safeValue}
        onChange={handleChange}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={1}
        aria-valuenow={safeValue}
        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-foreground/10 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
        style={{ accentColor: "hsl(var(--primary))" }}
      />
    </div>
  );
};

export const Sliders = ({
  impactConfidence = 0.3,
  objectConfidence = 0.02,
  onImpactChange,
  onObjectChange,
}) => {
  const [localImpact, setLocalImpact] = useState(() =>
    clampConfidence(impactConfidence)
  );
  const [localObject, setLocalObject] = useState(() =>
    clampConfidence(objectConfidence)
  );

  useEffect(() => {
    setLocalImpact(clampConfidence(impactConfidence));
  }, [impactConfidence]);

  useEffect(() => {
    setLocalObject(clampConfidence(objectConfidence));
  }, [objectConfidence]);

  const handleImpactChange = (value) => {
    if (typeof onImpactChange === "function") {
      onImpactChange(value);
    } else {
      setLocalImpact(value);
    }
  };

  const handleObjectChange = (value) => {
    if (typeof onObjectChange === "function") {
      onObjectChange(value);
    } else {
      setLocalObject(value);
    }
  };

  const impactValue =
    typeof onImpactChange === "function"
      ? clampConfidence(impactConfidence)
      : localImpact;
  const objectValue =
    typeof onObjectChange === "function"
      ? clampConfidence(objectConfidence)
      : localObject;

  return (
    <section className="controls mx-auto mt-10 w-full max-w-2xl rounded-3xl border border-border/50 bg-background/40 p-6 shadow-2xl backdrop-blur">
      <div className="mb-6 flex flex-col gap-2 text-left">
        <p className="text-xs uppercase tracking-[0.3em] text-primary/80">
          Centro de calibracion
        </p>
        <h2 className="text-2xl font-semibold text-foreground">
          Ajustes de modelos
        </h2>
        <p className="text-sm text-muted-foreground">
          Ajusta manualmente la sensibilidad de los modelos ISS para equilibrar
          la deteccion de impacto y objetos.
        </p>
      </div>

      <div className="space-y-4">
        <SliderControl
          label="Conf. modelo ISS_Impact"
          value={impactValue}
          onChange={handleImpactChange}
        />
        <SliderControl
          label="Conf. modelo ISS_Object"
          value={objectValue}
          onChange={handleObjectChange}
        />
      </div>
    </section>
  );
};
