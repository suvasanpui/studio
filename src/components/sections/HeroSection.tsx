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
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2(-10, -10);

    // Particle setup
    const particlesCount = 5000;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const sizes = new Float32Array(particlesCount);
    const velocities = new Float32Array(particlesCount * 3);
    const randoms = new Float32Array(particlesCount * 3);


    const color = new THREE.Color();

    for (let i = 0; i < particlesCount; i++) {
        // Position
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        
        // Velocity
        velocities[i * 3] = (Math.random() - 0.5) * 0.005;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.005;

        // Random values for noise
        randoms[i * 3] = Math.random() * 10;
        randoms[i * 3 + 1] = Math.random() * 10;
        randoms[i * 3 + 2] = Math.random() * 10;

        // Color
        color.setHSL(Math.random(), 0.7, 0.5);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        // Size
        sizes[i] = Math.random() * 0.1 + 0.05;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('randoms', new THREE.BufferAttribute(randoms, 3));
    
    const vertexShader = `
      attribute float size;
      attribute vec3 randoms;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      varying vec3 vColor;
      void main() {
        float strength = distance(gl_PointCoord, vec2(0.5));
        if (strength > 0.5) discard;
        gl_FragColor = vec4(vColor, 1.0 - (strength * 2.0));
      }
    `;

    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        vertexColors: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const onMouseMove = (event: MouseEvent) => {
      if (currentMount) {
        mouse.x = (event.clientX / currentMount.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / currentMount.clientHeight) * 2 + 1;
      }
    }
    window.addEventListener('mousemove', onMouseMove);
    
    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const posAttribute = geometry.attributes.position as THREE.BufferAttribute;
      const randAttribute = geometry.attributes.randoms as THREE.BufferAttribute;

      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        
        // Update position based on initial velocity
        posAttribute.array[i3] += velocities[i3];
        posAttribute.array[i3 + 1] += velocities[i3 + 1];

        // Add noise for smoke-like movement
        const xRand = randAttribute.array[i3];
        const yRand = randAttribute.array[i3 + 1];
        posAttribute.array[i3] += Math.sin(elapsedTime * 0.5 + xRand) * 0.001;
        posAttribute.array[i3 + 1] += Math.cos(elapsedTime * 0.5 + yRand) * 0.001;

        // Screen wrapping
        if (posAttribute.array[i3] > 5) posAttribute.array[i3] = -5;
        else if (posAttribute.array[i3] < -5) posAttribute.array[i3] = 5;
        if (posAttribute.array[i3 + 1] > 5) posAttribute.array[i3 + 1] = -5;
        else if (posAttribute.array[i3 + 1] < -5) posAttribute.array[i3 + 1] = 5;

        // Mouse interaction
        const mouseRadius = 1.5;
        const mouse3D = new THREE.Vector3(mouse.x * 5, mouse.y * 5, 0);
        const particlePos = new THREE.Vector3(posAttribute.array[i3], posAttribute.array[i3+1], posAttribute.array[i3+2]);
        const dist = particlePos.distanceTo(mouse3D);

        if(dist < mouseRadius) {
           const force = (mouseRadius - dist) / mouseRadius;
           const repel = particlePos.sub(mouse3D).normalize().multiplyScalar(force * 0.05);
           velocities[i3] += repel.x;
           velocities[i3+1] += repel.y;
        }
      }

      // Dampen velocities
      for(let i = 0; i < particlesCount * 3; i++) {
        velocities[i] *= 0.99;
      }

      posAttribute.needsUpdate = true;
      particles.rotation.z = elapsedTime * 0.05;

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
