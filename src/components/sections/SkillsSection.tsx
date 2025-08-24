'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { motion } from 'framer-motion';
import AnimatedSection from '../shared/AnimatedSection';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Code, Database, GitMerge, Settings, Brush, Zap, Cloud } from 'lucide-react';

const skills = [
  { name: 'React', icon: <Code /> },
  { name: 'Node.js', icon: <Zap /> },
  { name: 'Express', icon: <Zap /> },
  { name: 'MongoDB', icon: <Database /> },
  { name: 'JavaScript', icon: <Code /> },
  { name: 'TypeScript', icon: <Code /> },
  { name: 'Next.js', icon: <Zap /> },
  { name: 'Tailwind CSS', icon: <Brush /> },
  { name: 'Git', icon: <GitMerge /> },
  { name: 'Redux', icon: <Settings /> },
  { name: 'Firebase', icon: <Cloud /> },
  { name: 'Three.js', icon: <Brush /> },
];

export default function SkillsSection() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 75;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    const loader = new FontLoader();
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    const streams: { x: number, y: number, speed: number, text: THREE.Mesh, chars: THREE.Mesh[] }[] = [];
    const streamCount = 200;
    const streamLength = 20;

    let font: import('three').Font;

    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (loadedFont) => {
        font = loadedFont;
        initStreams();
    });

    function createChar(char: string) {
        const geometry = new TextGeometry(char, {
            font: font,
            size: 1.5,
            height: 0.1,
        });
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 1 });
        return new THREE.Mesh(geometry, material);
    }
    
    function initStreams() {
        for (let i = 0; i < streamCount; i++) {
            const x = (Math.random() - 0.5) * 200;
            const y = Math.random() * 200 + 100;
            const speed = Math.random() * 0.4 + 0.1;
            
            const charMeshes: THREE.Mesh[] = [];
            for (let j = 0; j < streamLength; j++) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                const mesh = createChar(char);
                mesh.position.set(x, y - j * 2.5, 0);
                
                const material = mesh.material as THREE.MeshBasicMaterial;
                if (j === 0) {
                    material.color.set(0xffffff); // Head character is white
                    material.opacity = 1;
                } else {
                    material.opacity = 1 - j / streamLength;
                }
                
                scene.add(mesh);
                charMeshes.push(mesh);
            }
            streams.push({ x, y, speed, text: charMeshes[0], chars: charMeshes });
        }
    }


    const animate = () => {
        requestAnimationFrame(animate);

        streams.forEach(stream => {
            stream.y -= stream.speed;
            if (stream.y < -100) {
                stream.y = Math.random() * 200 + 100;
                stream.x = (Math.random() - 0.5) * 200;
            }

            stream.chars.forEach((charMesh, index) => {
                charMesh.position.y = stream.y - index * 2.5;
                charMesh.position.x = stream.x;
                
                // Randomly change character
                if (Math.random() > 0.99) {
                    const newChar = chars[Math.floor(Math.random() * chars.length)];
                    (charMesh.geometry as TextGeometry).dispose();
                    charMesh.geometry = new TextGeometry(newChar, { font: font, size: 1.5, height: 0.1 });
                }
            });
        });
      
        renderer.render(scene, camera);
    };
    
    let animationFrameId: number;
    const startAnimation = () => {
      if (!font) {
        animationFrameId = requestAnimationFrame(startAnimation);
      } else {
        animate();
      }
    }
    startAnimation();


    const handleResize = () => {
        if (!currentMount) return;
        const width = currentMount.clientWidth;
        const height = currentMount.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
        window.removeEventListener('resize', handleResize);
        if (currentMount && renderer.domElement) {
            currentMount.removeChild(renderer.domElement);
        }
        cancelAnimationFrame(animationFrameId);
        // Dispose of Three.js objects
        streams.forEach(stream => {
            stream.chars.forEach(charMesh => {
                scene.remove(charMesh);
                charMesh.geometry.dispose();
                if (Array.isArray(charMesh.material)) {
                    charMesh.material.forEach(m => m.dispose());
                } else {
                    charMesh.material.dispose();
                }
            });
        });
    };
  }, []);

  return (
    <AnimatedSection id="skills" className="relative overflow-hidden bg-background">
      <div ref={mountRef} className="absolute top-0 left-0 w-full h-full z-0" />
      <div className="relative z-10">
        <div className="text-center">
          <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">My Tech Arsenal</h2>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-foreground/80">
            A collection of tools and technologies I use to build modern, efficient, and scalable web applications.
          </p>
        </div>
        <div className="mt-16 relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />
          <div className="space-y-8">
            {skills.map((skill, index) => {
              const isLeft = index % 2 === 0;
              return (
                <motion.div
                  key={skill.name}
                  className={cn('relative flex items-center', isLeft ? 'justify-start' : 'justify-end')}
                  initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className={cn('w-5/12', { 'order-last': !isLeft })}>
                    <Card className="group relative overflow-hidden border-2 border-border bg-background/90 shadow-lg transition-all duration-300 hover:border-primary hover:-translate-y-1 hover:shadow-primary/20 backdrop-blur-sm">
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="text-primary transition-transform duration-300 group-hover:scale-110">
                          {React.cloneElement(skill.icon, { className: 'h-8 w-8' })}
                        </div>
                        <p className="text-lg font-semibold font-headline">{skill.name}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-primary border-4 border-background" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
