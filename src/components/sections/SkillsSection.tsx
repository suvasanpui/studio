'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
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
    camera.position.z = 50;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2();

    const cubes: THREE.Mesh[] = [];
    const cubeCount = 100;
    const cubeMaterials = [
        new THREE.MeshBasicMaterial({ color: 0x9932CC, transparent: true, opacity: 0.8 }),
        new THREE.MeshBasicMaterial({ color: 0x8A2BE2, transparent: true, opacity: 0.8 }),
        new THREE.MeshBasicMaterial({ color: 0xDA70D6, transparent: true, opacity: 0.8 }),
    ];

    for (let i = 0; i < cubeCount; i++) {
        const geometry = new THREE.BoxGeometry(
            Math.random() * 3 + 1,
            Math.random() * 3 + 1,
            Math.random() * 3 + 1
        );
        const material = cubeMaterials[Math.floor(Math.random() * cubeMaterials.length)];
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(
            (Math.random() - 0.5) * 150,
            (Math.random() - 0.5) * 150,
            (Math.random() - 0.5) * 150
        );
        cube.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
        );
        (cube as any).rotationSpeed = new THREE.Vector3(
            (Math.random() - 0.5) * 0.01,
            (Math.random() - 0.5) * 0.01,
            (Math.random() - 0.5) * 0.01
        );
        scene.add(cube);
        cubes.push(cube);
    }
    
    const onMouseMove = (event: MouseEvent) => {
        if (currentMount) {
            mouse.x = (event.clientX / currentMount.clientWidth) * 2 - 1;
            mouse.y = -(event.clientY / currentMount.clientHeight) * 2 + 1;
        }
    };
    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
        requestAnimationFrame(animate);

        cubes.forEach(cube => {
            cube.rotation.x += (cube as any).rotationSpeed.x;
            cube.rotation.y += (cube as any).rotationSpeed.y;
            cube.rotation.z += (cube as any).rotationSpeed.z;
        });

        camera.position.x += (mouse.x * 5 - camera.position.x) * 0.05;
        camera.position.y += (-mouse.y * 5 - camera.position.y) * 0.05;
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
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', onMouseMove);
        if (currentMount && renderer.domElement) {
            currentMount.removeChild(renderer.domElement);
        }
        cubes.forEach(cube => {
            scene.remove(cube);
            cube.geometry.dispose();
            if (Array.isArray(cube.material)) {
                cube.material.forEach(m => m.dispose());
            } else {
                cube.material.dispose();
            }
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
