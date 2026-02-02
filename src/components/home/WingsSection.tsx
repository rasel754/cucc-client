import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Code2, Shield, Lightbulb, ArrowRight, ExternalLink } from "lucide-react";

const wings = [
  {
    id: "programming",
    icon: Code2,
    title: "Programming Club",
    description: "Master algorithms, data structures, and competitive programming. Participate in national and international coding contests.",
    color: "from-primary to-cucc-navy",
    features: ["Competitive Programming", "Algorithm Training", "ICPC Preparation", "Weekly Contests"],
    href: "/wings/programming",
  },
  {
    id: "cybersecurity",
    icon: Shield,
    title: "Cyber Security Club",
    description: "Learn ethical hacking, network security, and CTF competitions. Become a cybersecurity professional.",
    color: "from-cucc-cyber to-emerald-700",
    features: ["Ethical Hacking", "CTF Competitions", "Network Security", "Security Audits"],
    href: "/wings/cybersecurity",
  },
  {
    id: "research",
    icon: Lightbulb,
    title: "Research & Development",
    description: "Explore cutting-edge technologies, work on innovative projects, and publish research papers.",
    color: "from-cucc-gold to-orange-600",
    features: ["AI/ML Projects", "IoT Development", "Research Papers", "Innovation Labs"],
    href: "/wings/research",
  },
];

export function WingsSection() {
  return (
    <section className="section-padding bg-muted/50">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="text-sm font-semibold text-primary">Our Wings</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Three Pillars of Excellence
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our specialized wings cater to different areas of computer science, 
            ensuring every member finds their passion and grows their skills.
          </p>
        </div>

        {/* Wings Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wings.map((wing) => (
            <Card key={wing.id} className="group overflow-hidden card-hover border-border/50">
              {/* Gradient Header */}
              <div className={`h-40 bg-gradient-to-br ${wing.color} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                <div className="absolute top-6 left-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
                    <wing.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent" />
              </div>
              
              <CardContent className="p-6">
                <h3 className="font-display text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {wing.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {wing.description}
                </p>
                
                {/* Features */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {wing.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </div>
                  ))}
                </div>
                
                <Link to={wing.href}>
                  <Button variant="outline" className="w-full group/btn">
                    Explore Wing
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Interested in joining a wing? Register as a member to get started.
          </p>
          <Link to="/register">
            <Button variant="hero" size="lg">
              Become a Member
              <ExternalLink className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
