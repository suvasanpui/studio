import AnimatedSection from "../shared/AnimatedSection";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Database, GitMerge, Settings } from "lucide-react";

const skills = [
  { name: "React", category: "Frontend" },
  { name: "Node.js", category: "Backend" },
  { name: "Express", category: "Backend" },
  { name: "MongoDB", category: "Database" },
  { name: "JavaScript", category: "Language" },
  { name: "TypeScript", category: "Language" },
  { name: "HTML5", category: "Frontend" },
  { name: "CSS3", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "Git", category: "Tools" },
  { name: "Redux", category: "State Management" },
  { name: "Next.js", category: "Framework" },
];

export default function SkillsSection() {
  return (
    <AnimatedSection id="skills">
      <div className="text-center">
        <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
          My Tech Arsenal
        </h2>
        <p className="mt-4 mx-auto max-w-2xl text-lg text-foreground/80">
          A collection of tools and technologies I use to build modern, efficient, and scalable web applications.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {skills.map((skill) => (
          <Card key={skill.name} className="group relative overflow-hidden border-2 border-border bg-transparent shadow-lg transition-all duration-300 hover:border-primary hover:-translate-y-2">
            <CardContent className="flex flex-col items-center justify-center p-6 aspect-square">
              <p className="text-lg font-semibold font-headline text-center">{skill.name}</p>
            </CardContent>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
          </Card>
        ))}
      </div>
    </AnimatedSection>
  );
}
