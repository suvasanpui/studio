'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Briefcase } from "lucide-react";
import AnimatedSection from "../shared/AnimatedSection";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";

const experienceData = [
  {
    role: "Full Stack Developer",
    company: "Freelance",
    period: "2023 - Present",
    description: "As a freelance developer, I've had the opportunity to work on diverse projects for various clients. My primary focus has been on building and maintaining full-stack web applications using the MERN stack. I specialize in creating responsive user interfaces, developing robust server-side logic, and ensuring optimal application performance.",
    responsibilities: [
      "Designed and developed scalable web applications from scratch.",
      "Collaborated with clients to define project requirements and deliverables.",
      "Built RESTful APIs and integrated third-party services.",
      "Implemented responsive designs with React and Tailwind CSS.",
      "Managed databases and performed regular maintenance."
    ]
  },
];

export default function ExperienceSection() {
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
    <AnimatedSection id="experience" className="bg-background relative overflow-hidden">
      <div ref={mountRef} className="absolute top-0 left-0 w-full h-full z-0" />
      <div className='relative z-10'>
        <div className="text-center">
          <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
            Work Experience
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-foreground/80">
            My professional journey and what I've accomplished so far.
          </p>
        </div>
        <div className="mt-12 max-w-4xl mx-auto">
          {experienceData.map((exp, index) => (
            <Card key={index} className="mb-8 border-l-4 border-primary shadow-lg hover:shadow-primary/20 transition-shadow duration-300 bg-background/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-headline text-2xl">{exp.role}</CardTitle>
                    <CardDescription className="text-lg font-medium text-primary mt-1">{exp.company}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2 text-muted-foreground">
                      <Briefcase className="h-5 w-5" />
                      <span>{exp.period}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 mb-4">{exp.description}</p>
                <h4 className="font-semibold mb-2 text-foreground">Key Responsibilities:</h4>
                <ul className="list-disc list-inside space-y-2 text-foreground/70">
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}