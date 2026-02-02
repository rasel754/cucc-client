import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, ArrowRight } from "lucide-react";

const events = [
  {
    id: 1,
    title: "CUCC Programming Contest 2026",
    type: "Programming Contest",
    date: "Feb 15, 2026",
    time: "10:00 AM - 4:00 PM",
    location: "Computer Lab 1",
    participants: 120,
    status: "upcoming",
    image: "🏆",
  },
  {
    id: 2,
    title: "Cyber Security Workshop",
    type: "Workshop",
    date: "Feb 20, 2026",
    time: "2:00 PM - 5:00 PM",
    location: "Seminar Hall",
    participants: 80,
    status: "upcoming",
    image: "🛡️",
  },
  {
    id: 3,
    title: "AI/ML Bootcamp",
    type: "Bootcamp",
    date: "Feb 25-27, 2026",
    time: "9:00 AM - 5:00 PM",
    location: "Innovation Lab",
    participants: 50,
    status: "registration",
    image: "🤖",
  },
  {
    id: 4,
    title: "ICPC Selection Round",
    type: "Selection Contest",
    date: "Mar 5, 2026",
    time: "10:00 AM - 3:00 PM",
    location: "Computer Lab 2",
    participants: 45,
    status: "upcoming",
    image: "⚡",
  },
];

const statusColors = {
  upcoming: "bg-primary/10 text-primary border-primary/20",
  registration: "bg-accent/10 text-accent border-accent/20",
  ongoing: "bg-cucc-gold/10 text-cucc-gold border-cucc-gold/20",
  completed: "bg-muted text-muted-foreground border-muted",
};

const statusLabels = {
  upcoming: "Upcoming",
  registration: "Registration Open",
  ongoing: "Ongoing",
  completed: "Completed",
};

export function EventsSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Upcoming Events</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Join Our Events
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              From programming contests to workshops, we host events that help you 
              learn, compete, and connect with fellow tech enthusiasts.
            </p>
          </div>
          <Link to="/events" className="mt-6 md:mt-0">
            <Button variant="outline">
              View All Events
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden card-hover border-border/50 group">
              <CardContent className="p-0">
                <div className="flex">
                  {/* Left Icon Section */}
                  <div className="w-28 md:w-36 bg-gradient-to-br from-primary/10 to-muted flex items-center justify-center flex-shrink-0">
                    <span className="text-4xl md:text-5xl">{event.image}</span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${statusColors[event.status as keyof typeof statusColors]}`}
                      >
                        {statusLabels[event.status as keyof typeof statusLabels]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{event.type}</span>
                    </div>
                    
                    <h3 className="font-display font-bold text-lg text-foreground mb-3 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
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
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
