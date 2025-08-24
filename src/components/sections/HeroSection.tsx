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
    camera.position.z = 50;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    const clock = new THREE.Clock();
    const mouse = new THREE.Vector2();

    const grid_size = 20;
    const grid_divs = 20;
    const point_count = (grid_divs + 1) * (grid_divs + 1);

    const points = new THREE.BufferGeometry();
    const positions = new Float32Array(point_count * 3);

    let i = 0;
    for (let x = 0; x <= grid_divs; x++) {
      for (let y = 0; y <= grid_divs; y++) {
        positions[i * 3] = x * (grid_size / grid_divs) - grid_size / 2;
        positions[i * 3 + 1] = y * (grid_size / grid_divs) - grid_size / 2;
        positions[i * 3 + 2] = 0;
        i++;
      }
    }

    points.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pointsMaterial = new THREE.PointsMaterial({ color: 0x1EE0FF, size: 0.1 });
    const nodes = new THREE.Points(points, pointsMaterial);
    scene.add(nodes);
    
    // Lines
    const lines = new Set<string>();
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = [];

    for (let i=0; i < point_count; i++) {
        for (let j=i+1; j < point_count; j++) {
            if (Math.random() > 0.98) {
                const p1 = new THREE.Vector3().fromBufferAttribute(points.attributes.position, i);
                const p2 = new THREE.Vector3().fromBufferAttribute(points.attributes.position, j);
                if (p1.distanceTo(p2) < grid_size / grid_divs * 3) {
                    linePositions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
                    lines.add(`${i},${j}`);
                }
            }
        }
    }

    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xA020F0, opacity: 0.2, transparent: true });
    const traces = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(traces);

    // Pulses
    const pulseGeometry = new THREE.BufferGeometry();
    const pulsePositions = new Float32Array(lines.size * 3);
    const pulseData = [];
    let pulseIndex = 0;
    for (const line of lines) {
        const [startIdx, endIdx] = line.split(',').map(Number);
        const p1 = new THREE.Vector3().fromBufferAttribute(points.attributes.position, startIdx);
        pulsePositions[pulseIndex * 3] = p1.x;
        pulsePositions[pulseIndex * 3 + 1] = p1.y;
        pulsePositions[pulseIndex * 3 + 2] = p1.z;
        pulseData.push({
            start: startIdx,
            end: endIdx,
            progress: Math.random(),
            speed: Math.random() * 0.005 + 0.001
        })
        pulseIndex++;
    }
    
    pulseGeometry.setAttribute('position', new THREE.BufferAttribute(pulsePositions, 3));
    const pulseMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.3, blending: THREE.AdditiveBlending, transparent: true });
    const pulses = new THREE.Points(pulseGeometry, pulseMaterial);
    scene.add(pulses);


    const onMouseMove = (event: MouseEvent) => {
        if (currentMount) {
            mouse.x = (event.clientX / currentMount.clientWidth) * 2 - 1;
            mouse.y = -(event.clientY / currentMount.clientHeight) * 2 + 1;
        }
    };
    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
        requestAnimationFrame(animate);

        // Animate pulses
        const pulsePositions = pulseGeometry.attributes.position.array as Float32Array;
        for (let i=0; i < pulseData.length; i++) {
            const data = pulseData[i];
            data.progress += data.speed;
            if (data.progress > 1) {
                data.progress = 0;
                // Swap direction sometimes
                if (Math.random() > 0.5) {
                    const temp = data.start;
                    data.start = data.end;
                    data.end = temp;
                }
            }
            const p1 = new THREE.Vector3().fromBufferAttribute(points.attributes.position, data.start);
            const p2 = new THREE.Vector3().fromBufferAttribute(points.attributes.position, data.end);
            const currentPos = new THREE.Vector3().lerpVectors(p1, p2, data.progress);
            pulsePositions[i * 3] = currentPos.x;
            pulsePositions[i * 3 + 1] = currentPos.y;
            pulsePositions[i * 3 + 2] = currentPos.z;
        }
        pulseGeometry.attributes.position.needsUpdate = true;


        // Make camera follow mouse
        camera.position.x += (mouse.x * 5 - camera.position.x) * 0.02;
        camera.position.y += (mouse.y * 5 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);
        
        renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
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
