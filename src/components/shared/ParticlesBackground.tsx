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
    camera.position.z = 100;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2(10000, 10000);
    
    let primaryColor: THREE.Color;
    let accentColor: THREE.Color;
    try {
      const computedStyle = getComputedStyle(document.documentElement);
      primaryColor = new THREE.Color(computedStyle.getPropertyValue('--primary').trim());
      accentColor = new THREE.Color(computedStyle.getPropertyValue('--accent').trim());
    } catch(e) {
      primaryColor = new THREE.Color(0xA020F0); // Vibrant purple
      accentColor = new THREE.Color(0x1EE0FF); // Neon blue
    }
    
    const lines: THREE.Line[] = [];
    const lineCount = 150;
    const pointsPerLine = 100;

    for (let j = 0; j < lineCount; j++) {
      const positions = new Float32Array(pointsPerLine * 3);
      const colors = new Float32Array(pointsPerLine * 3);
      const geometry = new THREE.BufferGeometry();
      
      const line_width = Math.random() * 0.5 + 0.1;

      for (let i = 0; i < pointsPerLine; i++) {
        const i3 = i * 3;
        positions[i3] = (i / (pointsPerLine - 1)) * 200 - 100; // x from -100 to 100
        positions[i3 + 1] = 0; // y initially 0
        positions[i3 + 2] = (Math.random() - 0.5) * 100; // z depth
        
        const mixedColor = primaryColor.clone().lerp(accentColor, i / pointsPerLine);
        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      
      const material = new THREE.LineBasicMaterial({
        linewidth: line_width,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.35 + Math.random() * 0.3
      });

      const line = new THREE.Line(geometry, material);
      line.userData.originalZ = (Math.random() - 0.5) * 200;
      line.position.z = line.userData.originalZ;
      line.userData.speed = Math.random() * 0.5 + 0.1;
      
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
        const elapsedTime = clock.getElapsedTime();
        
        lines.forEach((line, lineIndex) => {
          const positions = line.geometry.attributes.position as THREE.BufferAttribute;
          
          for(let i=0; i<pointsPerLine; i++){
            const y = Math.sin(i * 0.1 + elapsedTime * 2 + lineIndex * 0.3) * 15;
            positions.setY(i, y);
          }
          positions.needsUpdate = true;

          line.position.z += line.userData.speed;
          if(line.position.z > 200) {
            line.position.z = -200;
          }

        });
        
        camera.position.x += (mouse.x * 20 - camera.position.x) * 0.02;
        camera.position.y += (-mouse.y * 20 - camera.position.y) * 0.02;
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
          if (Array.isArray(line.material)) {
             line.material.forEach(m => m.dispose());
          } else {
            line.material.dispose();
          }
        });
    };
  }, []);

  return <div ref={mountRef} className="absolute top-0 left-0 w-full h-full z-0" />;
}
