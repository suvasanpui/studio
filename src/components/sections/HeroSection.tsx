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
    camera.position.z = 30;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2();

    // Create a grid of cubes
    const cubes: THREE.Mesh[] = [];
    const gridSize = 20;
    const spacing = 2;
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const material = new THREE.MeshPhongMaterial({ 
                color: new THREE.Color(`hsl(${Math.random() * 360}, 100%, 75%)`),
                specular: 0x111111,
                shininess: 100
            });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(
                (i - gridSize / 2) * spacing,
                0,
                (j - gridSize / 2) * spacing,
            );
            scene.add(cube);
            cubes.push(cube);
        }
    }

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(1, 1, 1);
    scene.add(light);
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const onMouseMove = (event: MouseEvent) => {
      if (currentMount) {
        mouse.x = (event.clientX / currentMount.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / currentMount.clientHeight) * 2 + 1;
      }
    };
    window.addEventListener('mousemove', onMouseMove);

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Animate cubes
      cubes.forEach(cube => {
          const dist = cube.position.distanceTo(new THREE.Vector3(mouse.x * 10, 0, mouse.y * 10));
          const waveX = Math.sin(cube.position.x * 0.5 + elapsedTime);
          const waveZ = Math.sin(cube.position.z * 0.5 + elapsedTime);
          const ripple = Math.sin(dist * 0.5 - elapsedTime);

          cube.position.y = waveX + waveZ + ripple * 2;
          cube.rotation.y += 0.01;
      });

      // Move camera around the scene
      camera.position.x = Math.sin(elapsedTime * 0.2) * 20;
      camera.position.z = Math.cos(elapsedTime * 0.2) * 30;
      camera.lookAt(scene.position);
      
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        if (!currentMount) return;
        const width = currentMount.clientWidth;
        const height = currentMount.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };
    handleResize();
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
