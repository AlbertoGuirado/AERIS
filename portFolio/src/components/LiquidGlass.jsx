export default function LiquidGlass({ title, children, className = "", isScrolled = false }) {
  return (
    <div
      className={`relative rounded-[20px] overflow-hidden border border-white/10 ${className}`}
      style={{
        backgroundColor: isScrolled
          ? "rgba(255,255,255,0.15)"
          : "rgba(255,255,255,0.05)", // slightly darker glass when scrolled
      }}
    >
      {/* Background with distortion effect */}
      <div
        className="absolute inset-0 rounded-2xl backdrop-blur-sm"
        style={{ filter: "url(#glass-distortion)", zIndex: 0 }}
      />

      {/* Content above the background */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-4">
        {title && <h3 className="text-2xl font-semibold mb-2 text-center">{title}</h3>}
        {children}
      </div>

      {/* Invisible SVG filter required in the DOM */}
      <svg className="absolute w-0 h-0">
        <filter id="glass-distortion">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.01 0.01"
            numOctaves="1"
            seed="5"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="3" result="softmap" />
          <feDisplacementMap in="SourceGraphic" in2="softmap" scale="150" />
        </filter>
      </svg>
    </div>
  );
}
