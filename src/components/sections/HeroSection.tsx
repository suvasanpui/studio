'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import Link from 'next/link';
import ParticlesBackground from '../shared/ParticlesBackground';

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <ParticlesBackground />
      <div className="absolute top-0 left-0 w-full h-full bg-background/80" />

      <motion.div 
        className="relative z-10 text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.h1 
          className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">Suva Sanpui</span>
        </motion.h1>
        <motion.p 
          className="mt-4 font-body text-xl md:text-2xl lg:text-3xl text-foreground/80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        >
          Full Stack Developer
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="mt-8"
        >
            <Button asChild size="lg" className="font-headline text-lg">
                <Link href="#projects">View My Work</Link>
            </Button>
        </motion.div>
      </motion.div>
      
      <motion.div
        className="absolute bottom-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1, repeat: Infinity, repeatType: 'reverse' }}
      >
        <Link href="#about" aria-label="Scroll to about section">
            <ArrowDown className="w-8 h-8 text-foreground/50" />
        </Link>
      </motion.div>
    </section>
  );
};

export default HeroSection;
