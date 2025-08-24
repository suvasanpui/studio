'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ParticlesBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 50;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2(0, 0);

    let primaryColor: THREE.Color;
    let accentColor: THREE.Color;
    try {
      const computedStyle = getComputedStyle(document.documentElement);
      const primaryHsl = computedStyle.getPropertyValue('--primary').trim();
      const accentHsl = computedStyle.getPropertyValue('--accent').trim();
      primaryColor = new THREE.Color(`hsl(${primaryHsl})`);
      accentColor = new THREE.Color(`hsl(${accentHsl})`);
    } catch(e) {
      primaryColor = new THREE.Color(0xA020F0);
      accentColor = new THREE.Color(0x1EE0FF);
    }

    const cubes: THREE.Mesh[] = [];
    const cubeCount = 50;

    for (let i = 0; i < cubeCount; i++) {
        const size = Math.random() * 3 + 1;
        const geometry = new THREE.BoxGeometry(size, size, size);
        const material = new THREE.MeshBasicMaterial({
            color: Math.random() > 0.5 ? primaryColor : accentColor,
            transparent: true,
            opacity: Math.random() * 0.5 + 0.2
        });
        const cube = new THREE.Mesh(geometry, material);

        cube.position.x = (Math.random() - 0.5) * 100;
        cube.position.y = (Math.random() - 0.5) * 100;
        cube.position.z = (Math.random() - 0.5) * 100;

        cube.rotation.x = Math.random() * Math.PI;
        cube.rotation.y = Math.random() * Math.PI;
        
        const velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.05,
            (Math.random() - 0.5) * 0.05,
            (Math.random() - 0.5) * 0.05
        );
        (cube as any).velocity = velocity;

        cubes.push(cube);
        scene.add(cube);
    }
    
    const onMouseMove = (event: MouseEvent) => {
      if (currentMount) {
        mouse.x = (event.clientX / currentMount.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / currentMount.clientHeight) * 2 + 1;
      }
    };
    window.addEventListener('mousemove', onMouseMove);
    
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      cubes.forEach(cube => {
          cube.rotation.x += (cube as any).velocity.x;
          cube.rotation.y += (cube as any).velocity.y;
          
          cube.position.add((cube as any).velocity);

          if (cube.position.x > 50 || cube.position.x < -50) (cube as any).velocity.x *= -1;
          if (cube.position.y > 50 || cube.position.y < -50) (cube as any).velocity.y *= -1;
          if (cube.position.z > 50 || cube.position.z < -50) (cube as any).velocity.z *= -1;
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

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      cubes.forEach(cube => {
          scene.remove(cube);
          cube.geometry.dispose();
          (cube.material as THREE.Material).dispose();
      });
      scene.clear();
    };
  }, []);

  return <div ref={mountRef} className="absolute top-0 left-0 w-full h-full z-0" />;
}
