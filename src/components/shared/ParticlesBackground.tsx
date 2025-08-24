'use client';

import { useEffect, useRef } from 'react';

class Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  
  constructor(x: number, y: number, size: number, vx: number, vy: number) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.vx = vx;
    this.vy = vy;
  }
  
  draw(ctx: CanvasRenderingContext2D, color: string) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = color;
    ctx.fill();
  }
  
  update(width: number, height: number, mouse: { x: number; y: number, radius: number }) {
    if (this.x < 0 || this.x > width) {
      this.vx = -this.vx;
    }
    if (this.y < 0 || this.y > height) {
      this.vy = -this.vy;
    }

    // Mouse collision
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < mouse.radius + this.size) {
        // Push particle away from mouse
        this.x -= this.vx * 2;
        this.y -= this.vy * 2;
    }
    
    this.x += this.vx;
    this.y += this.vy;
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
    try {
      const computedStyle = getComputedStyle(document.documentElement);
      primaryColorHsl = `hsla(${computedStyle.getPropertyValue('--primary').trim()}, 0.8)`;
    } catch(e) {
      primaryColorHsl = 'hsla(277, 87%, 53%, 0.8)';
    }
    
    let particles: Particle[] = [];
    const numberOfParticles = (canvas.height * canvas.width) / 9000;
    
    const init = () => {
      particles = [];
      for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 2 + 1;
        const x = Math.random() * (width - size * 2) + size;
        const y = Math.random() * (height - size * 2) + size;
        const vx = (Math.random() - 0.5) * 0.5;
        const vy = (Math.random() - 0.5) * 0.5;
        particles.push(new Particle(x, y, size, vx, vy));
      }
    };
    
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 100
    };

    const onMouseMove = (event: MouseEvent) => {
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            mouse.x = event.clientX - rect.left;
            mouse.y = event.clientY - rect.top;
        }
    };
    window.addEventListener('mousemove', onMouseMove);

    const onMouseOut = () => {
        mouse.x = -1000;
        mouse.y = -1000;
    }
    window.addEventListener('mouseout', onMouseOut)

    const connect = () => {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const connectDistance = 120;

                if (distance < connectDistance) {
                    opacityValue = 1 - (distance / connectDistance);
                    ctx.strokeStyle = primaryColorHsl.replace('0.8', opacityValue.toString());
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    };

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update(width, height, mouse);
        p.draw(ctx, primaryColorHsl);
      });
      connect();
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