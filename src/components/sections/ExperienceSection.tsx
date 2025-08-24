import { Briefcase } from "lucide-react";
import AnimatedSection from "../shared/AnimatedSection";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";

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
];

export default function ExperienceSection() {
  return (
    <AnimatedSection id="experience" className="bg-background">
      <div className="text-center">
        <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
          Work Experience
        </h2>
        <p className="mt-4 mx-auto max-w-2xl text-lg text-foreground/80">
          My professional journey and what I've accomplished so far.
        </p>
      </div>
      <div className="mt-12 max-w-4xl mx-auto">
        {experienceData.map((exp, index) => (
          <Card key={index} className="mb-8 border-l-4 border-primary shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="font-headline text-2xl">{exp.role}</CardTitle>
                  <CardDescription className="text-lg font-medium text-primary mt-1">{exp.company}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2 text-muted-foreground">
                    <Briefcase className="h-5 w-5" />
                    <span>{exp.period}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 mb-4">{exp.description}</p>
              <h4 className="font-semibold mb-2 text-foreground">Key Responsibilities:</h4>
              <ul className="list-disc list-inside space-y-2 text-foreground/70">
                {exp.responsibilities.map((resp, i) => (
                  <li key={i}>{resp}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </AnimatedSection>
  );
}
