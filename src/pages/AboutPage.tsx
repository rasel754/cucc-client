import { Layout } from "@/components/layout/Layout";
import PageTitle from "@/components/common/PageTitle";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Target, Eye, BookOpen, Download, Users, Calendar, Mail, Building2, Briefcase } from "lucide-react";
import { useEffect, useState } from "react";
import { apiService, Advisor } from "@/lib/api";
import { getImageUrl } from "@/lib/utils";

const facultyAdvisors = [
  {
    name: "Dr. Mohammad Rahman",
    title: "Faculty Advisor",
    department: "Computer Science & Engineering",
    image: "👨‍🏫",
  },
  {
    name: "Prof. Fatima Ahmed",
    title: "Co-Advisor",
    department: "Information Technology",
    image: "👩‍🏫",
  },
];

const timeline = [
  { year: "2015", event: "CUCC Founded", description: "Club established with 20 founding members" },
  { year: "2017", event: "First ICPC Qualification", description: "Team qualified for ICPC Dhaka Regional" },
  { year: "2019", event: "Cyber Security Wing", description: "Launched dedicated cyber security division" },
  { year: "2021", event: "Research Wing", description: "Established R&D wing for innovation" },
  { year: "2023", event: "500+ Members", description: "Reached milestone of 500 active members" },
  { year: "2025", event: "National Recognition", description: "Won Best University Tech Club Award" },
];

export default function AboutPage() {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        const response = await apiService.getAllAdvisors();
        if (response.success && response.data) {
          setAdvisors(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch advisors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvisors();
  }, []);

  return (
    <Layout>
      <PageTitle title="About Us" />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary via-secondary/95 to-primary/80 text-secondary-foreground py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-6">
              <span className="text-sm font-semibold">About Us</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Building Tomorrow's
              <span className="block text-cucc-sky mt-2">Tech Leaders</span>
            </h1>
            <p className="text-xl text-secondary-foreground/80 mb-8">
              City University Computer Club (CUCC) is the premier student technology organization,
              dedicated to fostering innovation, excellence, and community among aspiring tech professionals.
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-primary-foreground text-secondary hover:bg-primary-foreground/90">
                Join Our Community
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-background">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="p-8 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To create a vibrant ecosystem where students can explore, learn, and master
                various domains of computer science. We aim to provide hands-on experience
                through workshops, competitions, and real-world projects that prepare our
                members for successful careers in technology.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-accent/5 border border-accent/10">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-accent" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                To become the leading student technology organization in Bangladesh, producing
                skilled professionals who drive innovation and contribute to the nation's
                digital transformation. We envision a community where every member achieves
                their full potential in the tech industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="section-padding bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Our Journey</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From a small group of passionate students to a thriving community of 500+ members
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 -translate-x-1/2" />

            {timeline.map((item, index) => (
              <div
                key={item.year}
                className={`relative flex items-center gap-8 mb-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
              >
                {/* Content */}
                <div className={`flex-1 ml-12 md:ml-0 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'}`}>
                  <div className="p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                    <span className="text-sm font-bold text-primary">{item.year}</span>
                    <h3 className="font-display text-lg font-bold text-foreground mt-1">{item.event}</h3>
                    <p className="text-muted-foreground text-sm mt-2">{item.description}</p>
                  </div>
                </div>

                {/* Circle */}
                <div className="absolute left-4 md:left-1/2 w-8 h-8 bg-primary rounded-full border-4 border-background -translate-x-1/2 flex items-center justify-center">
                  <Calendar className="w-3 h-3 text-primary-foreground" />
                </div>

                {/* Empty space for alternating layout */}
                <div className="hidden md:block flex-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Advisors */}
      <section className="section-padding bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Faculty Advisors</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our dedicated faculty advisors guide and support our initiatives
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {advisors.length === 0 && !isLoading && (
              <p className="text-center text-muted-foreground w-full col-span-2">No faculty advisors listed yet.</p>
            )}
            {advisors.map((advisor) => (
              <div key={advisor._id} className="group relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                {/* Hover Gradient Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 flex flex-col items-center">
                  {/* Profile Image with Ring */}
                  <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-primary to-cucc-navy mb-6 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-full h-full rounded-full bg-background overflow-hidden relative">
                      {advisor.profileImage?.url ? (
                        <img
                          src={getImageUrl(advisor.profileImage.url)}
                          alt={advisor.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <span className="text-4xl">👨‍🏫</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <h3 className="font-display text-xl font-bold text-foreground mb-1">{advisor.name}</h3>

                  <div className="flex flex-col gap-2 mt-4 w-full">
                    <div className="flex items-center gap-2 text-sm text-primary bg-primary/5 px-3 py-1.5 rounded-full self-center">
                      <Briefcase className="w-4 h-4" />
                      <span className="font-medium">{advisor.role}</span>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
                      <Building2 className="w-4 h-4" />
                      <span>{advisor.department}</span>
                    </div>

                    <a
                      href={`mailto:${advisor.email}`}
                      className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mt-1"
                    >
                      <Mail className="w-4 h-4" />
                      <span>{advisor.email}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Constitution */}
      <section id="constitution" className="section-padding bg-muted/50">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Club Constitution</h2>
            <p className="text-muted-foreground mb-8">
              Our constitution outlines the rules, regulations, and governance structure of CUCC.
              It ensures transparency and fairness in all club activities.
            </p>
            <Button variant="hero" size="lg">
              <Download className="w-4 h-4" />
              Download Constitution (PDF)
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-r from-primary to-cucc-navy text-primary-foreground">
        <div className="container mx-auto text-center">
          <Users className="w-12 h-12 mx-auto mb-6 opacity-80" />
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Ready to Join?</h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
            Become a member of CUCC and start your journey towards becoming a tech professional.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-primary-foreground text-secondary hover:bg-primary-foreground/90">
              Apply for Membership
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
