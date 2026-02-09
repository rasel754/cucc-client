import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import PageTitle from "@/components/common/PageTitle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User, Calendar, Trophy, FileText, Download, Award,
  Code2, Shield, Lightbulb, Clock, MapPin, Mail, Phone,
  GraduationCap, Droplet, Settings, LogOut
} from "lucide-react";
import { currentUser, certificates, userAchievements, userEvents, wingNames, events } from "@/data/mockData";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import { getImageUrl } from "@/lib/utils";

const wingIcons = {
  programming: Code2,
  cybersecurity: Shield,
  research: Lightbulb,
};

const wingColors = {
  programming: "text-primary",
  cybersecurity: "text-cucc-cyber",
  research: "text-cucc-gold",
};

export default function MemberDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Use auth user data if available, fallback to mock data
  const displayUser = user ? {
    name: user.name,
    memberId: `CUCC-${user.id?.slice(0, 8) || "001"}`,
    wing: user.clubWing?.toLowerCase().replace(" ", "") as "programming" | "cybersecurity" | "research" || "programming",
    batch: user.batch,
    joinDate: user.createdAt,
    studentId: user.studentId,
    department: "CSE",
    email: user.email,
    phone: user.phoneNumber,
    bloodGroup: user.bloodGroup,
    address: user.presentAddress,
    skills: user.skills || [],
    avatar: user.profilePhoto,
  } : currentUser;

  const WingIcon = wingIcons[displayUser.wing] || Code2;

  const upcomingEvents = events.filter(e => e.status === "upcoming");

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <Layout>
      <PageTitle title="Dashboard" />
      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <div className="bg-gradient-to-r from-secondary via-cucc-navy to-secondary py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-cucc-sky flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-xl overflow-hidden">
                {displayUser.avatar ? (
                  <img src={getImageUrl(displayUser.avatar)} alt={displayUser.name} className="w-full h-full object-cover" />
                ) : (
                  displayUser.name.split(" ").map(n => n[0]).join("")
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground">
                    {displayUser.name}
                  </h1>
                  <Badge className="bg-accent/20 text-accent border-accent/30">
                    Active Member
                  </Badge>
                </div>
                <p className="text-secondary-foreground/70 mb-3">
                  Member ID: {displayUser.memberId}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-foreground/60">
                  <span className="flex items-center gap-1">
                    <WingIcon className={`w-4 h-4 ${wingColors[displayUser.wing]}`} />
                    {wingNames[displayUser.wing]}
                  </span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    Batch {displayUser.batch}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(displayUser.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Link to="/member/settings">
                  <Button variant="outline" size="sm" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-destructive/30 text-destructive hover:bg-destructive/10"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 -mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-card border shadow-sm p-1 h-auto flex-wrap">
              <TabsTrigger value="overview" className="gap-2">
                <User className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="events" className="gap-2">
                <Calendar className="w-4 h-4" />
                Events
              </TabsTrigger>
              <TabsTrigger value="certificates" className="gap-2">
                <FileText className="w-4 h-4" />
                Certificates
              </TabsTrigger>
              <TabsTrigger value="achievements" className="gap-2">
                <Trophy className="w-4 h-4" />
                Achievements
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Events Joined", value: currentUser.eventsParticipated, icon: Calendar, color: "text-primary" },
                  { label: "Certificates", value: certificates.length, icon: FileText, color: "text-cucc-cyber" },
                  { label: "Achievements", value: userAchievements.length, icon: Trophy, color: "text-cucc-gold" },
                  { label: "Contests", value: 5, icon: Award, color: "text-purple-500" },
                ].map((stat) => (
                  <Card key={stat.label} className="border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </div>
                        <stat.icon className={`w-8 h-8 ${stat.color} opacity-50`} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Profile Info */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Student ID</p>
                        <p className="font-medium">{displayUser.studentId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Department</p>
                        <p className="font-medium">{user?.department || displayUser.department}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" /> Email
                        </p>
                        <p className="font-medium text-sm break-all">{displayUser.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" /> Phone
                        </p>
                        <p className="font-medium">{displayUser.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-3 h-3" /> WhatsApp
                        </p>
                        <p className="font-medium">{user?.whatsapp || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Droplet className="w-3 h-3" /> Blood Group
                        </p>
                        <p className="font-medium">{displayUser.bloodGroup}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date of Birth</p>
                        <p className="font-medium">{user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Gender</p>
                        <p className="font-medium capitalize">{user?.gender || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Religion</p>
                        <p className="font-medium">{user?.religion || "N/A"}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> Present Address
                        </p>
                        <p className="font-medium">{displayUser.address}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> Permanent Address
                        </p>
                        <p className="font-medium">{user?.permanentAddress || "N/A"}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" /> Emergency Contact
                        </p>
                        <p className="font-medium">{user?.emergencyContact || "N/A"}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {currentUser.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Events */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Upcoming Events
                    </CardTitle>
                    <CardDescription>Events you can join</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {upcomingEvents.slice(0, 3).map((event) => (
                      <div key={event.id} className="p-3 rounded-lg bg-muted/50 border border-border/50">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-medium text-sm">{event.title}</h4>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(event.date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {event.venue.split(",")[0]}
                              </span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="shrink-0">
                            Join
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Link to="/events">
                      <Button variant="ghost" className="w-full mt-2">
                        View All Events
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Certificates */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Recent Certificates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {certificates.slice(0, 3).map((cert) => (
                      <div key={cert.id} className="p-4 rounded-lg bg-muted/50 border border-border/50">
                        <div className="flex items-start justify-between">
                          <div>
                            <Badge variant="outline" className="mb-2 capitalize">
                              {cert.type}
                            </Badge>
                            <h4 className="font-medium">{cert.title}</h4>
                            <p className="text-sm text-muted-foreground">{cert.eventName}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(cert.issueDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Button size="icon" variant="ghost">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Event Participation History</CardTitle>
                  <CardDescription>All events you've participated in</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/50">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{event.title}</h4>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span>{new Date(event.date).toLocaleDateString()}</span>
                              <Badge variant="outline" className="capitalize">{event.type}</Badge>
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                          Completed
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Register for upcoming events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/50">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-cucc-cyber/10 flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-cucc-cyber" />
                          </div>
                          <div>
                            <h4 className="font-medium">{event.title}</h4>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span>{new Date(event.date).toLocaleDateString()}</span>
                              <span>{event.venue}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {event.participants}/{event.maxParticipants} registered
                            </p>
                          </div>
                        </div>
                        <Button>Register</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Certificates Tab */}
            <TabsContent value="certificates" className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>My Certificates</CardTitle>
                  <CardDescription>Download your earned certificates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {certificates.map((cert) => (
                      <div key={cert.id} className="p-6 rounded-xl bg-gradient-to-br from-muted/50 to-muted border border-border/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <Badge variant="outline" className="mb-4 capitalize">
                          {cert.type}
                        </Badge>
                        <h4 className="font-semibold text-lg mb-1">{cert.title}</h4>
                        <p className="text-muted-foreground">{cert.eventName}</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Issued: {new Date(cert.issueDate).toLocaleDateString()}
                        </p>
                        <Button className="w-full mt-4" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>My Achievements</CardTitle>
                  <CardDescription>Your accomplishments in CUCC</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userAchievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-border/50">
                        <div className="w-12 h-12 rounded-lg bg-cucc-gold/10 flex items-center justify-center shrink-0">
                          <Trophy className="w-6 h-6 text-cucc-gold" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{achievement.title}</h4>
                            {achievement.position && (
                              <Badge className="bg-cucc-gold/10 text-cucc-gold border-cucc-gold/20">
                                {achievement.position} Place
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground mt-1">{achievement.description}</p>
                          <p className="text-sm text-muted-foreground mt-2">
                            {new Date(achievement.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
