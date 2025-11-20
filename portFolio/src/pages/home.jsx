import { useState } from "react";
import { ThemeToggle } from "../components/ThemeToggle";
import { Navbar } from "../components/navbar";
import { InteractiveCrossBackground } from "../components/InteractiveCrossBackground";
import { Sliders } from "../components/Sliders";
import { Proyect } from "../components/Proyect";
import { Author } from "../components/Author";
import { VideoCopy } from "../components/VideoFrame.jsx";
import { Building } from "../components/building.jsx";

const DEFAULT_IMPACT_CONFIDENCE = 0.3;
const DEFAULT_OBJECT_CONFIDENCE = 0.02;

export const Home = () => {
  const [impactConfidence, setImpactConfidence] = useState(
    DEFAULT_IMPACT_CONFIDENCE
  );
  const [objectConfidence, setObjectConfidence] = useState(
    DEFAULT_OBJECT_CONFIDENCE
  );

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      {/* Theme Toggle */}

      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <InteractiveCrossBackground />

      {/* Main content with higher z-index */}
      <div className="relative z-10">
        <Navbar />
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-1 py-14 lg:flex-row lg:items-start">
          <div className="flex-1 w-full">
            <VideoCopy
              detectedElements={5}
              impactAlerts={2}
              impactConfidence={impactConfidence}
              objectConfidence={objectConfidence}
            />
          </div>
          <div className="w-full lg:max-w-sm py-7 space-y-6">
            <Sliders
              impactConfidence={impactConfidence}
              objectConfidence={objectConfidence}
              onImpactChange={setImpactConfidence}
              onObjectChange={setObjectConfidence}
            />
            <Building detailLevel={1} />
          </div>
        </div>
        <Proyect />
        <Author />
        {/* Footer */}
        <footer className="py-8 text-center text-muted-foreground border-t">
          <p>&copy; 2025</p>
        </footer>
      </div>
    </div>
  );
};
