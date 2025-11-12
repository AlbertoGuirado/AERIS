import Cristal from "./Cristal";

export const Author = () => {
  return (
    <section id="author" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          Author
        </h2>
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">
            <span className="text-primary">Alberto Guirado</span>, Computer Engineer & AI Engineer
          </h3>
          <p className="text-muted-foreground">
            Alberto holds a degree in Computer Engineering and currently works as an AI Engineer. He designs and implements machine learning solutions that bridge research and production, with an emphasis on robust, scalable systems.
          </p>
          <p className="text-muted-foreground">
            His expertise covers the full ML lifecycle — from data preparation and model development to deployment and monitoring — and he applies rigorous engineering practices to deliver reliable results in real-world environments.
          </p>
          <p className="text-muted-foreground">
            Alberto is motivated to apply his technical experience and collaborative approach to challenges in the aerospace sector and other high-impact domains, continuously learning and contributing to principled, production-ready solutions.
          </p>
          <p className="text-muted-foreground">
            In parallel, he investigates blockchain security and smart contract auditing on Ethereum using Solidity, focusing on vulnerability analysis, secure coding patterns, and risk mitigation.
          </p>
         
          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
            <Cristal />
          </div>
        </div>
      </div>
    </section>
  );
};
