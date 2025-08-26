'use client';

import React from 'react';
import AnimatedSection from "../shared/AnimatedSection";
import { GraduationCap } from "lucide-react";
import { motion } from 'framer-motion';
import ParticlesBackground from '../shared/ParticlesBackground';

const timelineItems = [
  {
    icon: <GraduationCap className="h-5 w-5 text-primary" />,
    date: "2019 - 2023",
    title: "Bachelor of Technology in CSE",
    institution: "Techno Main Salt Lake",
    description: "Graduated with a solid foundation in computer science, algorithms, and software development principles.",
  },
  {
    icon: <GraduationCap className="h-5 w-5 text-primary" />,
    date: "2017 - 2019",
    title: "Higher Secondary Education",
    institution: "Haldia Govt. Spon. Vivekananda Vidyabhaban",
    description: "Completed higher secondary education with a focus on science and mathematics.",
  },
];

export default function EducationSection() {
  return (
    <AnimatedSection id="education" className="bg-secondary relative overflow-hidden">
      <ParticlesBackground />
      <div className="relative z-10">
          <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter text-center">
            My Education
          </h2>
          <div className="mt-10 max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border -z-10"></div>
              {timelineItems.map((item, index) => (
                <motion.div 
                  key={index} 
                  className="relative flex items-start gap-6 mb-8"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 ring-8 ring-secondary flex-shrink-0 mt-1">
                    {item.icon}
                  </div>
                  <div className='bg-secondary/80 backdrop-blur-sm p-4 rounded-lg w-full'>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                    <h3 className="text-xl font-semibold font-headline mt-1">{item.title}</h3>
                    <p className="text-lg text-primary font-medium">{item.institution}</p>
                    <p className="mt-2 text-foreground/70">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
      </div>
    </AnimatedSection>
  );
}
