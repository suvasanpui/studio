'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

class Branch {
  points: THREE.Vector3[];
  velocity: THREE.Vector3;
  lifespan: number;
  maxLife: number;
  isDead: boolean;
  line: THREE.Line;
  material: THREE.LineBasicMaterial;
  geometry: THREE.BufferGeometry;

  constructor(startPoint: THREE.Vector3, velocity: THREE.Vector3, color: THREE.Color) {
    this.points = [startPoint];
    this.velocity = velocity;
    this.maxLife = 100 + Math.random() * 100;
    this.lifespan = this.maxLife;
    this.isDead = false;

    this.material = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 1,
      linewidth: 2,
    });
    this.geometry = new THREE.BufferGeometry().setFromPoints(this.points);
    this.line = new THREE.Line(this.geometry, this.material);
  }

  update() {
    if (this.isDead) return;

    this.lifespan--;
    if (this.lifespan <= 0) {
      this.isDead = true;
      return;
    }

    const lastPoint = this.points[this.points.length - 1].clone();
    this.velocity.x += (Math.random() - 0.5) * 0.1;
    this.velocity.y += (Math.random() - 0.5) * 0.1;
    this.velocity.z += (Math.random() - 0.5) * 0.1;
    this.velocity.clampLength(-0.5, 0.5);

    const newPoint = lastPoint.add(this.velocity);
    this.points.push(newPoint);
    
    this.geometry.setFromPoints(this.points);
    this.geometry.attributes.position.needsUpdate = true;
    
    this.material.opacity = this.lifespan / this.maxLife;
  }

  shouldBranch() {
    return Math.random() < 0.02 && this.lifespan > this.maxLife * 0.5;
  }
  
  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}

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
    
    let branches: Branch[] = [];
    const maxBranches = 100;

    function addBranch(startPoint?: THREE.Vector3, velocity?: THREE.Vector3) {
      if (branches.length >= maxBranches) return;

      const sp = startPoint || new THREE.Vector3(0,0,0);
      const vel = velocity || new THREE.Vector3(
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5
      );
      const color = Math.random() > 0.5 ? primaryColor : accentColor;
      
      const branch = new Branch(sp, vel, color);
      branches.push(branch);
      scene.add(branch.line);
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

      if (Math.random() < 0.1 && branches.length < maxBranches) {
        addBranch();
      }

      const newBranches: Branch[] = [];
      for (let i = branches.length - 1; i >= 0; i--) {
        const branch = branches[i];
        branch.update();

        if (branch.isDead) {
          scene.remove(branch.line);
          branch.dispose();
          branches.splice(i, 1);
        } else if (branch.shouldBranch()) {
          const newVel = branch.velocity.clone().multiplyScalar(0.7).applyAxisAngle(new THREE.Vector3(Math.random(),Math.random(),Math.random()).normalize(), (Math.random() - 0.5) * Math.PI * 0.5);
          newBranches.push(new Branch(branch.points[branch.points.length - 1], newVel, branch.material.color));
        }
      }

      newBranches.forEach(b => {
          if (branches.length < maxBranches) {
            branches.push(b);
            scene.add(b.line);
          } else {
            b.dispose();
          }
      });
      
      camera.position.x += (mouse.x * 10 - camera.position.x) * 0.02;
      camera.position.y += (-mouse.y * 10 - camera.position.y) * 0.02;
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
      branches.forEach(branch => {
        scene.remove(branch.line);
        branch.dispose();
      });
      scene.clear();
      branches = [];
    };
  }, []);

  return <div ref={mountRef} className="absolute top-0 left-0 w-full h-full z-0" />;
}
