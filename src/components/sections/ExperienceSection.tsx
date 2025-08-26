'use client';

import { Briefcase } from "lucide-react";
import AnimatedSection from "../shared/AnimatedSection";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const experienceData = [
  {
    role: "Full Stack Developer",
    company: "Freelance",
    period: "2023 - Present",
    description: "As a freelance developer, I've had the opportunity to work on diverse projects for various clients. My primary focus has been on building and maintaining full-stack web applications using the MERN stack. I specialize in creating responsive user interfaces, developing robust server-side logic, and ensuring optimal application performance.",
    responsibilities: [
      "Designed and developed scalable web applications from scratch.",
      "Collaborated with clients to define project requirements and deliverables.",
      "Built RESTful APIs and integrated third-party services.",
      "Implemented responsive designs with React and Tailwind CSS.",
      "Managed databases and performed regular maintenance."
    ]
  },
  {
    role: "Junior Web Developer",
    company: "Tech Innovators Inc.",
    period: "2022 - 2023",
    description: "I began my professional journey as a Junior Web Developer, where I contributed to the development of various client websites. This role allowed me to hone my front-end skills and learn the fundamentals of back-end development in a collaborative team environment.",
    responsibilities: [
      "Assisted in the development of new user-facing features using React.",
      "Translated UI/UX design wireframes to actual code.",
      "Learned to build and maintain server-side APIs with Node.js and Express.",
      "Participated in code reviews to maintain code quality.",
      "Fixed bugs and improved application performance."
    ]
  }
];

export default function ExperienceSection() {
  return (
    <AnimatedSection id="experience" className="bg-background relative overflow-hidden">
      <div className='relative z-10'>
        <div className="text-center">
          <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
            Work Experience
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-foreground/80">
            My professional journey and what I've accomplished so far.
          </p>
        </div>
        <div className="mt-16 relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block" />
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border md:hidden" />
          
          <div className="space-y-12">
            {experienceData.map((exp, index) => {
              const isLeft = index % 2 === 0;
              return (
                <motion.div
                  key={index}
                  className={cn(
                    'relative flex items-center', 
                    isLeft ? 'md:justify-start' : 'md:justify-end'
                  )}
                  initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className={cn('md:w-5/12 w-full', isLeft ? 'md:pl-0' : 'md:pl-12')}>
                     <div className={cn("pl-10 md:pl-0", !isLeft && "md:text-right")}>
                        <Card className="border-l-4 md:border-l-0 md:border-r-4 border-primary shadow-lg hover:shadow-primary/20 transition-shadow duration-300 bg-background/80 backdrop-blur-sm w-full">
                          <CardHeader className={cn(!isLeft && "md:text-right")}>
                            <div className="flex justify-between items-start flex-col sm:flex-row">
                                <div className={cn("text-left", !isLeft && "sm:text-right")}>
                                    <CardTitle className="font-headline text-2xl">{exp.role}</CardTitle>
                                    <CardDescription className="text-lg font-medium text-primary mt-1">{exp.company}</CardDescription>
                                </div>
                                <div className="text-left sm:text-right mt-2 sm:mt-0">
                                    <div className="flex items-center justify-start sm:justify-end gap-2 text-muted-foreground whitespace-nowrap">
                                    <Briefcase className="h-5 w-5" />
                                    <span>{exp.period}</span>
                                    </div>
                                </div>
                            </div>
                          </CardHeader>
                          <CardContent className={cn("text-left",!isLeft && "md:text-right")}>
                            <p className="text-foreground/80 mb-4">{exp.description}</p>
                            <h4 className="font-semibold mb-2 text-foreground">Key Responsibilities:</h4>
                            <ul className={cn("list-disc list-inside space-y-2 text-foreground/70", !isLeft && "md:text-right")}>
                              {exp.responsibilities.map((resp, i) => (
                                <li key={i}>{resp}</li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                     </div>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-primary border-4 border-background z-10 hidden md:block" />
                  <div className="absolute left-4 -translate-x-1/2 h-4 w-4 rounded-full bg-primary border-4 border-background z-10 md:hidden" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
