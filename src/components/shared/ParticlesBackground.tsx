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

    const shapes: THREE.Mesh[] = [];
    const shapeCount = 50;
    
    let color: THREE.Color;
    try {
        color = new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--primary'));
    } catch(e) {
        color = new THREE.Color(0xA020F0);
    }
    
    const geometries = [
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.SphereGeometry(1.5, 32, 16),
        new THREE.ConeGeometry(1.5, 3, 32),
        new THREE.TorusGeometry(1, 0.4, 16, 100)
    ];

    const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.5,
        metalness: 0.8,
        emissive: color,
        emissiveIntensity: 0.2,
    });
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(50, 50, 50);
    scene.add(pointLight);


    for (let i = 0; i < shapeCount; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const shape = new THREE.Mesh(geometry, material);
        
        shape.position.set(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100
        );

        shape.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        const scale = Math.random() * 0.5 + 0.5;
        shape.scale.set(scale, scale, scale);

        (shape as any).velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.1,
        );

        scene.add(shape);
        shapes.push(shape);
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

    const animate = () => {
        requestAnimationFrame(animate);

        shapes.forEach(shape => {
            shape.position.add((shape as any).velocity);
            shape.rotation.x += 0.005;
            shape.rotation.y += 0.005;

            if (shape.position.x > 50 || shape.position.x < -50) (shape as any).velocity.x *= -1;
            if (shape.position.y > 50 || shape.position.y < -50) (shape as any).velocity.y *= -1;
            if (shape.position.z > 50 || shape.position.z < -50) (shape as any).velocity.z *= -1;
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
        if (currentMount) {
            currentMount.removeEventListener('mouseleave', onMouseLeave);
            if (renderer.domElement) {
                currentMount.removeChild(renderer.domElement);
            }
        }
        scene.traverse(object => {
            if (object instanceof THREE.Mesh) {
                if (object.geometry) {
                    object.geometry.dispose();
                }
                if (Array.isArray(object.material)) {
                    object.material.forEach(m => m.dispose());
                } else if (object.material) {
                    object.material.dispose();
                }
            }
        });
    };
  }, []);

  return <div ref={mountRef} className="absolute top-0 left-0 w-full h-full z-0" />;
}
