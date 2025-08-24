'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import AnimatedSection from "../shared/AnimatedSection";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, GraduationCap } from "lucide-react";
import { motion } from 'framer-motion';

const timelineItems = [
  {
    icon: <Briefcase className="h-5 w-5 text-primary" />,
    date: "2023 - Present",
    title: "Full Stack Developer",
    institution: "Freelance",
    description: "Developing and maintaining web applications using the MERN stack for various clients, focusing on performance and user experience.",
  },
  {
    icon: <GraduationCap className="h-5 w-5 text-primary" />,
    date: "2019 - 2023",
    title: "Bachelor of Technology in CSE",
    institution: "Techno Main Salt Lake",
    description: "Graduated with a solid foundation in computer science, algorithms, and software development principles.",
  },
  {
    icon: <GraduationCap className="h-5 w-5 text-primary" />,
    date: "2017 - 2019",
    title: "Higher Secondary Education",
    institution: "Haldia Govt. Spon. Vivekananda Vidyabhaban",
    description: "Completed higher secondary education with a focus on science and mathematics.",
  },
];

export default function AboutSection() {
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
    <AnimatedSection id="about" className="bg-secondary relative overflow-hidden">
      <div ref={mountRef} className="absolute top-0 left-0 w-full h-full z-0" />
      <div className="relative z-10 grid md:grid-cols-5 gap-12 items-start">
        <div className="md:col-span-2">
          <div className="relative aspect-square w-full max-w-sm mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Image
                src="https://placehold.co/400x400.png"
                alt="Suva Sanpui"
                layout="fill"
                objectFit="cover"
                className="rounded-lg shadow-lg"
                data-ai-hint="portrait man"
              />
              <div className="absolute -inset-2 rounded-lg border-2 border-primary/50 rotate-3 transition-transform duration-500 hover:rotate-0"></div>
            </motion.div>
          </div>
        </div>
        <div className="md:col-span-3">
          <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
            About Me
          </h2>
          <p className="mt-6 text-lg text-foreground/80 leading-relaxed">
            I am a passionate Full Stack Developer with a knack for creating dynamic and user-friendly web applications. With a strong foundation in the MERN stack, I enjoy bringing ideas to life from concept to deployment. I am a continuous learner, always excited to explore new technologies and improve my craft.
          </p>
          <div className="mt-10">
            <div className="relative">
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border -z-10"></div>
              {timelineItems.map((item, index) => (
                <motion.div 
                  key={index} 
                  className="relative flex items-start gap-6 mb-8"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 ring-8 ring-secondary flex-shrink-0 mt-1">
                    {item.icon}
                  </div>
                  <div className='bg-secondary/80 backdrop-blur-sm p-4 rounded-lg'>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                    <h3 className="text-xl font-semibold font-headline mt-1">{item.title}</h3>
                    <p className="text-lg text-primary font-medium">{item.institution}</p>
                    <p className="mt-2 text-foreground/70">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
