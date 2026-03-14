import { useEffect, useRef } from "react";

export default function InkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const blobs: {
      x: number;
      y: number;
      radius: number;
      dx: number;
      dy: number;
      opacity: number;
    }[] = [];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 6; i++) {
      blobs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 100 + Math.random() * 200,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        opacity: 0.02 + Math.random() * 0.03,
      });
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (const blob of blobs) {
        blob.x += blob.dx;
        blob.y += blob.dy;

        if (blob.x < -blob.radius) blob.x = canvas!.width + blob.radius;
        if (blob.x > canvas!.width + blob.radius) blob.x = -blob.radius;
        if (blob.y < -blob.radius) blob.y = canvas!.height + blob.radius;
        if (blob.y > canvas!.height + blob.radius) blob.y = -blob.radius;

        const gradient = ctx!.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          blob.radius
        );
        gradient.addColorStop(0, `rgba(44, 44, 44, ${blob.opacity})`);
        gradient.addColorStop(0.5, `rgba(44, 44, 44, ${blob.opacity * 0.5})`);
        gradient.addColorStop(1, "transparent");

        ctx!.fillStyle = gradient;
        ctx!.beginPath();
        ctx!.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx!.fill();
      }

      animationId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
