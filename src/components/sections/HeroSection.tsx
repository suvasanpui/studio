'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';
import GridBackground from '../shared/GridBackground';
import HeroAnimation from '../shared/HeroAnimation';
import { Button } from '../ui/button';
import { Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden" id="home">
      <GridBackground />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-background via-background/80 to-transparent" />

      <div className="relative z-10 w-full container mx-auto px-4 md:px-6 pt-28 pb-16">
        <div className="flex flex-col items-start gap-12">
            <motion.div 
                className="text-left w-full"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <div className="flex items-start gap-4">
                    <div className="relative mt-2">
                        <div className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full bg-primary"></div>
                        <div className="absolute -left-0.5 top-4 bottom-0 w-0.5 bg-primary/50"></div>
                    </div>
                    <div className='pl-4'>
                        <motion.h1 
                            className="font-headline text-5xl md:text-7xl font-bold"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                        >
                            Hi, I'm Suva <span role="img" aria-label="waving hand">👋</span>
                        </motion.h1>
                        <motion.div 
                            className="mt-4 font-body text-xl md:text-2xl text-foreground"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                        >
                            <span className='font-semibold text-primary'>Full Stack Developer</span> | <span className='text-accent'>MERN Stack Specialist</span>
                        </motion.div>
                        <motion.p
                            className="mt-6 max-w-xl text-lg text-foreground/80 leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                        >
                            I build highly interactive, responsive, 3D-animated interfaces and Modern web applications with Next.js, React & TypeScript. I design optimized backend systems using Node.js, with expertise in REST APIs, database design, and scalable cloud functions.
                        </motion.p>
                    </div>
                </div>
                
                <motion.div 
                    className="w-full mt-12"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                >
                    <HeroAnimation />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
                    className="mt-8 flex items-center justify-start gap-4"
                >
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
                </motion.div>
            </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;