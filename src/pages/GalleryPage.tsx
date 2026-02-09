import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import PageTitle from "@/components/common/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Image, Filter, Calendar, Layers } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { apiService, Gallery } from "@/lib/api";
import { getImageUrl } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function GalleryPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      const response = await apiService.getAllGalleries();
      if (response.success && response.data) {
        setGalleries(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch galleries:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fixed categories as requested
  const categories = ["All", "Events", "Workshops", "Contests", "Achievements", "Team"];

  const filteredItems = selectedCategory === "All"
    ? galleries
    : galleries.filter(item => (item.category || "Events") === selectedCategory);

  return (
    <Layout>
      <PageTitle title="Gallery" />
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
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            {loading ? (
              Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-9 w-24 rounded-md" />)
            ) : (
              categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="flex-shrink-0 capitalize"
                >
                  {category}
                </Button>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding bg-muted/30 min-h-[500px]">
        <div className="container mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <Skeleton key={i} className="aspect-video rounded-xl" />
              ))}
            </div>
          ) : galleries.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Image className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <h3 className="text-xl font-semibold">No Memories Yet</h3>
              <p>Check back later for photos from our events.</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p>No photos found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Dialog key={item._id}>
                  <DialogTrigger asChild>
                    <Card className="overflow-hidden cursor-pointer card-hover border-border/50 group h-full flex flex-col">
                      <div className="aspect-video bg-muted relative overflow-hidden">
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={getImageUrl(item.images[0].url)}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Image className="w-12 h-12 opacity-20" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <p className="text-white font-medium text-sm">View Album</p>
                        </div>
                        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Layers className="w-3 h-3" />
                          {item.images?.length || 0}
                        </div>
                      </div>
                      <CardContent className="p-4 flex-1 flex flex-col">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs shrink-0 capitalize">
                            {item.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                            <Calendar className="w-3 h-3" />
                            {new Date(item.date).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {item.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none md:max-h-[85vh]">
                    <div className="relative w-full h-full flex flex-col bg-background rounded-lg overflow-hidden shadow-2xl">
                      <DialogHeader className="p-4 border-b shrink-0 flex flex-row items-center justify-between">
                        <div className="text-left w-full">
                          <DialogTitle className="text-xl">{item.title}</DialogTitle>
                          <DialogDescription className="mt-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{item.category}</Badge>
                              <span>{new Date(item.date).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>{item.images?.length || 0} Photos</span>
                            </div>
                            {item.description && <p className="text-sm text-foreground/80">{item.description}</p>}
                          </DialogDescription>
                        </div>
                      </DialogHeader>

                      <div className="flex-1 bg-black/5 overflow-hidden flex items-center justify-center p-4 md:p-8">
                        {item.images && item.images.length > 0 ? (
                          <Carousel className="w-full max-w-3xl">
                            <CarouselContent>
                              {item.images.map((img, index) => (
                                <CarouselItem key={index} className="flex items-center justify-center">
                                  <div className="relative w-full max-h-[60vh] flex items-center justify-center rounded-lg overflow-hidden">
                                    <img
                                      src={getImageUrl(img.url)}
                                      alt={`${item.title} - ${index + 1}`}
                                      className="max-w-full max-h-[60vh] object-contain"
                                    />
                                  </div>
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-2" />
                            <CarouselNext className="right-2" />
                          </Carousel>
                        ) : (
                          <div className="text-muted-foreground">No images available</div>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
