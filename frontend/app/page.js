"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  Users,
  Zap,
  Menu,
  ArrowRight,
  BarChart,
  Calendar,
  Globe,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      <header
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrollY > 50 ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <Image
                src="/Logo.svg"
                alt="FlowForge Logo"
                width={40}
                height={40}
                className="transition-transform hover:scale-110"
              />
              <span
                className={`text-xl md:text-2xl font-bold transition-colors ${
                  scrollY > 50 ? "text-gray-900" : "text-white"
                }`}
              >
                FlowForge
              </span>
            </motion.div>

            <div className="hidden md:flex items-center space-x-6">
              {["Features", "How It Works", "Testimonials", "Pricing"].map(
                (item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className={`transition-colors ${
                        scrollY > 50
                          ? "text-gray-600 hover:text-gray-900"
                          : "text-white hover:text-gray-200"
                      }`}
                    >
                      {item}
                    </Link>
                  </motion.div>
                )
              )}

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  asChild
                  variant="secondary"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  <Link href="/authentication/login">Get Started</Link>
                </Button>
              </motion.div>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden bg-white/90 backdrop-blur-sm"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-white">
                <nav className="flex flex-col space-y-4 mt-6">
                  {["Features", "How It Works", "Testimonials", "Pricing"].map(
                    (item) => (
                      <Link
                        key={item}
                        href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-gray-600 hover:text-gray-900 transition-colors flex items-center"
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        {item}
                      </Link>
                    )
                  )}
                  <Button asChild className="w-full mt-4">
                    <Link href="/authentication/login">Get Started</Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </header>

      <main>
        <HeroSection scrollY={scrollY} />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
      </main>

      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">FlowForge</h3>
              <p className="text-gray-400">
                Streamline your workflow with the most powerful project
                management tool.
              </p>
            </div>
            {["Product", "Company", "Resources", "Legal"].map((section) => (
              <div key={section}>
                <h3 className="text-lg font-bold mb-4">{section}</h3>
                <ul className="space-y-2">
                  {[1, 2, 3].map((item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {section} Link {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            © {new Date().getFullYear()} FlowForge. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function HeroSection({ scrollY }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg"
          alt="Hero Background"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="filter brightness-50"
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 container mx-auto px-4 text-center"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
          opacity: 1 - scrollY / 700,
        }}
      >
        <Badge className="mb-4 bg-blue-500/10 text-blue-200 border-blue-500/20">
          Project Management Reimagined
        </Badge>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Streamline Your Projects
          <br />
          with Unparalleled Efficiency
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
          Transform the way your team works with our powerful project management
          platform
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/authentication/signup">Get Started Free</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="text-white border-white hover:bg-white/10"
          >
            <Link href="#features">Learn More</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    {
      icon: <Globe className="h-6 w-6" />,
      value: "50K+",
      label: "Users Worldwide",
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      value: "1M+",
      label: "Tasks Completed",
    },
    { icon: <Calendar className="h-6 w-6" />, value: "99.9%", label: "Uptime" },
    { icon: <Users className="h-6 w-6" />, value: "10K+", label: "Teams" },
  ];

  return (
    <section className="py-16 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-blue-100 text-blue-600 rounded-xl">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {stat.value}
              </h3>
              <p className="text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      title: "Smart Task Management",
      description: "Organize and prioritize tasks with AI-powered suggestions.",
      image:
        "https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg",
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: "Real-time Collaboration",
      description: "Work together seamlessly with your team in real-time.",
      image:
        "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg",
    },
    {
      icon: <Clock className="h-8 w-8 text-yellow-500" />,
      title: "Advanced Time Tracking",
      description: "Monitor project timelines with detailed analytics.",
      image:
        "https://images.pexels.com/photos/3183132/pexels-photo-3183132.jpeg",
    },
    {
      icon: <Zap className="h-8 w-8 text-purple-500" />,
      title: "Automation Tools",
      description: "Automate repetitive tasks and boost productivity.",
      image:
        "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
    },
  ];

  return (
    <section className="py-24 bg-gray-50" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4">Features</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful tools designed to help your team work more efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description, image, index }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.2 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={image}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-110 transition-transform duration-300"
          />
        </div>
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
    </motion.div>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      title: "Create Account",
      description: "Sign up and set up your workspace in seconds.",
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: "Invite Team",
      description: "Add your team members and assign roles.",
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: "Plan Projects",
      description: "Create projects and break them down into tasks.",
      icon: <Calendar className="h-6 w-6" />,
    },
    {
      title: "Track Progress",
      description: "Monitor progress and achieve your goals.",
      icon: <BarChart className="h-6 w-6" />,
    },
  ];

  return (
    <section className="py-24 bg-white" id="how-it-works">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4">How It Works</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Started in Minutes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Follow these simple steps to transform your workflow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <StepCard key={index} {...step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({ title, description, icon, index }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.2 }}
      className="text-center"
    >
      <div className="relative">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
          {icon}
        </div>
        {index < 3 && (
          <div className="hidden lg:block absolute top-8 left-[60%] w-[calc(100%-32px)] h-[2px] bg-blue-100" />
        )}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "FlowForge has transformed how we manage projects. The efficiency gains are remarkable!",
      author: "Sarah Johnson",
      role: "CTO at TechCorp",
      image:
        "https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg",
      rating: 5,
    },
    {
      quote:
        "The best project management tool we've ever used. It's intuitive and powerful!",
      author: "Michael Chen",
      role: "Product Manager",
      image:
        "https://images.pexels.com/photos/3184603/pexels-photo-3184603.jpeg",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-gray-50" id="testimonials">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4">Testimonials</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what our customers have to say about FlowForge
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ quote, author, role, image, rating, index }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.2 }}
    >
      <Card className="h-full">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <Image
              src={image}
              alt={author}
              width={60}
              height={60}
              className="rounded-full"
            />
            <div>
              <p className="font-semibold">{author}</p>
              <p className="text-sm text-gray-600">{role}</p>
            </div>
          </div>
          <blockquote className="text-lg mb-4">&quot;{quote}&quot;</blockquote>
          <div className="flex gap-1">
            {[...Array(rating)].map((_, i) => (
              <svg
                key={i}
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CTASection() {
  return (
    <section className="py-24 bg-blue-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Transform Your Workflow?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of teams already using FlowForge to streamline their
          projects
        </p>
        <Button
          size="lg"
          asChild
          className="bg-white text-blue-600 hover:bg-blue-50"
        >
          <Link href="/authentication/signup">Get Started Free</Link>
        </Button>
      </div>
    </section>
  );
}
