import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Download, FileText, ArrowRight, Filter } from "lucide-react";
import { useState } from "react";

const categories = ["All", "Programming Contest", "Workshop", "Hackathon", "Seminar", "Bootcamp", "Announcement"];

const noticesData = [
  {
    id: 1,
    title: "CUCC Programming Contest 2026 Registration Now Open",
    category: "Programming Contest",
    date: "Feb 2, 2026",
    priority: "high",
    hasAttachment: true,
    content: "Registration for the annual programming contest is now open. All members are encouraged to participate. Teams of up to 3 members can register.",
  },
  {
    id: 2,
    title: "New Wing Leaders Appointed for 2026",
    category: "Announcement",
    date: "Feb 1, 2026",
    priority: "normal",
    hasAttachment: false,
    content: "We are pleased to announce the new wing leaders for all three wings of CUCC for the year 2026.",
  },
  {
    id: 3,
    title: "Cyber Security Workshop Series Starting Feb 20",
    category: "Workshop",
    date: "Jan 30, 2026",
    priority: "normal",
    hasAttachment: true,
    content: "A comprehensive 5-day workshop series on ethical hacking and network security. Open to all members.",
  },
  {
    id: 4,
    title: "ICPC Dhaka Regional Selection Criteria Updated",
    category: "Programming Contest",
    date: "Jan 28, 2026",
    priority: "high",
    hasAttachment: true,
    content: "Updated criteria for ICPC team selection. Please review the new guidelines before the selection round.",
  },
  {
    id: 5,
    title: "CodeStorm Hackathon 2026 Sponsorship Announcement",
    category: "Hackathon",
    date: "Jan 25, 2026",
    priority: "normal",
    hasAttachment: false,
    content: "We are excited to announce our sponsors for CodeStorm Hackathon 2026. Prize pool of 500,000 BDT!",
  },
  {
    id: 6,
    title: "AI/ML Bootcamp Schedule Released",
    category: "Bootcamp",
    date: "Jan 22, 2026",
    priority: "normal",
    hasAttachment: true,
    content: "The complete schedule for the 3-day AI/ML Bootcamp has been released. Check the attachment for details.",
  },
];

export default function NoticesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredNotices = selectedCategory === "All" 
    ? noticesData 
    : noticesData.filter(n => n.category === selectedCategory);

  return (
    <Layout>
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
            {filteredNotices.map((notice) => (
              <Card key={notice.id} className="overflow-hidden card-hover border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      notice.priority === 'high' ? 'bg-destructive/10' : 'bg-primary/10'
                    }`}>
                      <FileText className={`w-6 h-6 ${
                        notice.priority === 'high' ? 'text-destructive' : 'text-primary'
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
                      
                      <h3 className="font-display text-lg font-bold text-foreground mb-2 hover:text-primary transition-colors cursor-pointer">
                        {notice.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm mb-4">
                        {notice.content}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <Button variant="link" className="p-0 h-auto text-primary">
                          Read More
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                        {notice.hasAttachment && (
                          <Button variant="ghost" size="sm" className="text-muted-foreground">
                            <Download className="w-4 h-4" />
                            Attachment
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
