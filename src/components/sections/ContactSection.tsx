'use client';

import { useActionState } from 'react';
import AnimatedSection from "../shared/AnimatedSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitContactForm } from "@/app/actions";
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import SubmitButton from '../shared/SubmitButton';
import ParticlesBackground from '../shared/ParticlesBackground';

const initialState = {
  message: '',
  errors: undefined,
  success: false,
};

export default function ContactSection() {
  const [state, formAction] = useActionState(submitContactForm, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: "Success!",
          description: state.message,
        });
        formRef.current?.reset();
      } else {
        toast({
          title: "Error",
          description: state.message,
          variant: "destructive",
        });
      }
    }
  }, [state, toast]);

  return (
    <AnimatedSection id="contact" className='relative overflow-hidden'>
      <ParticlesBackground />
      <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
            Get In Touch
          </h2>
          <p className="mt-4 text-lg text-foreground/80">
            Have a project in mind or just want to say hi? I'd love to hear from you. Fill out the form, and I'll get back to you as soon as possible.
          </p>
          <div className="mt-8 space-y-4 text-lg text-foreground/90">
            <p><strong>Email:</strong> suva.sanpui.work@gmail.com</p>
            <p><strong>Location:</strong> Kolkata, India</p>
          </div>
        </div>
        <Card className="w-full max-w-lg mx-auto shadow-2xl bg-secondary">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Send me a message</CardTitle>
            <CardDescription>I'm currently available for freelance work.</CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} action={formAction} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base">Name</Label>
                <Input id="name" name="name" placeholder="Your Name" required aria-describedby="name-error" />
                {state.errors?.name && <p id="name-error" className="text-sm text-destructive">{state.errors.name[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">Email</Label>
                <Input id="email" name="email" type="email" placeholder="your.email@example.com" required aria-describedby="email-error" />
                {state.errors?.email && <p id="email-error" className="text-sm text-destructive">{state.errors.email[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-base">Message</Label>
                <Textarea id="message" name="message" placeholder="Your message here..." required rows={5} aria-describedby="message-error" />
                {state.errors?.message && <p id="message-error" className="text-sm text-destructive">{state.errors.message[0]}</p>}
              </div>
              <SubmitButton />
            </form>
          </CardContent>
        </Card>
      </div>
    </AnimatedSection>
  );
}
