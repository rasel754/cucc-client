import { Layout } from "@/components/layout/Layout";
import PageTitle from "@/components/common/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useParams, Link } from "react-router-dom";
import { Code2, Shield, Lightbulb, ArrowRight, Users, Trophy, Calendar, BookOpen } from "lucide-react";

const wingsData = {
  programming: {
    id: "programming",
    icon: Code2,
    title: "Programming Club",
    tagline: "Master the Art of Problem Solving",
    description: "The Programming Club is dedicated to nurturing competitive programmers and preparing them for national and international coding competitions including ICPC, Google Code Jam, and more.",
    color: "from-primary to-cucc-navy",
    features: [
      "Weekly competitive programming sessions",
      "ICPC preparation and team formation",
      "Algorithm and data structure workshops",
      "Regular intra-club contests",
      "Guest lectures from industry experts",
      "Problem-solving mentorship program",
    ],
    activities: [
      { title: "Weekly Contests", description: "Practice contests every Saturday" },
      { title: "ICPC Training", description: "Intensive training for regional competitions" },
      { title: "Algorithm Classes", description: "Deep dive into advanced algorithms" },
      { title: "Code Reviews", description: "Peer code review sessions" },
    ],
    stats: [
      { label: "Active Members", value: "150+" },
      { label: "Contests Held", value: "50+" },
      { label: "ICPC Teams", value: "10+" },
    ],
    achievements: [
      "5 teams qualified for ICPC Dhaka Regional 2025",
      "Winner at National Collegiate Programming Contest 2024",
      "20+ members placed in top tech companies",
    ],
  },
  cybersecurity: {
    id: "cybersecurity",
    icon: Shield,
    title: "Cyber Security Club",
    tagline: "Defend the Digital Frontier",
    description: "The Cyber Security Club focuses on ethical hacking, network security, and participating in Capture The Flag (CTF) competitions. We train the next generation of security professionals.",
    color: "from-accent to-emerald-700",
    features: [
      "Hands-on ethical hacking workshops",
      "CTF competition training",
      "Network security fundamentals",
      "Web application security testing",
      "Security audit practices",
      "Industry certification preparation",
    ],
    activities: [
      { title: "CTF Practice", description: "Weekly CTF challenges" },
      { title: "Penetration Testing", description: "Hands-on security testing labs" },
      { title: "Security Talks", description: "Guest lectures from professionals" },
      { title: "Bug Bounty", description: "Practice on real platforms" },
    ],
    stats: [
      { label: "Active Members", value: "80+" },
      { label: "CTFs Won", value: "15+" },
      { label: "Workshops", value: "30+" },
    ],
    achievements: [
      "Top 10 in National CTF Championship 2025",
      "Organized largest university CTF event",
      "Members working at top security firms",
    ],
  },
  research: {
    id: "research",
    icon: Lightbulb,
    title: "Research & Development Club",
    tagline: "Innovate for Tomorrow",
    description: "The Research & Development Club is where innovation meets execution. We work on cutting-edge projects in AI/ML, IoT, blockchain, and publish research papers in renowned conferences.",
    color: "from-cucc-gold to-orange-600",
    features: [
      "AI/ML project development",
      "IoT and embedded systems",
      "Research paper writing guidance",
      "Innovation lab access",
      "Industry collaboration projects",
      "Startup incubation support",
    ],
    activities: [
      { title: "Research Groups", description: "Topic-specific research teams" },
      { title: "Project Showcases", description: "Monthly demo days" },
      { title: "Paper Reviews", description: "Weekly journal club" },
      { title: "Hackathons", description: "Innovation challenges" },
    ],
    stats: [
      { label: "Active Members", value: "60+" },
      { label: "Papers Published", value: "12+" },
      { label: "Projects", value: "25+" },
    ],
    achievements: [
      "12 papers published in IEEE/ACM conferences",
      "3 startups founded by alumni",
      "Winner at National Innovation Challenge",
    ],
  },
};

export default function WingDetailPage() {
  const { wingId } = useParams();
  const wing = wingsData[wingId as keyof typeof wingsData];

  if (!wing) {
    return (
      <Layout>
        <PageTitle title="Wing Not Found" />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Wing not found</h1>
            <Link to="/wings" className="text-primary hover:underline mt-4 block">
              View all wings
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const Icon = wing.icon;

  return (
    <Layout>
      <PageTitle title={wing.title} />
      {/* Hero */}
      <section className={`bg-gradient-to-br ${wing.color} text-primary-foreground py-20 md:py-32`}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
                <Icon className="w-8 h-8" />
              </div>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {wing.title}
            </h1>
            <p className="text-2xl text-primary-foreground/80 mb-6">{wing.tagline}</p>
            <p className="text-lg text-primary-foreground/70 mb-8">{wing.description}</p>
            <Link to="/register">
              <Button size="lg" className="bg-primary-foreground text-secondary hover:bg-primary-foreground/90">
                Join This Wing
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto text-center">
            {wing.stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-muted/50">
        <div className="container mx-auto">
          <h2 className="font-display text-3xl font-bold text-foreground mb-8 text-center">What We Offer</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {wing.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="section-padding bg-background">
        <div className="container mx-auto">
          <h2 className="font-display text-3xl font-bold text-foreground mb-8 text-center">Regular Activities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wing.activities.map((activity) => (
              <Card key={activity.title} className="card-hover border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-display font-bold text-lg text-foreground mb-2">{activity.title}</h3>
                  <p className="text-muted-foreground text-sm">{activity.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="section-padding bg-muted/50">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-foreground mb-8 text-center">
              <Trophy className="inline w-8 h-8 text-cucc-gold mr-2" />
              Notable Achievements
            </h2>
            <div className="space-y-4">
              {wing.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50">
                  <div className="w-8 h-8 rounded-full bg-cucc-gold/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-cucc-gold font-bold">{index + 1}</span>
                  </div>
                  <span className="text-foreground">{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`section-padding bg-gradient-to-r ${wing.color} text-primary-foreground`}>
        <div className="container mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Ready to Join?</h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
            Become a member of {wing.title} and start your journey.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-primary-foreground text-secondary hover:bg-primary-foreground/90">
              Apply Now
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
