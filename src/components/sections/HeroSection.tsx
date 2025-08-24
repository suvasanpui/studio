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
    camera.position.z = 10;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2();

    // Create code texture
    const createCodeTexture = (code: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const context = canvas.getContext('2d');
      if (!context) return new THREE.CanvasTexture(canvas);

      context.fillStyle = 'rgba(10, 20, 40, 0.7)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      context.font = "20px 'Space Mono', monospace";
      context.fillStyle = '#88ddff';
      context.shadowColor = '#00f';
      context.shadowBlur = 10;

      const lines = code.split('\n');
      lines.forEach((line, i) => {
        context.fillText(line, 15, 30 + i * 25);
      });

      return new THREE.CanvasTexture(canvas);
    };

    const codeSnippets = [
`function factorial(n) {
  if (n === 0) {
    return 1;
  }
  return n * factorial(n - 1);
}`,
`const bubbleSort = (arr) => {
  let swapped;
  do {
    swapped = false;
    for (let i = 0; i < arr.length; i++) {
       // ...
    }
  } while (swapped);
}`,
`class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}`,
`const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('Success!');
  }, 1000);
});`
    ];

    const codeBlocks: THREE.Mesh[] = [];
    const planeGeometry = new THREE.PlaneGeometry(8, 4);

    for (let i = 0; i < 20; i++) {
      const codeTexture = createCodeTexture(codeSnippets[i % codeSnippets.length]);
      const planeMaterial = new THREE.MeshBasicMaterial({ 
        map: codeTexture, 
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      });
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      
      plane.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 40 - 20
      );

      plane.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      scene.add(plane);
      codeBlocks.push(plane);
    }
    
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

      codeBlocks.forEach(block => {
        block.rotation.x += 0.001;
        block.rotation.y += 0.002;
      });

      // Make camera follow mouse
      camera.position.x += (mouse.x * 2 - camera.position.x) * 0.02;
      camera.position.y += (mouse.y * 2 - camera.position.y) * 0.02;
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
