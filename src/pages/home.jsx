import { ThemeToggle } from "../components/ThemeToggle";
import { Navbar } from "../components/navbar";

import { InteractiveCrossBackground } from "../components/InteractiveCrossBackground";
import { Video } from "../components/video";
import { Sliders } from "../components/Sliders";
import { Proyect } from "../components/Proyect";
import { Author } from "../components/Author";

import {VideoCopy} from "../components/video copy.jsx";

export const Home = () => {
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
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 lg:flex-row lg:items-start">
          <div className="flex-1 w-full">
            <VideoCopy />
          </div>
          <div className="w-full lg:max-w-sm">
            <Sliders />
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
