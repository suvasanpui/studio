import Link from "next/link";
import Image from "next/image";
import AnimatedSection from "../shared/AnimatedSection";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ParticlesBackground from "../shared/ParticlesBackground";

const projects = [
  {
    title: "VoteNow App",
    description: "A real-time voting application that allows users to create polls, cast votes, and see instant results. Built with a focus on performance and scalability.",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "voting chart",
    tags: ["Next.js", "React", "Node.js", "MongoDB", "Socket.IO"],
    liveUrl: "https://vote-now-71kj-ui.vercel.app/dashboard",
    githubUrl: "https://github.com/suvasanpui/votenow",
  },
  {
    title: "eShop Ecommerce",
    description: "A full-featured e-commerce platform with product listings, a shopping cart, user authentication, and an admin panel for managing products and orders.",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "online shopping",
    tags: ["React", "Redux", "Express", "MongoDB", "Stripe"],
    liveUrl: "https://github.com/suvasanpui/eshop",
    githubUrl: "https://github.com/suvasanpui/eshop",
  },
];

export default function ProjectsSection() {
  return (
    <AnimatedSection id="projects" className="bg-secondary relative overflow-hidden">
      <ParticlesBackground />
      <div className="relative z-10">
        <div className="text-center">
          <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
            Featured Projects
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-foreground/80">
            Here are some of the projects I'm proud of. Each one represents a challenge I was excited to tackle.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12" style={{ perspective: '2000px' }}>
          {projects.map((project) => (
            <div key={project.title} className="group">
              <Card className="h-full bg-background/50 overflow-hidden shadow-xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(10deg)_rotateX(4deg)]">
                <CardHeader className="p-0">
                  <div className="relative h-60 w-full overflow-hidden">
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-500 group-hover:scale-110"
                      data-ai-hint={project.imageHint}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="font-headline text-2xl font-bold">{project.title}</CardTitle>
                  <div className="flex flex-wrap gap-2 my-4">
                    {project.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="font-medium">{tag}</Badge>
                    ))}
                  </div>
                  <p className="text-foreground/80">{project.description}</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-4 p-6 pt-0">
                  <Button variant="ghost" asChild>
                    <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-5 w-5" />
                      GitHub
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-5 w-5" />
                      Live Demo
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
