'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ParticlesBackground() {
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

    const mouse = new THREE.Vector2(10000, 10000);

    const particleCount = 20000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    let primaryColor: THREE.Color;
    let accentColor: THREE.Color;
    try {
      const computedStyle = getComputedStyle(document.documentElement);
      primaryColor = new THREE.Color(computedStyle.getPropertyValue('--primary').trim());
      accentColor = new THREE.Color(computedStyle.getPropertyValue('--accent').trim());
    } catch(e) {
      primaryColor = new THREE.Color(0x7000FF);
      accentColor = new THREE.Color(0x00BFFF);
    }
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        const radius = Math.random() * 80;
        const spinAngle = radius * 3;
        const branchAngle = (i % 5) / 5 * Math.PI * 2;

        const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5;
        const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5;
        const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5;

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
        
        const mixedColor = primaryColor.clone();
        mixedColor.lerp(accentColor, radius / 80);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.2,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

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

    const clock = new THREE.Clock();

    const animate = () => {
        const elapsedTime = clock.getElapsedTime();
        
        particles.rotation.y = elapsedTime * 0.1;

        camera.position.x += (mouse.x * 5 - camera.position.x) * 0.02;
        camera.position.y += (-mouse.y * 5 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);
      
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
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
        particlesGeometry.dispose();
        particlesMaterial.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute top-0 left-0 w-full h-full z-0" />;
}
