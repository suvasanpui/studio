'use client';

import { useEffect, useRef } from 'react';

class Hexagon {
  x: number;
  y: number;
  size: number;
  targetOpacity: number;
  opacity: number;

  constructor(x: number, y: number, size: number) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.targetOpacity = 0.1;
    this.opacity = 0.1;
  }

  draw(ctx: CanvasRenderingContext2D, color: string) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;

    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const x_i = this.x + this.size * Math.cos(angle);
      const y_i = this.y + this.size * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(x_i, y_i);
      } else {
        ctx.lineTo(x_i, y_i);
      }
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  update() {
    // Smoothly transition to the target opacity
    this.opacity += (this.targetOpacity - this.opacity) * 0.05;
  }
}

export default function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.parentElement!.clientWidth;
    let height = canvas.parentElement!.clientHeight;
    canvas.width = width;
    canvas.height = height;

    let primaryColor: string;
    try {
      const computedStyle = getComputedStyle(document.documentElement);
      const primaryColorHsl = computedStyle.getPropertyValue('--primary').trim();
      const [h, s, l] = primaryColorHsl.split(" ").map(s => s.replace('%',''));
      primaryColor = `hsl(${h}, ${s}%, ${l}%)`;
    } catch(e) {
      primaryColor = `hsl(277, 87%, 53%)`;
    }
    
    let hexagons: Hexagon[] = [];
    const hexSize = 30;
    const hexHeight = hexSize * Math.sqrt(3);
    const hexWidth = hexSize * 2;
    const vertDist = hexHeight;
    const horizDist = hexWidth * 3/4;

    const init = () => {
      hexagons = [];
      const rows = Math.ceil(height / vertDist) + 1;
      const cols = Math.ceil(width / horizDist) + 1;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * horizDist;
          const y = row * vertDist + (col % 2 === 1 ? vertDist / 2 : 0);
          hexagons.push(new Hexagon(x, y, hexSize));
        }
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        mousePos.current = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
      }
    };
    window.addEventListener('mousemove', onMouseMove);

    const onMouseOut = () => {
      mousePos.current = { x: -1000, y: -1000 };
    };
    canvas.addEventListener('mouseout', onMouseOut);
    
    let frameId: number;
    const animate = () => {
        ctx.clearRect(0, 0, width, height);

        hexagons.forEach(hex => {
            const dx = hex.x - mousePos.current.x;
            const dy = hex.y - mousePos.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            const maxDist = 200;
            const mappedOpacity = Math.max(0.1, 1 - (dist / maxDist));
            hex.targetOpacity = mappedOpacity;

            hex.update();
            hex.draw(ctx, primaryColor);
        });

      frameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width;
      canvas.height = height;
      init();
    };

    init();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />;
}
