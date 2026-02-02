import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Trophy, Calendar, Code2 } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const stats = [
  { icon: Users, value: "500+", label: "Active Members" },
  { icon: Trophy, value: "50+", label: "Awards Won" },
  { icon: Calendar, value: "100+", label: "Events Organized" },
  { icon: Code2, value: "3", label: "Specialized Wings" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/60" />
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-cucc-cyber/10 rounded-full blur-3xl animate-pulse-slow" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-cucc-cyber animate-pulse" />
            <span className="text-sm font-medium text-primary-foreground">Welcome to the Future of Computing</span>
          </div>
          
          {/* Headline */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight animate-slide-up">
            City University
            <span className="block mt-2">
              <span className="text-gradient bg-gradient-to-r from-primary to-cucc-sky bg-clip-text text-transparent">
                Computer Club
              </span>
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-secondary-foreground/90 max-w-2xl mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Empowering the next generation of tech innovators through programming, 
            cyber security, and research excellence. Join us and be part of 
            something extraordinary.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-16 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link to="/register">
              <Button variant="hero" size="xl">
                Join CUCC Today
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="heroOutline" size="xl">
                Learn More
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="p-4 rounded-xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <stat.icon className="w-6 h-6 text-primary mb-2" />
                <div className="font-display text-2xl md:text-3xl font-bold text-primary-foreground">{stat.value}</div>
                <div className="text-sm text-secondary-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-3 rounded-full bg-primary-foreground/50 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
