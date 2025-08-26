'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Sparkles } from 'lucide-react';

const HeroAnimation: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;
        const currentMount = mountRef.current;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(30, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        camera.position.set(0, 4, 12);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        currentMount.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.minPolarAngle = Math.PI / 3;
        controls.maxPolarAngle = Math.PI / 2;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;

        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);

        const loader = new GLTFLoader();
        loader.load('https://cdn.jsdelivr.net/gh/suvasanpui/3D-Model-Source-for-SAAS@main/desktop_computer/scene.gltf', (gltf) => {
            const model = gltf.scene;
            model.scale.set(1.5, 1.5, 1.5);
            model.position.y = -1.5;
            scene.add(model);
        }, undefined, (error) => {
            console.error(error);
        });

        const animate = () => {
            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();

        const handleResize = () => {
            if (!mountRef.current) return;
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (currentMount) {
                currentMount.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div className='relative w-full h-[300px] md:h-[400px] flex flex-col items-center justify-center'>
            <div ref={mountRef} className='w-full h-full' />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="cursor-pointer w-auto">
                                <div className="p-3 rounded-lg border bg-background/50 backdrop-blur-sm">
                                    <h3 className="font-headline text-lg flex items-center gap-2">
                                        <Sparkles className="text-accent h-5 w-5" /> Magic
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">Do you know? You can tilt and rotate me!</p>
                                </div>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Drag the model to rotate</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    )
};

export default HeroAnimation;
