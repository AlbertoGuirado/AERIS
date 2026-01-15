import { Brain, Database, Gauge, Layers } from "lucide-react";
const summaryCards = [
  {
    title: "Dataset",
    value: "External + Synthetic",
    description:
      "Based on publicly available ISS imagery and complemented with a synthetic dataset generated via domain randomization (lighting, orientation, noise, textures) to improve robustness in extreme conditions and micro-impact detection.",
    Icon: Database,
  },
  {
    title: "Split",
    value: "70 / 20 / 10",
    description:
      "Train/Validation/Test, ensuring zero overlap between models (ISS and Impacts) for an isolated and rigorous evaluation of performance by object type.",
    Icon: Layers,
  },
  {
    title: "Model",
    value: "YOLOv12n/m (Dual)",
    description:
      "Optimized YOLOv12 architecture organized into two independent models: ISS Model (structures) and Impacts Model (precise micro-debris detection with automatic IoU calculation).",
    Icon: Brain,
  },
  {
    title: "Performance",
    value: "mAP50 (0.65–0.70)",
    description:
      "mAP50 between 0.65–0.70 in the ISS Model. Validated in real-time with stable inference and no frame loss on an RTX 3050, even with limited VRAM.",
    Icon: Gauge,
  },
];

export const Proyect = () => {
  return (
    <section id="model" className="py-14 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-3xl font-bold">
          <span className="text-primary text-4xl md:text-5xl inline-block ">A</span>erospace{" "}
          <span className="text-primary text-4xl md:text-5xl inline-block ">E</span>xternal{" "}
          <span className="text-primary text-4xl md:text-5xl inline-block ">R</span>isk{" "}
          <span className="text-primary text-4xl md:text-5xl inline-block ">I</span>dentification{" "}
          <span className="text-primary text-4xl md:text-5xl inline-block ">S</span>ystem
        </h2>
        <img
          src="/icons/icondef.png"
          alt="AERIS logo"
          className="mx-auto my-6 h-100 w-auto object-contain"
          loading="lazy"
        />
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-primary/80">
            ML Mission Brief
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Detection Pipeline Overview
          </h2>
          <p className="text-muted-foreground">
            AERIS (Aerospace External Risk Identification System) is a critical Artificial Intelligence platform leveraging a specialized dual YOLOv12 model architecture for high-precision, real-time detection and analysis of micro-impacts and structural damage on high-value orbital assets.
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
        
      </div>
    </section>
  );
};
