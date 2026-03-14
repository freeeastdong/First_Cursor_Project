import { useEffect, useState } from "react";
import "../../styles/ink.css";

interface Splash {
  id: number;
  x: number;
  y: number;
}

export default function InkSplash({ trigger }: { trigger: number }) {
  const [splashes, setSplashes] = useState<Splash[]>([]);

  useEffect(() => {
    if (trigger === 0) return;
    const x = Math.random() * window.innerWidth * 0.6 + window.innerWidth * 0.2;
    const y = Math.random() * window.innerHeight * 0.6 + window.innerHeight * 0.2;
    const id = Date.now();
    setSplashes((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setSplashes((prev) => prev.filter((s) => s.id !== id));
    }, 1500);
  }, [trigger]);

  return (
    <>
      {splashes.map((s) => (
        <div
          key={s.id}
          className="ink-splash"
          style={{ left: s.x, top: s.y }}
        />
      ))}
    </>
  );
}
