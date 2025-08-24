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

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 50;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);
    
    const cubes: (THREE.Mesh & { rotationSpeed?: { x: number; y: number } })[] = [];
    const cubeCount = 150;
    const geometry = new THREE.BoxGeometry(2, 2, 2);

    const colors = [new THREE.Color(0xa020f0), new THREE.Color(0x1ee0ff)]; // Purple and Neon Blue

    for (let i = 0; i < cubeCount; i++) {
      const material = new THREE.MeshBasicMaterial({ color: colors[Math.floor(Math.random() * colors.length)] });
      const cube = new THREE.Mesh(geometry, material) as THREE.Mesh & { rotationSpeed?: { x: number; y: number } };

      cube.position.x = (Math.random() - 0.5) * 100;
      cube.position.y = (Math.random() - 0.5) * 100;
      cube.position.z = (Math.random() - 0.5) * 100;

      cube.rotation.x = Math.random() * Math.PI;
      cube.rotation.y = Math.random() * Math.PI;

      const scale = Math.random() * 0.5 + 0.5;
      cube.scale.set(scale, scale, scale);
      
      cube.rotationSpeed = {
        x: Math.random() * 0.01,
        y: Math.random() * 0.01,
      };

      cubes.push(cube);
      scene.add(cube);
    }
    
    const onMouseMove = (event: MouseEvent) => {
        mouse.current.x = (event.clientX / window.innerWidth) - 0.5;
        mouse.current.y = (event.clientY / window.innerHeight) - 0.5;
    }
    window.addEventListener('mousemove', onMouseMove);

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      
      cubes.forEach(cube => {
          if(cube.rotationSpeed) {
            cube.rotation.x += cube.rotationSpeed.x;
            cube.rotation.y += cube.rotationSpeed.y;
          }
      });
      
      camera.position.x += (mouse.current.x * 20 - camera.position.x) * 0.05;
      camera.position.y += (-mouse.current.y * 20 - camera.position.y) * 0.05;
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
