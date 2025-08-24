import AnimatedSection from "../shared/AnimatedSection";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, GraduationCap } from "lucide-react";

const timelineItems = [
  {
    icon: <Briefcase className="h-5 w-5 text-primary" />,
    date: "2023 - Present",
    title: "Full Stack Developer",
    institution: "Freelance",
    description: "Developing and maintaining web applications using the MERN stack for various clients, focusing on performance and user experience.",
  },
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

export default function AboutSection() {
  return (
    <AnimatedSection id="about" className="bg-secondary">
      <div className="grid md:grid-cols-5 gap-12 items-start">
        <div className="md:col-span-2">
          <div className="relative aspect-square w-full max-w-sm mx-auto">
            <Image
              src="https://placehold.co/400x400.png"
              alt="Suva Sanpui"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-lg transform transition-transform duration-500 hover:scale-105"
              data-ai-hint="portrait man"
            />
             <div className="absolute -inset-2 rounded-lg border-2 border-primary/50 rotate-3 transition-transform duration-500 hover:rotate-0"></div>
          </div>
        </div>
        <div className="md:col-span-3">
          <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
            About Me
          </h2>
          <p className="mt-6 text-lg text-foreground/80 leading-relaxed">
            I am a passionate Full Stack Developer with a knack for creating dynamic and user-friendly web applications. With a strong foundation in the MERN stack, I enjoy bringing ideas to life from concept to deployment. I am a continuous learner, always excited to explore new technologies and improve my craft.
          </p>
          <div className="mt-10">
            <div className="relative">
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border -z-10"></div>
              {timelineItems.map((item, index) => (
                <div key={index} className="relative flex items-start gap-6 mb-8">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 ring-8 ring-secondary flex-shrink-0 mt-1">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                    <h3 className="text-xl font-semibold font-headline mt-1">{item.title}</h3>
                    <p className="text-lg text-primary font-medium">{item.institution}</p>
                    <p className="mt-2 text-foreground/70">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
