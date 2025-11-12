import { Briefcase, Code, icons, User, Rocket } from "lucide-react";
import Cristal from "./Cristal";
import LiquidGlass from "./LiquidGlass";

export const AboutSection = () => {
  return (
    <section id="about" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          About <span className="text-primary">AERIS</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start md:items-center">
          {/* Left Column */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">
              Advanced EventRecognition ISS
            </h3>
            <p className="text-muted-foreground text-left">
              I hold a degree in Computer Engineering and currently work as an
              AI Engineer. My main focus is on Artificial Intelligence and
              Machine Learning, where I enjoy building intelligent solutions to
              real-world problems.
            </p>
            <p className="text-muted-foreground text-left">
              I am also exploring blockchain security, with a particular
              interest in auditing smart contracts on the Ethereum blockchain
              using Solidity.
            </p>
            <p className="text-muted-foreground text-left">
              I am eager to apply my technical skills and passion for innovation
              to the aerospace industry and beyond.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
              <Cristal />
            </div>
          </div>
          {/* Right Column */}
          <div className="space-y-6 flex flex-col sm:items-center justify-center ">
            <LiquidGlass className="p-1 mx-auto">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-lg">
                    Engineer & Data Systems
                  </h4>
                  <p className="text-muted-foreground">
                    Experienced in developing predictive models, fine-tuning
                    machine learning algorithms, creating analytical dashboards,
                    and handling large-scale data systems.
                  </p>
                </div>
              </div>
            </LiquidGlass>
            <LiquidGlass className="p-1 mx-auto">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-lg">
                    Innovation & Emerging Technologies
                  </h4>
                  <p className="text-muted-foreground">
                    Focused on blockchain development, AI agent design, and
                    advanced automation. Passionate about integrating artificial
                    intelligence, big data, and decentralized technologies to
                    create scalable and intelligent solutions.
                  </p>
                </div>
              </div>
            </LiquidGlass>
            <LiquidGlass className="p-1 mx-auto">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-lg">Project Management</h4>
                  <p className="text-muted-foreground">
                    Leading projects from conception to completion with agile
                    methodologies.
                  </p>
                </div>
              </div>
            </LiquidGlass>
            <LiquidGlass className="p-1 mx-auto">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-lg">Space enthusiast</h4>
                  <p className="text-muted-foreground">
                    Looking for applying my knowledge in space exploring
                    industry, astrophysics and space engineering.
                  </p>
                </div>
              </div>
            </LiquidGlass>
          </div>
        </div>
      </div>
    </section>
  );
};
