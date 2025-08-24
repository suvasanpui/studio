'use client';

import { useEffect, useRef } from 'react';

class Ball {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  color: string;

  constructor(x: number, y: number, r: number, color: string) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(width: number, height: number, mouse: { x: number; y: number }) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < this.r || this.x > width - this.r) this.vx *= -1;
    if (this.y < this.r || this.y > height - this.r) this.vy *= -1;

    // Mouse interaction
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 150) {
      this.x += dx / dist * 0.5;
      this.y += dy / dist * 0.5;
    }
  }
}

export default function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.parentElement!.clientWidth;
    let height = canvas.parentElement!.clientHeight;
    canvas.width = width;
    canvas.height = height;

    let primaryColorHsl: string;
    let accentColorHsl: string;

    try {
      const computedStyle = getComputedStyle(document.documentElement);
      primaryColorHsl = `hsl(${computedStyle.getPropertyValue('--primary').trim()})`;
      accentColorHsl = `hsl(${computedStyle.getPropertyValue('--accent').trim()})`;
    } catch(e) {
      primaryColorHsl = '#A020F0';
      accentColorHsl = '#1EE0FF';
    }

    const balls: Ball[] = [];
    const numBalls = 20;
    for (let i = 0; i < numBalls; i++) {
      balls.push(new Ball(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 30 + 15,
        Math.random() > 0.5 ? primaryColorHsl : accentColorHsl
      ));
    }

    const mouse = { x: -1000, y: -1000 };
    const onMouseMove = (event: MouseEvent) => {
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
      }
    };
    window.addEventListener('mousemove', onMouseMove);
    
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, width, height);
      
      ctx.filter = 'blur(30px) contrast(30)';
      
      balls.forEach(ball => {
        ball.update(width, height, mouse);
        ball.draw(ctx);
      });
      
      ctx.filter = 'none';
    };
    animate();

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />;
}
