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
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    const clock = new THREE.Clock();

    // Metaballs shader
    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform vec3 color1;
      uniform vec3 color2;
      uniform float time;
      uniform vec2 resolution;
      uniform vec2 mouse;
      
      const int NUM_METABALLS = 5;
      vec3 metaballs[NUM_METABALLS];

      float sdCircle(vec2 p, float r) {
        return length(p) - r;
      }
      
      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / resolution.y;
        
        // Define metaballs
        metaballs[0] = vec3(sin(time * 0.5) * 0.5, cos(time * 0.3) * 0.5, 0.2);
        metaballs[1] = vec3(sin(time * 0.7) * 0.6, cos(time * 0.5) * 0.6, 0.25);
        metaballs[2] = vec3(sin(time * 0.9) * 0.7, cos(time * 0.7) * 0.7, 0.15);
        metaballs[3] = vec3(sin(time * 1.1) * 0.4, cos(time * 0.9) * 0.4, 0.2);
        metaballs[4] = vec3(mouse.x * 2.0, mouse.y * 2.0, 0.3); // Mouse controlled

        float sum = 0.0;
        for (int i = 0; i < NUM_METABALLS; i++) {
            sum += metaballs[i].z / length(uv - metaballs[i].xy);
        }
        
        float threshold = 1.0;
        float value = smoothstep(threshold - 0.05, threshold + 0.05, sum);
        
        if (value < 0.1) {
          discard;
        }

        vec3 finalColor = mix(color1, color2, length(uv));
        gl_FragColor = vec4(finalColor, value);
      }
    `;

    const uniforms = {
        time: { value: 0.0 },
        resolution: { value: new THREE.Vector2(currentMount.clientWidth, currentMount.clientHeight) },
        mouse: { value: new THREE.Vector2(0.5, 0.5) },
        color1: { value: new THREE.Color(0x6a0dad) }, // Purple
        color2: { value: new THREE.Color(0x00ffff) }, // Cyan
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
    });

    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    const onMouseMove = (event: MouseEvent) => {
        if (currentMount) {
            uniforms.mouse.value.x = (event.clientX / currentMount.clientWidth) - 0.5;
            uniforms.mouse.value.y = -( (event.clientY / currentMount.clientHeight) - 0.5);
        }
    };
    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
        requestAnimationFrame(animate);
        uniforms.time.value = clock.getElapsedTime();
        renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        const width = currentMount.clientWidth;
        const height = currentMount.clientHeight;
        renderer.setSize(width, height);
        uniforms.resolution.value.set(width, height);
        // Adjust camera for non-square aspect ratios if needed
        const aspect = width / height;
        if (aspect > 1) {
            camera.left = -aspect;
            camera.right = aspect;
            camera.top = 1;
            camera.bottom = -1;
        } else {
            camera.left = -1;
            camera.right = 1;
            camera.top = 1 / aspect;
            camera.bottom = -1 / aspect;
        }
        camera.updateProjectionMatrix();
    };
    handleResize(); // Initial call
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
