'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ParticlesBackground: React.FC = () => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateDimensions = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const particles = useMemo(() => {
        if (typeof window === 'undefined') return [];
        const particleCount = 50;
        return Array.from({ length: particleCount }).map((_, i) => ({
            id: i,
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
            size: Math.random() * 2 + 1,
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 5,
        }));
    }, [dimensions.width, dimensions.height]);

    if(typeof window === 'undefined') return null;

    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-primary/30"
                    style={{
                        left: p.x,
                        top: p.y,
                        width: p.size,
                        height: p.size,
                    }}
                    animate={{
                        x: [p.x, p.x + (Math.random() - 0.5) * 200, p.x],
                        y: [p.y, p.y + (Math.random() - 0.5) * 200, p.y],
                        opacity: [0, 0.8, 0],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        repeatType: 'loop',
                        ease: 'linear',
                        delay: p.delay,
                    }}
                />
            ))}
        </div>
    );
};

export default ParticlesBackground;
