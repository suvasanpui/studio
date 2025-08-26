'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroAnimation() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;

    let primaryColorValue: string;
    try {
        const computedStyle = getComputedStyle(document.documentElement);
        const primaryColorHsl = computedStyle.getPropertyValue('--primary').trim();
        const [h, s, l] = primaryColorHsl.split(" ").map(s => s.replace('%',''));
        primaryColorValue = `hsl(${h}, ${s}%, ${l}%)`;
    } catch(e) {
        primaryColorValue = `hsl(277, 87%, 53%)`;
    }
    const primaryColor = new THREE.Color(primaryColorValue);


    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 2.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(1, 15);
    const material = new THREE.MeshStandardMaterial({
        color: primaryColor,
        emissive: primaryColor,
        emissiveIntensity: 0.2,
        roughness: 0.4,
        metalness: 0.6,
        wireframe: true,
        wireframeLinewidth: 1,
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (event: MouseEvent) => {
        const rect = mount.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / mount.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / mount.clientHeight) * 2 + 1;
    };
    mount.addEventListener('mousemove', handleMouseMove);

    const clock = new THREE.Clock();

    const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        sphere.rotation.y = elapsedTime * 0.1;

        const targetRotationX = mouse.y * 0.5;
        const targetRotationY = mouse.x * 0.5;
        sphere.rotation.x += (targetRotationX - sphere.rotation.x) * 0.05;
        sphere.rotation.y += (targetRotationY - sphere.rotation.y) * 0.05 + 0.001;


        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        mount.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        if (mount && renderer.domElement) {
            mount.removeChild(renderer.domElement);
        }
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '400px' }} />;
}
