import { Brain, Database, Gauge, Layers } from "lucide-react";

const summaryCards = [
  {
    title: "Dataset",
    value: "38K frames",
    description:
      "Secuencias EVA, cámaras exteriores de la ISS y renders sintéticos con randomización para cubrir condiciones de luz extremas.",
    Icon: Database,
  },
  {
    title: "División",
    value: "70% / 20% / 10%",
    description:
      "Entrenamiento, validación y test manteniendo balance día/noche y escenarios de actitud orbital.",
    Icon: Layers,
  },
  {
    title: "Modelo",
    value: "YOLOv8n + LSTM",
    description:
      "Detector ligero cuantizado a INT8 y suavizado temporal para reducir falsos positivos por reflejos.",
    Icon: Brain,
  },
  {
    title: "Rendimiento",
    value: "92% F1 · 210 ms",
    description:
      "Mediana de inferencia en Jetson Orin Nano con límite de 8 GB y respuesta en menos de 250 ms.",
    Icon: Gauge,
  },
];

export const Proyect = () => {
  return (
    <section id="model" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-primary/80">
            ML Mission Brief
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Resumen del pipeline de detección
          </h2>
          <p className="text-muted-foreground">
            El sistema procesa flujo continuo de video exterior de la ISS,
            limpia ruido de micro-partículas y evalúa eventos de impacto en
            tiempo real, priorizando latencia baja sobre consumo energético.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map(({ title, value, description, Icon }) => (
            <div
              key={title}
              className="rounded-3xl border border-border/50 bg-background/60 p-6 shadow-2xl backdrop-blur"
            >
              <div className="flex items-center gap-3 text-primary">
                <Icon className="h-6 w-6" />
                <p className="text-xs uppercase tracking-[0.35em]">{title}</p>
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-foreground">
                {value}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                {description}
              </p>
            </div>
            
            
          ))}
          
        </div>
        <div className="pt-10 opacity-0 animate-fade-in-delay-4">
          <a
            href="https://github.com/ISS-AERIS/aeris-impact-detector"
            target="_blank"
            rel="noopener noreferrer"
            className="cosmic-button"
          >
            Check the model
          </a>
        </div>
      </div>
    </section>
  );
};
