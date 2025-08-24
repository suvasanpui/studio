'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import Link from 'next/link';

const HeroSection = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 50, 100);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);
    
    const clock = new THREE.Clock();
    const mouse = new THREE.Vector2(-1, -1);
    const raycaster = new THREE.Raycaster();

    // Wave setup
    const waveWidth = 100;
    const waveHeight = 100;
    const geometry = new THREE.PlaneGeometry(500, 500, waveWidth, waveHeight);
    
    // We need a copy of original positions to reset calculations each frame
    const originalPositions = new Float32Array(geometry.attributes.position.array);

    const material = new THREE.PointsMaterial({
        color: 0x8800ff,
        size: 2,
        blending: THREE.AdditiveBlending,
        transparent: true,
        sizeAttenuation: true,
    });
    
    const points = new THREE.Points(geometry, material);
    points.rotation.x = -Math.PI / 3;
    scene.add(points);

    const onMouseMove = (event: MouseEvent) => {
        if (currentMount) {
            // Convert mouse position to normalized device coordinates (-1 to +1)
            mouse.x = (event.clientX / currentMount.clientWidth) * 2 - 1;
            mouse.y = -(event.clientY / currentMount.clientHeight) * 2 + 1;
        }
    }
    window.addEventListener('mousemove', onMouseMove);

    let hoverPoint: THREE.Vector3 | null = null;

    const animate = () => {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      
      // Update raycaster
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(points);
      if (intersects.length > 0) {
        hoverPoint = intersects[0].point;
      } else {
        hoverPoint = null;
      }
      
      const positions = geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = originalPositions[i];
        const y = originalPositions[i+1];
        
        // Base wave animation
        const z = Math.sin(x * 0.05 + elapsedTime) * 10 + Math.cos(y * 0.05 + elapsedTime) * 10;
        positions[i+2] = z;

        // Mouse ripple effect
        if(hoverPoint) {
            const currentPoint = new THREE.Vector3(x, y, z).applyMatrix4(points.matrixWorld);
            const dist = currentPoint.distanceTo(hoverPoint);
            const rippleFactor = Math.max(0, 1 - dist / 50);
            positions[i+2] += Math.sin(dist * 0.5 - elapsedTime * 5) * 20 * rippleFactor;
        }
      }

      geometry.attributes.position.needsUpdate = true;
      
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div ref={mountRef} className="absolute top-0 left-0 w-full h-full" />
      <div className="absolute top-0 left-0 w-full h-full bg-background/80" />

      <motion.div 
        className="relative z-10 text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.h1 
          className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">Suva Sanpui</span>
        </motion.h1>
        <motion.p 
          className="mt-4 font-body text-xl md:text-2xl lg:text-3xl text-foreground/80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        >
          Full Stack Developer
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="mt-8"
        >
            <Button asChild size="lg" className="font-headline text-lg">
                <Link href="#projects">View My Work</Link>
            </Button>
        </motion.div>
      </motion.div>
      
      <motion.div
        className="absolute bottom-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1, repeat: Infinity, repeatType: 'reverse' }}
      >
        <Link href="#about" aria-label="Scroll to about section">
            <ArrowDown className="w-8 h-8 text-foreground/50" />
        </Link>
      </motion.div>
    </section>
  );
};

export default HeroSection;
