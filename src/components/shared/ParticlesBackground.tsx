'use client';

import { useEffect, useRef } from 'react';

class Point {
  x: number;
  y: number;
  vx: number;
  vy: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
  }
}

export default function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let width = canvas.parentElement!.clientWidth;
    let height = canvas.parentElement!.clientHeight;
    canvas.width = width;
    canvas.height = height;

    let primaryColorHsl: string;
    let accentColorHsl: string;
    try {
      const computedStyle = getComputedStyle(document.documentElement);
      primaryColorHsl = computedStyle.getPropertyValue('--primary').trim();
      accentColorHsl = computedStyle.getPropertyValue('--accent').trim();
    } catch(e) {
      primaryColorHsl = '277 87% 53%';
      accentColorHsl = '187 100% 56%';
    }

    let points: Point[] = [];
    const numberOfPoints = Math.floor((width * height) / 20000);
    const mousePoint = new Point(-1000, -1000);
    mousePoint.vx = 0;
    mousePoint.vy = 0;

    const init = () => {
      points = [];
      for (let i = 0; i < numberOfPoints; i++) {
        points.push(new Point(Math.random() * width, Math.random() * height));
      }
      points.push(mousePoint);
    };

    const onMouseMove = (event: MouseEvent) => {
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        mousePoint.x = event.clientX - rect.left;
        mousePoint.y = event.clientY - rect.top;
      }
    };
    window.addEventListener('mousemove', onMouseMove);

    const onMouseOut = () => {
      mousePoint.x = -1000;
      mousePoint.y = -1000;
    };
    window.addEventListener('mouseout', onMouseOut);
    
    let imageData: ImageData;
    let data: Uint8ClampedArray;

    const draw = () => {
        if (!ctx) return;
        imageData = ctx.getImageData(0, 0, width, height);
        data = imageData.data;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let minDistSq = Infinity;
                
                for(let i = 0; i < points.length; i++) {
                    const p = points[i];
                    const dx = p.x - x;
                    const dy = p.y - y;
                    const distSq = dx * dx + dy * dy;
                    minDistSq = Math.min(minDistSq, distSq);
                }

                const index = (y * width + x) * 4;
                const dist = Math.sqrt(minDistSq);
                
                // Draw cell borders
                if (dist < 2.5) {
                    const intensity = (2.5 - dist) / 2.5;
                    const [h, s, l] = primaryColorHsl.split(" ").map(parseFloat);
                    data[index] = h; // Not used, just placeholder
                    data[index + 1] = s;
                    data[index + 2] = l * intensity;
                } else {
                    data[index + 3] = 0; // Make other pixels transparent
                }
            }
        }

        // Convert HSL to RGB for display
        for (let i = 0; i < data.length; i += 4) {
          if (data[i+3] !== 0) { // only for non-transparent pixels
            const s = data[i+1] / 100;
            const l = data[i+2] / 100;
            const h = parseFloat(primaryColorHsl.split(" ")[0]);

            const c = (1 - Math.abs(2 * l - 1)) * s;
            const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
            const m = l - c / 2;
            let r = 0, g = 0, b = 0;

            if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
            else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
            else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
            else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
            else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
            else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }
            
            data[i] = (r + m) * 255;
            data[i + 1] = (g + m) * 255;
            data[i + 2] = (b + m) * 255;
            data[i + 3] = 255;
          }
        }
        ctx.putImageData(imageData, 0, 0);
    }

    const update = () => {
      for (let i = 0; i < points.length; i++) {
        if (points[i] === mousePoint) continue;
        const p = points[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }
    };
    
    let frameId: number;
    const animate = () => {
      update();
      draw();
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
      window.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />;
}
