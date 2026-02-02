import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Image, Video, Trophy, Filter, X } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const categories = ["All", "Events", "Workshops", "Contests", "Achievements", "Team"];

const galleryItems = [
  { id: 1, type: "image", category: "Events", title: "CUCC Annual Meetup 2025", emoji: "🎉" },
  { id: 2, type: "image", category: "Contests", title: "ICPC Practice Session", emoji: "💻" },
  { id: 3, type: "image", category: "Workshops", title: "Cyber Security Workshop", emoji: "🛡️" },
  { id: 4, type: "image", category: "Achievements", title: "National Hackathon Winners", emoji: "🏆" },
  { id: 5, type: "image", category: "Team", title: "Executive Body 2025", emoji: "👥" },
  { id: 6, type: "image", category: "Events", title: "Freshers Welcome 2025", emoji: "🎊" },
  { id: 7, type: "image", category: "Contests", title: "CodeStorm Hackathon", emoji: "⚡" },
  { id: 8, type: "image", category: "Workshops", title: "AI/ML Bootcamp", emoji: "🤖" },
  { id: 9, type: "image", category: "Achievements", title: "Research Publication", emoji: "📚" },
  { id: 10, type: "image", category: "Events", title: "Tech Talk Series", emoji: "🎤" },
  { id: 11, type: "image", category: "Team", title: "Programming Wing", emoji: "👨‍💻" },
  { id: 12, type: "image", category: "Contests", title: "CTF Competition", emoji: "🔐" },
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<typeof galleryItems[0] | null>(null);

  const filteredItems = selectedCategory === "All" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary via-secondary/95 to-primary/80 text-secondary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-6">
              <Image className="w-4 h-4" />
              <span className="text-sm font-semibold">Gallery</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Our Memories
            </h1>
            <p className="text-xl text-secondary-foreground/80">
              Capturing moments from our events, workshops, and achievements
            </p>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-6 bg-background border-b border-border sticky top-16 md:top-20 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="flex-shrink-0"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <Dialog key={item.id}>
                <DialogTrigger asChild>
                  <Card className="overflow-hidden cursor-pointer card-hover border-border/50 group aspect-square">
                    <CardContent className="p-0 h-full">
                      <div className="h-full bg-gradient-to-br from-primary/10 to-muted flex flex-col items-center justify-center relative">
                        <span className="text-6xl md:text-7xl group-hover:scale-110 transition-transform">
                          {item.emoji}
                        </span>
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent">
                          <p className="text-sm font-medium text-foreground line-clamp-2">
                            {item.title}
                          </p>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-3xl p-0">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-muted flex items-center justify-center">
                    <span className="text-9xl">{item.emoji}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground mt-1">{item.category}</p>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto text-center">
            <div>
              <div className="font-display text-4xl font-bold text-primary">500+</div>
              <div className="text-muted-foreground">Photos</div>
            </div>
            <div>
              <div className="font-display text-4xl font-bold text-primary">50+</div>
              <div className="text-muted-foreground">Videos</div>
            </div>
            <div>
              <div className="font-display text-4xl font-bold text-primary">100+</div>
              <div className="text-muted-foreground">Events</div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
