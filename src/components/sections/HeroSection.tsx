'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowDown, Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';
import ParticlesBackground from '../shared/ParticlesBackground';
import HeroAnimation from '../shared/HeroAnimation';

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden" id='home'>
      <ParticlesBackground />
      <div className="absolute top-0 left-0 w-full h-full bg-background/80" />

      <div className="relative z-10 w-full container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div 
            className="text-center md:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.h1 
              className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">Hi, I'm Suva</span>
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
              className="mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6"
            >
                <Button asChild size="lg" className="font-headline text-lg w-full sm:w-auto">
                    <Link href="#projects">View My Work</Link>
                </Button>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="icon" asChild>
                    <Link href="https://github.com/suvasanpui" target="_blank" rel="noopener noreferrer">
                      <Github />
                      <span className="sr-only">GitHub</span>
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <Link href="https://linkedin.com/in/suvasanpui" target="_blank" rel="noopener noreferrer">
                      <Linkedin />
                      <span className="sr-only">LinkedIn</span>
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <Link href="https://twitter.com/suvasanpui" target="_blank" rel="noopener noreferrer">
                      <Twitter />
                      <span className="sr-only">Twitter</span>
                    </Link>
                  </Button>
                </div>
            </motion.div>
          </motion.div>
          <motion.div 
            className="hidden md:block"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
          >
            <HeroAnimation />
          </motion.div>
        </div>
      </div>
      
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
