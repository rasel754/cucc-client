import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import PageTitle from "@/components/common/PageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Briefcase, Linkedin, Github, GraduationCap, Filter, Mail } from "lucide-react";
import { AlumniForm } from "@/components/admin/AlumniForm";
import { apiService, Alumni } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { getImageUrl } from "@/lib/utils";

const countries = [
  "All Countries",
  // Asia
  "Bangladesh", "India", "Pakistan", "China", "Japan", "South Korea", "Singapore",
  "Malaysia", "Indonesia", "Thailand", "Vietnam", "Philippines", "Nepal",
  "UAE", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman", "Turkey",
  // Europe
  "UK", "Germany", "France", "Italy", "Spain", "Netherlands", "Belgium", "Switzerland",
  "Sweden", "Norway", "Denmark", "Finland", "Austria", "Poland", "Ireland", "Portugal",
  "Greece", "Czech Republic", "Hungary", "Romania",
  // Americas
  "USA", "Canada", "Brazil", "Mexico", "Argentina", "Chile", "Colombia",
  // Oceania
  "Australia", "New Zealand", "Russia",
  // Other
  "Other"
];
const batches = ["All Batches", ...Array.from({ length: 59 }, (_, i) => `${1 + i}`)];

export default function AlumniPage() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [selectedBatch, setSelectedBatch] = useState("All Batches");
  const [showAlumniForm, setShowAlumniForm] = useState(false);
  const { toast } = useToast();

  const fetchAlumni = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getAlumni();
      if (response.success && response.data) {
        setAlumni(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch alumni:", error);
      toast({
        title: "Error",
        description: "Failed to load alumni data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  const filteredAlumni = alumni.filter((alum) => {
    const matchesSearch =
      (alum.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (alum.company?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (alum.jobRole?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (alum.email?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    const matchesCountry = selectedCountry === "All Countries" || alum.country === selectedCountry;
    const matchesBatch = selectedBatch === "All Batches" || alum.batch === selectedBatch;
    return matchesSearch && matchesCountry && matchesBatch;
  });

  return (
    <Layout>
      <PageTitle title="Alumni" />
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary via-secondary/95 to-primary/80 text-secondary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-6">
              <GraduationCap className="w-4 h-4" />
              <span className="text-sm font-semibold">Alumni Network</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Our Alumni Worldwide
            </h1>
            <p className="text-xl text-secondary-foreground/80 mb-6">
              Connect with CUCC alumni working at top companies around the globe
            </p>
            <Button
              variant="hero"
              onClick={() => setShowAlumniForm(true)}
            >
              Join as Alumni
            </Button>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, company, role, or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-[180px]">
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {batches.map((batch) => (
                    <SelectItem key={batch} value={batch}>
                      {batch === "All Batches" ? batch : `Batch ${batch}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Alumni Grid */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="text-center py-16">Loading alumni...</div>
          ) : filteredAlumni.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredAlumni.map((alum) => (
                <Card key={alum.id || alum._id} className="overflow-hidden card-hover border-border/50">
                  {/* Fixed Cover Image Profile */}
                  <div className="h-64 bg-muted relative border-b border-border/10 overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                    {alum.profilePhoto ? (
                      <div className="w-full h-full">
                        <img
                          src={getImageUrl(alum.profilePhoto)}
                          alt={alum.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-muted">
                        <span className="text-6xl">👨‍🎓</span>
                      </div>
                    )}
                    <Badge className="absolute top-3 right-3 bg-secondary text-secondary-foreground z-10">
                      Batch {alum.batch}
                    </Badge>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-display text-lg font-bold text-foreground">{alum.name}</h3>

                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Briefcase className="w-4 h-4 text-primary" />
                        <span>{alum.jobRole}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-xs">🏢</span>
                        <span className="font-medium text-foreground">{alum.company}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{alum.country}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4 text-primary" />
                        <span className="text-xs truncate">{alum.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                      {alum.linkedIn && (
                        <a href={alum.linkedIn} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-muted transition-colors flex-1 flex items-center justify-center">
                          <Linkedin className="w-4 h-4 text-muted-foreground hover:text-primary" />
                        </a>
                      )}
                      {alum.github && (
                        <a href={alum.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-muted transition-colors flex-1 flex items-center justify-center">
                          <Github className="w-4 h-4 text-muted-foreground hover:text-primary" />
                        </a>
                      )}
                      <a href={`mailto:${alum.email}`} className="p-2 rounded-lg hover:bg-muted transition-colors flex-1 flex items-center justify-center">
                        <Mail className="w-4 h-4 text-muted-foreground hover:text-primary" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No alumni found matching your filters.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCountry("All Countries");
                  setSelectedBatch("All Batches");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Alumni Form */}
      <AlumniForm
        open={showAlumniForm}
        onOpenChange={setShowAlumniForm}
        onSuccess={() => {
          toast({ title: "Registration Submitted", description: "Your request has been submitted for approval." });
          // Optionally refresh list if we want to show pending items immediately? 
          // Usually public list only shows approved. So no need to refresh list here.
        }}
      />
    </Layout>
  );
}
