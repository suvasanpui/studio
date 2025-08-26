import Link from "next/link";
import { Github, Linkedin, Twitter, Instagram, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "../ui/card";

const socialLinks = [
    { name: "Instagram", icon: <Instagram />, url: "https://instagram.com" },
    { name: "Twitter", icon: <Twitter />, url: "https://twitter.com/suvasanpui" },
    { name: "Github", icon: <Github />, url: "https://github.com/suvasanpui" },
    { name: "LinkedIn", icon: <Linkedin />, url: "https://linkedin.com/in/suvasanpui" },
]

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-secondary/50 border-t mt-12">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="relative -mt-40 mb-20 z-10">
            <Card className="bg-gradient-to-br from-primary/20 to-secondary/80 border-primary/20 shadow-2xl backdrop-blur-lg">
                <CardContent className="p-8 md:p-12 text-center">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold">Ready to start your project?</h2>
                    <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
                        Let&apos;s discuss how I can contribute to your organization&apos;s success.
                    </p>
                    <Button asChild size="lg" className="mt-8 font-headline text-lg">
                        <Link href="#contact">Get in Touch</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>

        <div className="flex flex-col items-center gap-8">
            <div className="flex flex-col items-center text-center">
                <h3 className="font-headline text-2xl font-bold">Connect with Me</h3>
                <div className="flex flex-wrap justify-center gap-4 mt-6">
                    {socialLinks.map(link => (
                        <Button key={link.name} variant="outline" size="lg" asChild className="flex-1 min-w-[120px] bg-background/50 hover:bg-background">
                            <Link href={link.url} target="_blank" rel="noopener noreferrer">
                                {link.icon}
                                <span>{link.name}</span>
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>
            
            <div className="text-center text-muted-foreground">
                 <p>© 2025 Suva Sanpui. All rights reserved.</p>
                 <Link href="#" className="inline-flex items-center gap-2 mt-4 hover:text-primary transition-colors">
                    <Heart className="h-4 w-4" />
                    <span>Credits and attributions</span>
                 </Link>
            </div>
        </div>
      </div>
    </footer>
  );
}
