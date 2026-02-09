import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import PageTitle from "@/components/common/PageTitle";
import { apiService, Event } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Search, Users, Filter, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EventsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("upcoming"); // Default to upcoming

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getEvents();
        if (response.success && response.data) {
          setEvents(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
        toast({
          title: "Error",
          description: "Failed to load events. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  const getEventStatus = (event: Event) => {
    const now = new Date();
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);

    if (now > end) return "completed";
    if (now >= start && now <= end) return "ongoing";
    return "upcoming";
  };

  const filteredEvents = events.filter((event) => {
    const status = getEventStatus(event);
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || event.eventType === typeFilter;
    const matchesStatus = statusFilter === "all" || status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleJoinEvent = async (eventId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to join events.",
        variant: "destructive",
      });
      return;
    }
    // TODO: Implement join logic
    toast({
      title: "Coming Soon",
      description: "Event registration will be available soon!",
    });
  };

  const statusColors = {
    upcoming: "bg-primary/10 text-primary border-primary/20",
    ongoing: "bg-green-500/10 text-green-600 border-green-500/20",
    completed: "bg-muted text-muted-foreground border-muted",
  };

  return (
    <Layout>
      <PageTitle title="Events" />
      <div className="bg-muted/30 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Club Events</h1>
              <p className="text-muted-foreground">Discover and participate in our latest activities</p>
            </div>
            {user && (
              <Badge variant="outline" className="text-sm px-3 py-1">
                {user.name}
              </Badge>
            )}
          </div>

          {/* Filters */}
          <Card className="mb-8 border-border/50">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0">
                  <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full md:w-auto">
                    <TabsList>
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                      <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                      <TabsTrigger value="completed">Past</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[150px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Contest">Contest</SelectItem>
                      <SelectItem value="Workshop">Workshop</SelectItem>
                      <SelectItem value="Seminar">Seminar</SelectItem>
                      <SelectItem value="Hackathon">Hackathon</SelectItem>
                      <SelectItem value="Bootcamp">Bootcamp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Events Grid */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium">No events found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => {
                const status = getEventStatus(event);
                const isParticipating = user && event.participants.includes(user.id);

                return (
                  <Card key={event._id} className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
                    <div className="h-48 bg-muted relative overflow-hidden group">
                      {event.coverImage?.url ? (
                        <img
                          src={event.coverImage.url}
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/5">
                          <Calendar className="w-12 h-12 text-primary/20" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <Badge className={`capitalize ${statusColors[status as keyof typeof statusColors]}`}>
                          {status}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-2">
                        <Badge variant="outline" className="mb-2">{event.eventType}</Badge>
                        {event.visibility === "MemberOnly" && (
                          <Badge variant="secondary" className="text-xs">Members Only</Badge>
                        )}
                      </div>
                      <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {event.venue}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1 pb-3">
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {event.description}
                      </p>

                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>
                            {new Date(event.startTime).toLocaleDateString()} • {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary" />
                          <span>{event.participants.length} / {event.maxParticipants} registered</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-0">
                      <Button
                        className="w-full"
                        variant={status === "completed" ? "outline" : "default"}
                        disabled={status === "completed" || isParticipating}
                        onClick={() => handleJoinEvent(event._id)}
                      >
                        {status === "completed" ? "Event Ended" : isParticipating ? "Registered" : "Join Event"}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
