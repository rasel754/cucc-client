import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, ArrowRight, Filter } from "lucide-react";
import { useState } from "react";

const eventTypes = ["All", "Programming Contest", "Workshop", "Hackathon", "Seminar", "Bootcamp", "Selection Contest"];

const eventsData = [
  {
    id: 1,
    title: "CUCC Programming Contest 2026",
    type: "Programming Contest",
    date: "Feb 15, 2026",
    time: "10:00 AM - 4:00 PM",
    location: "Computer Lab 1",
    participants: 120,
    status: "upcoming",
    description: "Annual intra-university programming contest for all skill levels.",
    image: "🏆",
  },
  {
    id: 2,
    title: "Cyber Security Fundamentals Workshop",
    type: "Workshop",
    date: "Feb 20, 2026",
    time: "2:00 PM - 5:00 PM",
    location: "Seminar Hall",
    participants: 80,
    status: "registration",
    description: "Learn the basics of ethical hacking and network security.",
    image: "🛡️",
  },
  {
    id: 3,
    title: "AI/ML Bootcamp - 3 Day Intensive",
    type: "Bootcamp",
    date: "Feb 25-27, 2026",
    time: "9:00 AM - 5:00 PM",
    location: "Innovation Lab",
    participants: 50,
    status: "registration",
    description: "Hands-on bootcamp covering machine learning fundamentals to advanced topics.",
    image: "🤖",
  },
  {
    id: 4,
    title: "ICPC Team Selection Round",
    type: "Selection Contest",
    date: "Mar 5, 2026",
    time: "10:00 AM - 3:00 PM",
    location: "Computer Lab 2",
    participants: 45,
    status: "upcoming",
    description: "Selection contest for ICPC Dhaka Regional team formation.",
    image: "⚡",
  },
  {
    id: 5,
    title: "Web Development Seminar",
    type: "Seminar",
    date: "Mar 10, 2026",
    time: "3:00 PM - 5:00 PM",
    location: "Auditorium",
    participants: 200,
    status: "upcoming",
    description: "Latest trends in web development with industry experts.",
    image: "🌐",
  },
  {
    id: 6,
    title: "CodeStorm Hackathon 2026",
    type: "Hackathon",
    date: "Mar 20-21, 2026",
    time: "24 Hours",
    location: "Innovation Hub",
    participants: 100,
    status: "registration",
    description: "24-hour hackathon to build innovative solutions.",
    image: "💻",
  },
];

const statusConfig = {
  upcoming: { label: "Upcoming", class: "bg-primary/10 text-primary border-primary/20" },
  registration: { label: "Registration Open", class: "bg-accent/10 text-accent border-accent/20" },
  ongoing: { label: "Ongoing", class: "bg-cucc-gold/10 text-cucc-gold border-cucc-gold/20" },
  completed: { label: "Completed", class: "bg-muted text-muted-foreground border-muted" },
};

export default function EventsPage() {
  const [selectedType, setSelectedType] = useState("All");

  const filteredEvents = selectedType === "All" 
    ? eventsData 
    : eventsData.filter(e => e.type === selectedType);

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary via-secondary/95 to-primary/80 text-secondary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-6">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-semibold">Events</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Upcoming Events
            </h1>
            <p className="text-xl text-secondary-foreground/80">
              Join our workshops, contests, and seminars to level up your skills
            </p>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-6 bg-background border-b border-border sticky top-16 md:top-20 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            {eventTypes.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type)}
                className="flex-shrink-0"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden card-hover border-border/50 group">
                <div className="h-40 bg-gradient-to-br from-primary/10 to-muted flex items-center justify-center relative">
                  <span className="text-6xl">{event.image}</span>
                  <Badge 
                    variant="outline" 
                    className={`absolute top-4 right-4 ${statusConfig[event.status as keyof typeof statusConfig].class}`}
                  >
                    {statusConfig[event.status as keyof typeof statusConfig].label}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-3">{event.type}</Badge>
                  <h3 className="font-display text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      {event.time}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {event.participants}
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-background">
        <div className="container mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            Want to participate in our events?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Members get exclusive access to all events and competitions.
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
