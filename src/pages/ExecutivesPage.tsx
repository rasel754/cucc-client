import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Linkedin, Github, Mail, ArrowRight } from "lucide-react";

const executives = [
  {
    name: "Rafiq Hasan",
    role: "President",
    department: "CSE",
    batch: "55",
    image: "👨‍💼",
    linkedin: "#",
    github: "#",
    email: "rafiq@cucc.com",
  },
  {
    name: "Fatima Akter",
    role: "Vice President",
    department: "CSE",
    batch: "55",
    image: "👩‍💼",
    linkedin: "#",
    github: "#",
    email: "fatima@cucc.com",
  },
  {
    name: "Mohammad Ali",
    role: "General Secretary",
    department: "CSE",
    batch: "56",
    image: "👨‍💻",
    linkedin: "#",
    github: "#",
    email: "ali@cucc.com",
  },
  {
    name: "Anika Rahman",
    role: "Treasurer",
    department: "IT",
    batch: "56",
    image: "👩‍💻",
    linkedin: "#",
    github: "#",
    email: "anika@cucc.com",
  },
  {
    name: "Karim Ahmed",
    role: "Programming Wing Lead",
    department: "CSE",
    batch: "56",
    image: "🧑‍💻",
    linkedin: "#",
    github: "#",
    email: "karim@cucc.com",
  },
  {
    name: "Sabrina Islam",
    role: "Cyber Security Lead",
    department: "CSE",
    batch: "57",
    image: "👩‍🔬",
    linkedin: "#",
    github: "#",
    email: "sabrina@cucc.com",
  },
  {
    name: "Imran Khan",
    role: "R&D Wing Lead",
    department: "CSE",
    batch: "56",
    image: "👨‍🔬",
    linkedin: "#",
    github: "#",
    email: "imran@cucc.com",
  },
  {
    name: "Nusrat Jahan",
    role: "Event Coordinator",
    department: "IT",
    batch: "57",
    image: "👩‍🎨",
    linkedin: "#",
    github: "#",
    email: "nusrat@cucc.com",
  },
];

export default function ExecutivesPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary via-secondary/95 to-primary/80 text-secondary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-6">
              <span className="text-sm font-semibold">Executive Body</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Meet Our Leaders
            </h1>
            <p className="text-xl text-secondary-foreground/80">
              The dedicated team driving CUCC's mission forward
            </p>
          </div>
        </div>
      </section>

      {/* Executives Grid */}
      <section className="section-padding bg-background">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {executives.map((exec) => (
              <Card key={exec.name} className="overflow-hidden card-hover border-border/50 group">
                <div className="h-32 bg-gradient-to-br from-primary/10 to-muted flex items-center justify-center">
                  <span className="text-6xl">{exec.image}</span>
                </div>
                <CardContent className="p-5 text-center">
                  <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {exec.name}
                  </h3>
                  <p className="text-primary text-sm font-semibold mt-1">{exec.role}</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    {exec.department} | Batch {exec.batch}
                  </p>
                  
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <a href={exec.linkedin} className="p-2 rounded-lg hover:bg-muted transition-colors">
                      <Linkedin className="w-4 h-4 text-muted-foreground hover:text-primary" />
                    </a>
                    <a href={exec.github} className="p-2 rounded-lg hover:bg-muted transition-colors">
                      <Github className="w-4 h-4 text-muted-foreground hover:text-primary" />
                    </a>
                    <a href={`mailto:${exec.email}`} className="p-2 rounded-lg hover:bg-muted transition-colors">
                      <Mail className="w-4 h-4 text-muted-foreground hover:text-primary" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="section-padding bg-muted/50">
        <div className="container mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            Want to be part of the executive body?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Join CUCC as a member first, participate actively, and you could be leading the club next!
          </p>
          <Link to="/register">
            <Button variant="hero">
              Join CUCC
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
