import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, ArrowRight, FileText, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { apiService } from "@/lib/api";

const notices = [
  {
    id: 1,
    title: "CUCC Programming Contest 2026 Registration Now Open",
    category: "Programming Contest",
    date: "Feb 2, 2026",
    priority: "high",
    hasAttachment: true,
    excerpt: "Registration for the annual programming contest is now open. All members are encouraged to participate...",
  },
  {
    id: 2,
    title: "New Wing Leaders Appointed for 2026",
    category: "Announcement",
    date: "Feb 1, 2026",
    priority: "normal",
    hasAttachment: false,
    excerpt: "We are pleased to announce the new wing leaders for all three wings of CUCC...",
  },
  {
    id: 3,
    title: "Cyber Security Workshop Series Starting Soon",
    category: "Workshop",
    date: "Jan 30, 2026",
    priority: "normal",
    hasAttachment: true,
    excerpt: "A comprehensive 5-day workshop series on ethical hacking and network security...",
  },
  {
    id: 4,
    title: "ICPC Dhaka Regional Selection Criteria Updated",
    category: "Selection Contest",
    date: "Jan 28, 2026",
    priority: "high",
    hasAttachment: true,
    excerpt: "Updated criteria for ICPC team selection. Please review the new guidelines...",
  },
];

const priorityColors = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  normal: "bg-muted text-muted-foreground border-muted",
};

export function NoticesSection() {
  const [notices, setNotices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await apiService.getAllNotices();
        if (response.success && response.data) {
          // Take only latest 4
          setNotices(response.data.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch notices:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotices();
  }, []);

  return (
    <section className="section-padding bg-muted/50">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Bell className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Latest Notices</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Stay Updated
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Important announcements, event updates, and news from CUCC.
              Don't miss out on any opportunities!
            </p>
          </div>
          <Link to="/notices" className="mt-6 md:mt-0">
            <Button variant="outline">
              View All Notices
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Notices Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {isLoading ? (
            <div className="col-span-2 text-center py-12">Loading notices...</div>
          ) : notices.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-muted-foreground">No recent notices found.</div>
          ) : (
            notices.map((notice, index) => (
              <Card
                key={notice.id}
                className={`overflow-hidden card-hover border-border/50 ${index === 0 ? 'lg:col-span-2' : ''}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${notice.priority === 'high' ? 'bg-destructive/10' : 'bg-primary/10'
                      }`}>
                      <FileText className={`w-6 h-6 ${notice.priority === 'high' ? 'text-destructive' : 'text-primary'}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant="outline" className={priorityColors[notice.priority as keyof typeof priorityColors]}>
                          {notice.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {notice.date}
                        </div>
                      </div>

                      <Link to={`/notices/${notice.id}`}>
                        <h3 className="font-display font-bold text-lg text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                          {notice.title}
                        </h3>
                      </Link>

                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
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
  );
}
