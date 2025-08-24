'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import Link from 'next/link';

const HeroSection = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 250;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);
    
    // Particle setup
    const particleCount = 200;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 500;
        velocities[i] = (Math.random() - 0.5) * 0.5;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: 0x1ee0ff, // Neon Blue
        size: 2,
        blending: THREE.AdditiveBlending,
        transparent: true,
        sizeAttenuation: true,
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
    
    // Line setup
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xa020f0, // Purple
        linewidth: 1,
        transparent: true,
        opacity: 0,
    });
    
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particleCount * particleCount * 3);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    const onMouseMove = (event: MouseEvent) => {
        if (currentMount) {
            mouse.current.x = event.clientX - currentMount.clientWidth / 2;
            mouse.current.y = event.clientY - currentMount.clientHeight / 2;
        }
    }
    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);

      const posAttribute = particles.getAttribute('position') as THREE.BufferAttribute;
      const linePosAttribute = lineGeometry.getAttribute('position') as THREE.BufferAttribute;
      let vertexCount = 0;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        posAttribute.array[i3] += velocities[i3];
        posAttribute.array[i3 + 1] += velocities[i3 + 1];

        // Bounce off walls
        if (posAttribute.array[i3] > 250 || posAttribute.array[i3] < -250) velocities[i3] *= -1;
        if (posAttribute.array[i3+1] > 250 || posAttribute.array[i3+1] < -250) velocities[i3+1] *= -1;

        // Check distance to other particles
        for(let j = i + 1; j < particleCount; j++){
            const j3 = j * 3;
            const dx = posAttribute.array[i3] - posAttribute.array[j3];
            const dy = posAttribute.array[i3+1] - posAttribute.array[j3+1];
            const dist = Math.sqrt(dx * dx + dy * dy);

            if(dist < 50) {
                linePosAttribute.array[vertexCount * 3] = posAttribute.array[i3];
                linePosAttribute.array[vertexCount * 3 + 1] = posAttribute.array[i3 + 1];
                linePosAttribute.array[vertexCount * 3 + 2] = posAttribute.array[i3 + 2];
                vertexCount++;
                linePosAttribute.array[vertexCount * 3] = posAttribute.array[j3];
                linePosAttribute.array[vertexCount * 3 + 1] = posAttribute.array[j3 + 1];
                linePosAttribute.array[vertexCount * 3 + 2] = posAttribute.array[j3 + 2];
                vertexCount++;
            }
        }
      }
      
      linePosAttribute.needsUpdate = true;
      posAttribute.needsUpdate = true;
      lineGeometry.setDrawRange(0, vertexCount);

      // Animate line opacity based on distance from center
      const distanceToCenter = Math.sqrt(camera.position.x * camera.position.x + camera.position.y * camera.position.y);
      lines.material.opacity = Math.max(0, 1 - distanceToCenter / 400);

      // Mouse interaction
      camera.position.x += (mouse.current.x * 0.2 - camera.position.x) * 0.02;
      camera.position.y += (-mouse.current.y * 0.2 - camera.position.y) * 0.02;
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
