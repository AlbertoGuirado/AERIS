import { useEffect, useRef } from "react";

const BACKGROUND_COLOR = "#050505";
const SPACING = 22;
const ARM_LENGTH = 5;
const ARM_WIDTH = 1.5;
const GAP = 0.8;
const CORNER_RADIUS = 1;
const HOVER_RADIUS = 100;
const HEAT_EASING = 0.18;

export const InteractiveCrossBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const crossesRef = useRef([]);
  const layoutRef = useRef({ width: 0, height: 0, ratio: 1 });
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") {
      return;
    }

    const ctx = canvas.getContext("2d");

    const drawRoundedRect = (x, y, width, height, radius) => {
      const r = Math.min(radius, width / 2, height / 2);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + width - r, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + r);
      ctx.lineTo(x + width, y + height - r);
      ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
      ctx.lineTo(x + r, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();
    };

    const drawCross = (x, y, heat) => {
      const mixColor = (start, end) =>
        Math.floor(start + (end - start) * (heat * 0.65));
      const base = 32;
      const r = mixColor(base, 215);
      const g = mixColor(base, 105);
      const b = mixColor(base, 60);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

      if (heat > 0.15) {
        ctx.shadowBlur = 4 * heat;
        ctx.shadowColor = `rgba(220, 120, 60, ${heat * 0.4})`;
      } else {
        ctx.shadowBlur = 0;
      }

      drawRoundedRect(
        x - ARM_WIDTH / 2,
        y - ARM_LENGTH - GAP,
        ARM_WIDTH,
        ARM_LENGTH,
        CORNER_RADIUS
      );
      drawRoundedRect(x + GAP, y - ARM_WIDTH / 2, ARM_LENGTH, ARM_WIDTH, CORNER_RADIUS);
      drawRoundedRect(
        x - ARM_WIDTH / 2,
        y + GAP,
        ARM_WIDTH,
        ARM_LENGTH,
        CORNER_RADIUS
      );
      drawRoundedRect(
        x - ARM_LENGTH - GAP,
        y - ARM_WIDTH / 2,
        ARM_LENGTH,
        ARM_WIDTH,
        CORNER_RADIUS
      );
    };

    const initializeCrosses = () => {
      const { width, height } = layoutRef.current;
      const margin = SPACING * 8;
      const cols = Math.ceil((width + margin) / SPACING);
      const rows = Math.ceil((height + margin) / SPACING);
      const offsetX = -margin / 2;
      const offsetY = -margin / 2;
      const crosses = [];

      for (let row = 0; row <= rows; row += 1) {
        for (let col = 0; col <= cols; col += 1) {
          crosses.push({
            x: offsetX + col * SPACING,
            y: offsetY + row * SPACING,
            heat: 0,
            targetHeat: 0,
          });
        }
      }

      crossesRef.current = crosses;
    };

    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      layoutRef.current = { width, height, ratio };

      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(ratio, ratio);

      initializeCrosses();
    };

    const render = () => {
      const { width, height } = layoutRef.current;
      ctx.fillStyle = BACKGROUND_COLOR;
      ctx.fillRect(0, 0, width, height);

      const { x: mouseX, y: mouseY } = mouseRef.current;

      crossesRef.current.forEach((cross) => {
        const dx = cross.x - mouseX;
        const dy = cross.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < HOVER_RADIUS) {
          const proximity = 1 - distance / HOVER_RADIUS;
          cross.targetHeat = proximity * proximity;
        } else {
          cross.targetHeat = 0;
        }

        cross.heat += (cross.targetHeat - cross.heat) * HEAT_EASING;
        drawCross(cross.x, cross.y, cross.heat);
      });

      animationRef.current = requestAnimationFrame(render);
    };

    const updateMousePosition = (event) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const handlePointerMove = (event) => {
      updateMousePosition(event);
    };

    const handlePointerLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    resizeCanvas();
    animationRef.current = requestAnimationFrame(render);

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
};
