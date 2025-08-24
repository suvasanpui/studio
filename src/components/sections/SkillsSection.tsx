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
    camera.position.z = 120;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2(10000, 10000);

    const particleCount = 150;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities: THREE.Vector3[] = [];

    const color = new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--primary'));

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 300;
        positions[i3 + 1] = (Math.random() - 0.5) * 300;
        positions[i3 + 2] = (Math.random() - 0.5) * 300;
        velocities.push(new THREE.Vector3((Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5, 0));
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: new THREE.Color(color.getHex()),
        size: 3,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
    
    const linesGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particleCount * particleCount * 6);
    linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color(color.getHex()),
        transparent: true,
        opacity: 0.1,
        depthWrite: false,
    });
    const linesMesh = new THREE.LineSegments(linesGeometry, lineMaterial);
    scene.add(linesMesh);

    const onMouseMove = (event: MouseEvent) => {
        if (currentMount) {
            mouse.x = (event.clientX / currentMount.clientWidth) * 2 - 1;
            mouse.y = -(event.clientY / currentMount.clientHeight) * 2 + 1;
        }
    };
    window.addEventListener('mousemove', onMouseMove);
    
    const onMouseLeave = () => {
        mouse.x = 10000;
        mouse.y = 10000;
    }
    currentMount.addEventListener('mouseleave', onMouseLeave);

    const animate = () => {
        requestAnimationFrame(animate);

        const positions = particleSystem.geometry.attributes.position.array as Float32Array;
        const linePositions = linesMesh.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] += velocities[i].x;
            positions[i3 + 1] += velocities[i].y;

            if (positions[i3+1] > 150 || positions[i3+1] < -150) velocities[i].y *= -1;
            if (positions[i3] > 150 || positions[i3] < -150) velocities[i].x *= -1;
        }

        let lineIndex = 0;
        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const i3 = i * 3;
                const j3 = j * 3;
                const dx = positions[i3] - positions[j3];
                const dy = positions[i3+1] - positions[j3+1];
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 50) {
                    linePositions[lineIndex++] = positions[i3];
                    linePositions[lineIndex++] = positions[i3+1];
                    linePositions[lineIndex++] = positions[i3+2];
                    linePositions[lineIndex++] = positions[j3];
                    linePositions[lineIndex++] = positions[j3+1];
                    linePositions[lineIndex++] = positions[j3+2];
                }
            }
        }
        linesMesh.geometry.attributes.position.needsUpdate = true;
        (linesMesh.geometry as THREE.BufferGeometry).setDrawRange(0, lineIndex / 3);

        particleSystem.geometry.attributes.position.needsUpdate = true;

        camera.position.x += (mouse.x * 20 - camera.position.x) * 0.02;
        camera.position.y += (-mouse.y * 20 - camera.position.y) * 0.02;
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
        if (currentMount) {
            currentMount.removeEventListener('mouseleave', onMouseLeave);
            if (renderer.domElement) {
                currentMount.removeChild(renderer.domElement);
            }
        }
        scene.traverse(object => {
            if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.LineSegments) {
                if (object.geometry) {
                    object.geometry.dispose();
                }
                if (Array.isArray(object.material)) {
                    object.material.forEach(m => m.dispose());
                } else {
                    object.material.dispose();
                }
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
