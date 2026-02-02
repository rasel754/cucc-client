import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users, Rocket } from "lucide-react";

export function CTASection() {
  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cucc-cyber/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA Card */}
          <div className="relative rounded-3xl overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-cucc-navy to-primary" />
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            
            {/* Content */}
            <div className="relative p-8 md:p-12 lg:p-16 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-8">
                <Sparkles className="w-4 h-4 text-cucc-gold" />
                <span className="text-sm font-semibold text-primary-foreground">Start Your Journey</span>
              </div>
              
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
                Ready to Join the 
                <span className="block mt-2 text-cucc-sky">Tech Revolution?</span>
              </h2>
              
              <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-10">
                Become a member of City University Computer Club and unlock access to 
                exclusive events, workshops, competitions, and a network of tech enthusiasts.
              </p>
              
              {/* Benefits */}
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                {[
                  { icon: Users, label: "Join 500+ Members" },
                  { icon: Rocket, label: "Access All Events" },
                  { icon: Sparkles, label: "Get Certified" },
                ].map((benefit) => (
                  <div key={benefit.label} className="flex items-center justify-center gap-3 text-primary-foreground/80">
                    <benefit.icon className="w-5 h-5 text-cucc-gold" />
                    <span className="font-medium">{benefit.label}</span>
                  </div>
                ))}
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register">
                  <Button 
                    size="xl" 
                    className="bg-primary-foreground text-secondary hover:bg-primary-foreground/90 shadow-xl hover:shadow-2xl"
                  >
                    Join CUCC Now
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="heroOutline" size="xl">
                    Learn More
                  </Button>
                </Link>
              </div>
              
              <p className="mt-6 text-sm text-primary-foreground/60">
                Already a member? <Link to="/login" className="text-cucc-sky hover:underline">Login here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
