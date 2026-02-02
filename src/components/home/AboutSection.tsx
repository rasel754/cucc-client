import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Target, Lightbulb, Users, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Our Mission",
    description: "To foster a vibrant community of tech enthusiasts and provide platforms for learning, innovation, and professional development.",
  },
  {
    icon: Lightbulb,
    title: "Our Vision",
    description: "To become the leading student technology organization, producing skilled professionals who contribute to Bangladesh's digital transformation.",
  },
  {
    icon: Users,
    title: "Our Values",
    description: "Innovation, collaboration, excellence, and inclusivity drive everything we do. We believe in learning together and growing together.",
  },
];

export function AboutSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="text-sm font-semibold text-primary">About CUCC</span>
            </div>
            
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Building the Future, 
              <span className="text-gradient bg-gradient-to-r from-primary to-cucc-navy bg-clip-text text-transparent block mt-2">
                One Line of Code at a Time
              </span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8">
              City University Computer Club (CUCC) is the premier technology student organization 
              at City University. Since our establishment, we've been dedicated to nurturing 
              tech talent and building a strong community of programmers, security experts, 
              and researchers.
            </p>
            
            <div className="space-y-6 mb-10">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-1">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Link to="/about">
              <Button variant="outline" size="lg">
                Read Our Full Story
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          {/* Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-48 md:h-64 rounded-2xl bg-gradient-to-br from-primary to-cucc-navy shadow-xl overflow-hidden flex items-center justify-center">
                  <div className="text-center text-primary-foreground p-6">
                    <div className="font-display text-4xl font-bold mb-2">10+</div>
                    <div className="text-sm opacity-80">Years of Excellence</div>
                  </div>
                </div>
                <div className="h-32 md:h-40 rounded-2xl bg-gradient-to-br from-accent to-accent/70 shadow-xl overflow-hidden flex items-center justify-center">
                  <div className="text-center text-accent-foreground p-4">
                    <div className="font-display text-3xl font-bold mb-1">50+</div>
                    <div className="text-xs opacity-80">Contest Wins</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="h-32 md:h-40 rounded-2xl bg-muted shadow-xl overflow-hidden flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="font-display text-3xl font-bold text-foreground mb-1">100+</div>
                    <div className="text-xs text-muted-foreground">Events Hosted</div>
                  </div>
                </div>
                <div className="h-48 md:h-64 rounded-2xl bg-gradient-to-br from-cucc-sky to-primary shadow-xl overflow-hidden flex items-center justify-center">
                  <div className="text-center text-primary-foreground p-6">
                    <div className="font-display text-4xl font-bold mb-2">500+</div>
                    <div className="text-sm opacity-80">Active Members</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 p-4 rounded-2xl bg-card shadow-xl border border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-display font-bold text-foreground">Join Today!</div>
                  <div className="text-sm text-muted-foreground">Be part of our family</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
