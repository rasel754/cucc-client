import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Briefcase, Linkedin, Github, GraduationCap, Filter, Mail } from "lucide-react";
import { AlumniForm } from "@/components/admin/AlumniForm";

const alumni = [
  {
    id: 1,
    name: "Dr. Aminul Islam",
    email: "aminul.islam@gmail.com",
    batch: "45",
    country: "USA",
    company: "Google",
    role: "Senior Software Engineer",
    image: "👨‍💻",
    linkedin: "#",
    github: "#",
  },
  {
    id: 2,
    name: "Rashida Begum",
    email: "rashida.begum@outlook.com",
    batch: "46",
    country: "Canada",
    company: "Microsoft",
    role: "Product Manager",
    image: "👩‍💼",
    linkedin: "#",
    github: "#",
  },
  {
    id: 3,
    name: "Tariq Rahman",
    email: "tariq.rahman@sap.com",
    batch: "47",
    country: "Germany",
    company: "SAP",
    role: "Data Scientist",
    image: "👨‍🔬",
    linkedin: "#",
    github: "#",
  },
  {
    id: 4,
    name: "Nasreen Akter",
    email: "nasreen@brainstation23.com",
    batch: "48",
    country: "Bangladesh",
    company: "Brain Station 23",
    role: "Tech Lead",
    image: "👩‍💻",
    linkedin: "#",
    github: "#",
  },
  {
    id: 5,
    name: "Jahangir Alam",
    email: "jahangir.alam@meta.com",
    batch: "49",
    country: "UK",
    company: "Meta",
    role: "ML Engineer",
    image: "🧑‍💻",
    linkedin: "#",
    github: "#",
  },
  {
    id: 6,
    name: "Farzana Haque",
    email: "farzana.haque@grab.com",
    batch: "50",
    country: "Singapore",
    company: "Grab",
    role: "Backend Developer",
    image: "👩‍🔧",
    linkedin: "#",
    github: "#",
  },
  {
    id: 7,
    name: "Mahbub Hossain",
    email: "mahbub@pathao.com",
    batch: "50",
    country: "Bangladesh",
    company: "Pathao",
    role: "CTO",
    image: "👨‍💼",
    linkedin: "#",
    github: "#",
  },
  {
    id: 8,
    name: "Sultana Razia",
    email: "sultana.razia@atlassian.com",
    batch: "51",
    country: "Australia",
    company: "Atlassian",
    role: "DevOps Engineer",
    image: "👩‍🔬",
    linkedin: "#",
    github: "#",
  },
];

const countries = ["All Countries", "Bangladesh", "USA", "Canada", "UK", "Germany", "Singapore", "Australia"];
const batches = ["All Batches", ...Array.from({ length: 15 }, (_, i) => `${45 + i}`)];

export default function AlumniPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [selectedBatch, setSelectedBatch] = useState("All Batches");
  const [showAlumniForm, setShowAlumniForm] = useState(false);

  const filteredAlumni = alumni.filter((alum) => {
    const matchesSearch = 
      alum.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alum.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alum.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alum.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = selectedCountry === "All Countries" || alum.country === selectedCountry;
    const matchesBatch = selectedBatch === "All Batches" || alum.batch === selectedBatch;
    return matchesSearch && matchesCountry && matchesBatch;
  });

  return (
    <Layout>
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
          {filteredAlumni.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredAlumni.map((alum) => (
                <Card key={alum.id} className="overflow-hidden card-hover border-border/50">
                  <div className="h-32 bg-gradient-to-br from-primary/10 to-muted flex items-center justify-center relative">
                    <span className="text-6xl">{alum.image}</span>
                    <Badge className="absolute top-3 right-3 bg-secondary text-secondary-foreground">
                      Batch {alum.batch}
                    </Badge>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-display text-lg font-bold text-foreground">{alum.name}</h3>
                    
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Briefcase className="w-4 h-4 text-primary" />
                        <span>{alum.role}</span>
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
                      <a href={alum.linkedin} className="p-2 rounded-lg hover:bg-muted transition-colors flex-1 flex items-center justify-center">
                        <Linkedin className="w-4 h-4 text-muted-foreground hover:text-primary" />
                      </a>
                      <a href={alum.github} className="p-2 rounded-lg hover:bg-muted transition-colors flex-1 flex items-center justify-center">
                        <Github className="w-4 h-4 text-muted-foreground hover:text-primary" />
                      </a>
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
      />
    </Layout>
  );
}
