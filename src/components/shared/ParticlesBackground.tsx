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

    let primaryColor: THREE.Color;
    let accentColor: THREE.Color;
    try {
        const computedStyle = getComputedStyle(document.documentElement);
        const primaryHsl = computedStyle.getPropertyValue('--primary').trim();
        const accentHsl = computedStyle.getPropertyValue('--accent').trim();
        primaryColor = new THREE.Color(`hsl(${primaryHsl})`);
        accentColor = new THREE.Color(`hsl(${accentHsl})`);
    } catch(e) {
        primaryColor = new THREE.Color(0xA020F0); // Vibrant purple
        accentColor = new THREE.Color(0x1EE0FF); // Neon blue
    }

    const lines: THREE.Line[] = [];
    const lineCount = 50;
    const maxPoints = 50;

    for (let i = 0; i < lineCount; i++) {
      const material = new THREE.LineBasicMaterial({ 
        color: Math.random() > 0.5 ? primaryColor : accentColor,
        linewidth: 2,
        transparent: true,
        opacity: Math.random() * 0.5 + 0.2
      });

      const points: THREE.Vector3[] = [];
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeometry, material);
      
      const startPoint = new THREE.Vector3(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      );
      
      // @ts-ignore
      line.userData = {
        points: [startPoint],
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2,
        ),
      };

      scene.add(line);
      lines.push(line);
    }
    
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
        const delta = clock.getDelta();
        
        lines.forEach(line => {
          // @ts-ignore
          const userData = line.userData;
          const currentPoint = userData.points[userData.points.length - 1].clone();
          currentPoint.add(userData.velocity);

          // Add some curl noise
          const time = Date.now() * 0.0005;
          userData.velocity.x += (Math.random() - 0.5) * 0.05 * Math.sin(time + userData.points.length);
          userData.velocity.y += (Math.random() - 0.5) * 0.05 * Math.cos(time + userData.points.length);
          userData.velocity.z += (Math.random() - 0.5) * 0.05;
          
          // Constrain velocity
          userData.velocity.clampLength(0.1, 0.4);

          userData.points.push(currentPoint);

          if (userData.points.length > maxPoints) {
            userData.points.shift();
          }

          const boundary = 80;
          if (Math.abs(currentPoint.x) > boundary || Math.abs(currentPoint.y) > boundary || Math.abs(currentPoint.z) > boundary) {
            userData.points = [new THREE.Vector3(
              (Math.random() - 0.5) * 100,
              (Math.random() - 0.5) * 100,
              (Math.random() - 0.5) * 100
            )];
            userData.velocity.set(
              (Math.random() - 0.5) * 0.2,
              (Math.random() - 0.5) * 0.2,
              (Math.random() - 0.5) * 0.2
            );
          }

          line.geometry.setFromPoints(userData.points);
          line.geometry.attributes.position.needsUpdate = true;
        });

        scene.rotation.y += delta * 0.05;
        scene.rotation.x += delta * 0.02;
        
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
        lines.forEach(line => {
          line.geometry.dispose();
          (line.material as THREE.Material).dispose();
        });
    };
  }, []);

  return <div ref={mountRef} className="absolute top-0 left-0 w-full h-full z-0" />;
}
