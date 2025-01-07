"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Users, Zap, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-[#dd00ff] via-[#ffae00] to-[#ff7f00]">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Image
                src="/Logo.svg"
                alt="FlowForge Logo"
                width={40}
                height={40}
              />
              <span className="text-xl md:text-2xl font-bold text-white">
                FlowForge
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="#features"
                className="text-white hover:text-gray-200 transition-colors"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-white hover:text-gray-200 transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="#testimonials"
                className="text-white hover:text-gray-200 transition-colors"
              >
                Testimonials
              </Link>
              <Link
                href="/pricing"
                className="text-white hover:text-gray-200 transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/authentication/signup"
                className="text-white hover:text-gray-200 font-medium"
              >
                Sign Up
              </Link>
              <Button
                asChild
                variant="secondary"
                className="bg-white text-[#ff7f00] hover:bg-gray-100"
              >
                <Link href="/authentication/login">Log In</Link>
              </Button>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden bg-white"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-gradient-to-br from-[#dd00ff] via-[#ffae00] to-[#ff7f00]">
                <nav className="flex flex-col space-y-4 mt-6">
                  <Link
                    href="#features"
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    Features
                  </Link>
                  <Link
                    href="#how-it-works"
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    How It Works
                  </Link>
                  <Link
                    href="#testimonials"
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    Testimonials
                  </Link>
                  <Link
                    href="/pricing"
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/authentication/signup"
                    className="text-white hover:text-gray-200 font-medium"
                  >
                    Sign Up
                  </Link>
                  <Button
                    asChild
                    variant="secondary"
                    className="bg-white text-[#ff7f00] hover:bg-gray-100"
                  >
                    <Link href="/authentication/login">Log In</Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </header>

      <main>
        <HeroSection scrollY={scrollY} />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
      </main>

      <footer className="bg-gray-100 mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          © 2023 FlowForge. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function HeroSection({ scrollY }) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1920&h=1080"
          alt="Hero Background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>
      <div
        className="text-center relative z-10 px-4"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
          opacity: 1 - scrollY / 700,
        }}
      >
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 shadow-text">
          Welcome to FlowForge
        </h1>
        <p className="text-lg md:text-xl text-white mb-8 shadow-text">
          Streamline Your Projects with Unparalleled Efficiency
        </p>
        <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/authentication/signup">Get Started for Free</Link>
        </Button>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      title: "Task Management",
      description: "Organize and prioritize tasks with ease.",
      image:
        "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=500&h=500",
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: "Team Collaboration",
      description: "Work together seamlessly across projects.",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=500&h=500",
    },
    {
      icon: <Clock className="h-8 w-8 text-yellow-500" />,
      title: "Time Tracking",
      description: "Monitor project timelines and deadlines.",
      image:
        "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=500&h=500",
    },
    {
      icon: <Zap className="h-8 w-8 text-purple-500" />,
      title: "Productivity Boost",
      description: "Increase efficiency with powerful tools.",
      image:
        "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=500&h=500",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Why Choose FlowForge?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description, image }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <Card
      ref={ref}
      className={`hover:shadow-lg transition-all duration-500 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <Image
        src={image}
        alt={title}
        width={500}
        height={300}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      title: "Sign Up",
      description: "Create your FlowForge account in seconds.",
    },
    {
      title: "Create Project",
      description: "Set up your first project and invite team members.",
    },
    {
      title: "Manage Tasks",
      description: "Assign tasks, set deadlines, and track progress.",
    },
    {
      title: "Collaborate",
      description: "Work together in real-time and achieve your goals.",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          How FlowForge Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <StepCard key={index} {...step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({ title, description, index }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className={`text-center transition-all duration-500 delay-${
        index * 100
      } ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
    >
      <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
        {index + 1}
      </div>
      <h3 className="text-lg md:text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "FlowForge has revolutionized how we manage our projects. It's intuitive and powerful!",
      author: "Jane Doe, CEO of TechCorp",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
    },
    {
      quote:
        "Since using FlowForge, our team's productivity has skyrocketed. Highly recommended!",
      author: "John Smith, Project Manager at InnovateCo",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ quote, author, image }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <Card
      ref={ref}
      className={`transition-all duration-500 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <CardContent className="pt-6 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
        <Image
          src={image}
          alt={author}
          width={80}
          height={80}
          className="rounded-full"
        />
        <div>
          <blockquote className="text-lg italic mb-4">&quot;{quote}&quot;</blockquote>
          <p className="font-semibold">{author}</p>
        </div>
      </CardContent>
    </Card>
  );
}
