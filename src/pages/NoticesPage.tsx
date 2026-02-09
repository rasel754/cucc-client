import { Layout } from "@/components/layout/Layout";
import PageTitle from "@/components/common/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Download, FileText, ArrowRight, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { apiService, Notice } from "@/lib/api";
import { Link } from "react-router-dom";

const categories = ["All", "Programming Contest", "Workshop", "Hackathon", "Seminar", "Bootcamp", "Announcement"];

export default function NoticesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.getAllNotices({ category: selectedCategory });
        if (response.success && response.data) {
          setNotices(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch notices:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotices();
  }, [selectedCategory]);

  return (
    <Layout>
      <PageTitle title="Notices" />
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary via-secondary/95 to-primary/80 text-secondary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-6">
              <Bell className="w-4 h-4" />
              <span className="text-sm font-semibold">Notices</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Notice Board
            </h1>
            <p className="text-xl text-secondary-foreground/80">
              Stay updated with the latest announcements and news from CUCC
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

      {/* Notices List */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto">
          <div className="space-y-4 max-w-4xl mx-auto">
            {isLoading ? (
              <div className="text-center py-12">Loading notices...</div>
            ) : notices.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No notices found in this category.</div>
            ) : (
              notices.map((notice) => (
                <Card key={notice.id} className="overflow-hidden card-hover border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${notice.priority === 'high' ? 'bg-destructive/10' : 'bg-primary/10'
                        }`}>
                        <FileText className={`w-6 h-6 ${notice.priority === 'high' ? 'text-destructive' : 'text-primary'
                          }`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="outline" className={
                            notice.priority === 'high'
                              ? 'bg-destructive/10 text-destructive border-destructive/20'
                              : ''
                          }>
                            {notice.category}
                          </Badge>
                          {notice.priority === 'high' && (
                            <Badge className="bg-destructive text-destructive-foreground">Important</Badge>
                          )}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                            <Calendar className="w-3 h-3" />
                            {notice.date}
                          </div>
                        </div>

                        <Link to={`/notices/${notice.id}`}>
                          <h3 className="font-display text-lg font-bold text-foreground mb-2 hover:text-primary transition-colors cursor-pointer">
                            {notice.title}
                          </h3>
                        </Link>

                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                          {notice.content}
                        </p>

                        <div className="flex items-center justify-between">
                          <Link to={`/notices/${notice.id}`}>
                            <Button variant="link" className="p-0 h-auto text-primary">
                              Read More
                              <ArrowRight className="w-3 h-3" />
                            </Button>
                          </Link>
                          {notice.hasAttachment && (
                            <a href={notice.attachment} target="_blank" rel="noopener noreferrer">
                              <Button variant="ghost" size="sm" className="text-muted-foreground">
                                <Download className="w-4 h-4" />
                                Attachment
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
