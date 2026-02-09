import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import PageTitle from "@/components/common/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Linkedin, Github, Mail, ArrowRight, X } from "lucide-react";
import { apiService, ExecutiveMember } from "@/lib/api";
import { getImageUrl } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function ExecutivesPage() {
  const [executives, setExecutives] = useState<ExecutiveMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchExecutives = async () => {
      try {
        const response = await apiService.getExecutiveBody();
        if (response.success && response.data) {
          setExecutives(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch executive members:", error);
        toast({
          title: "Error",
          description: "Failed to load executive members.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExecutives();
  }, [toast]);

  return (
    <Layout>
      <PageTitle title="Executive Body" />
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
          {isLoading ? (
            <div className="text-center py-12">Loading executives...</div>
          ) : executives.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No executive members found.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {executives.map((exec) => (
                <Card key={exec.id || exec._id} className="overflow-hidden card-hover border-border/50 group flex flex-col">
                  <div className="aspect-square bg-muted relative overflow-hidden">
                    {exec.image?.url || exec.profilePhoto ? (
                      <img
                        src={getImageUrl(exec.image?.url || exec.profilePhoto)}
                        alt={exec.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10 text-4xl">
                        {exec.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <CardContent className="p-5 text-center flex-1 flex flex-col">
                    <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {exec.name}
                    </h3>
                    <p className="text-primary text-sm font-semibold mt-1">{exec.role}</p>
                    <p className="text-muted-foreground text-sm mt-1 mb-4">
                      {exec.department} {exec.batch && `| Batch ${exec.batch}`}
                    </p>

                    <div className="mt-auto flex items-center justify-center gap-2">
                      {exec.linkedin && (
                        <a href={exec.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-muted transition-colors">
                          <Linkedin className="w-4 h-4 text-muted-foreground hover:text-primary" />
                        </a>
                      )}
                      {exec.github && (
                        <a href={exec.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-muted transition-colors">
                          <Github className="w-4 h-4 text-muted-foreground hover:text-primary" />
                        </a>
                      )}
                      <a href={`mailto:${exec.email}`} className="p-2 rounded-lg hover:bg-muted transition-colors">
                        <Mail className="w-4 h-4 text-muted-foreground hover:text-primary" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
