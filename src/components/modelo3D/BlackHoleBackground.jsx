const BlackHoleBackground = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
        background: `
          radial-gradient(circle at center, 
            rgba(0, 0, 0, 0.8) 0%, 
            rgba(20, 20, 40, 0.9) 30%, 
            rgba(0, 0, 0, 0.95) 70%,
            rgba(0, 0, 0, 1) 100%
          ),
          linear-gradient(45deg, 
            rgba(100, 0, 200, 0.1) 0%, 
            rgba(0, 100, 200, 0.1) 50%, 
            rgba(200, 0, 100, 0.1) 100%
          )
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Animated particles effect */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `
            radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.3), transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.2), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.4), transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.3), transparent),
            radial-gradient(2px 2px at 160px 30px, rgba(255,255,255,0.2), transparent)
          `,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 100px",
          animation: "twinkle 4s ease-in-out infinite alternate",
        }}
      />

      {/* Sketchfab iframe as overlay */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60%",
          height: "60%",
          opacity: 0.3,
          borderRadius: "50%",
          overflow: "hidden",
        }}
      >
        <iframe
          title="blackhole skyball"
          frameBorder="0"
          allowFullScreen
          mozAllowFullScreen="true"
          webkitAllowFullScreen="true"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          xr-spatial-tracking
          execution-while-out-of-viewport
          execution-while-not-rendered
          web-share
          src="https://sketchfab.com/models/a7654f0b750640a68f188d1ba098fb10/embed"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            borderRadius: "50%",
          }}
        />
      </div>
    </div>
  );
};

export default BlackHoleBackground;
