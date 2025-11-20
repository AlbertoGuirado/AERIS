import Cristal from "./Cristal";

export const Author = () => {
  return (
    <section id="author" className="py-1 px-4 relative">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-5">
          Author
        </h2>
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">
             <p className="text-[0.95em] uppercase tracking-[0.5em] text-primary/80 py-6">
            Alberto Guirado Fernandez
          </p>
            <span className="text-primary">B. Eng</span> - Computer Scientist & AI Engineer
          </h3>
    
         
          <div className="flex flex-col sm:flex-row gap-4 py-6 pt-4 justify-center">
            <Cristal />
          </div>
        </div>
      </div>
    </section>
  );
};
