import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, Calendar, FileText, Trophy, Settings, BarChart3,
  Search, Filter, Check, X, Eye, Edit, Trash2, Plus,
  TrendingUp, UserPlus, Bell, Download, Upload
} from "lucide-react";
import { 
  members, events, notices, dashboardStats, 
  wingNames, roleNames, statusColors, eventTypeColors 
} from "@/data/mockData";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [memberFilter, setMemberFilter] = useState({ batch: "all", wing: "all", status: "all" });
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const filteredMembers = members.filter((member) => {
    const matchesBatch = memberFilter.batch === "all" || member.batch === memberFilter.batch;
    const matchesWing = memberFilter.wing === "all" || member.wing === memberFilter.wing;
    const matchesStatus = memberFilter.status === "all" || member.status === memberFilter.status;
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBatch && matchesWing && matchesStatus && matchesSearch;
  });

  const pendingMembers = members.filter(m => m.status === "pending");

  const handleApprove = (memberId: string) => {
    toast({
      title: "Member Approved",
      description: "Member has been approved successfully.",
    });
  };

  const handleReject = (memberId: string) => {
    toast({
      title: "Member Rejected",
      description: "Member application has been rejected.",
      variant: "destructive",
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <div className="bg-gradient-to-r from-secondary via-cucc-navy to-secondary py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground">
                  Admin Dashboard
                </h1>
                <p className="text-secondary-foreground/70">
                  Manage members, events, and club activities
                </p>
              </div>
              <div className="flex gap-3">
                <Link to="/admin/settings">
                  <Button variant="outline" size="sm" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-card border shadow-sm p-1 h-auto flex-wrap">
              <TabsTrigger value="overview" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="members" className="gap-2">
                <Users className="w-4 h-4" />
                Members
                {pendingMembers.length > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {pendingMembers.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="events" className="gap-2">
                <Calendar className="w-4 h-4" />
                Events
              </TabsTrigger>
              <TabsTrigger value="notices" className="gap-2">
                <Bell className="w-4 h-4" />
                Notices
              </TabsTrigger>
              <TabsTrigger value="certificates" className="gap-2">
                <FileText className="w-4 h-4" />
                Certificates
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Members", value: dashboardStats.totalMembers, icon: Users, color: "text-primary", trend: `+${dashboardStats.monthlyGrowth}%` },
                  { label: "Pending Approvals", value: dashboardStats.pendingApprovals, icon: UserPlus, color: "text-yellow-500" },
                  { label: "Active Events", value: dashboardStats.activeEvents, icon: Calendar, color: "text-cucc-cyber" },
                  { label: "Total Events", value: dashboardStats.totalEvents, icon: Trophy, color: "text-cucc-gold" },
                ].map((stat) => (
                  <Card key={stat.label} className="border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                          {stat.trend && (
                            <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                              <TrendingUp className="w-3 h-3" />
                              {stat.trend} this month
                            </p>
                          )}
                        </div>
                        <stat.icon className={`w-8 h-8 ${stat.color} opacity-50`} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Pending Approvals */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserPlus className="w-5 h-5 text-yellow-500" />
                      Pending Approvals
                    </CardTitle>
                    <CardDescription>Members waiting for approval</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {pendingMembers.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No pending approvals</p>
                    ) : (
                      pendingMembers.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                              {member.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{member.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Batch {member.batch} • {wingNames[member.wing]}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-500/10" onClick={() => handleApprove(member.id)}>
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => handleReject(member.id)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Recent Events */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Recent Events
                    </CardTitle>
                    <CardDescription>Latest club events</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {events.slice(0, 4).map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
                        <div>
                          <p className="font-medium text-sm">{event.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className={`text-xs capitalize ${eventTypeColors[event.type]}`}>
                              {event.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Badge variant={event.status === "completed" ? "secondary" : event.status === "upcoming" ? "default" : "outline"} className="capitalize">
                          {event.status}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Members by Wing */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Members by Wing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(wingNames).map(([key, name]) => {
                      const count = members.filter(m => m.wing === key && m.status === "approved").length;
                      return (
                        <div key={key} className="p-4 rounded-lg bg-muted/50 border border-border/50 text-center">
                          <p className="text-3xl font-bold">{count}</p>
                          <p className="text-sm text-muted-foreground">{name}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members" className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Member Management</CardTitle>
                      <CardDescription>View and manage all club members</CardDescription>
                    </div>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Member
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Filters */}
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search by name, email, or student ID..." 
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={memberFilter.batch} onValueChange={(v) => setMemberFilter(f => ({ ...f, batch: v }))}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Batch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Batches</SelectItem>
                        <SelectItem value="59">Batch 59</SelectItem>
                        <SelectItem value="60">Batch 60</SelectItem>
                        <SelectItem value="61">Batch 61</SelectItem>
                        <SelectItem value="62">Batch 62</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={memberFilter.wing} onValueChange={(v) => setMemberFilter(f => ({ ...f, wing: v }))}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Wing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Wings</SelectItem>
                        <SelectItem value="programming">Programming Club</SelectItem>
                        <SelectItem value="cybersecurity">Cyber Security</SelectItem>
                        <SelectItem value="research">R&D Club</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={memberFilter.status} onValueChange={(v) => setMemberFilter(f => ({ ...f, status: v }))}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Members Table */}
                  <div className="rounded-lg border border-border/50 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left p-4 font-medium text-sm">Member</th>
                            <th className="text-left p-4 font-medium text-sm">Batch</th>
                            <th className="text-left p-4 font-medium text-sm">Wing</th>
                            <th className="text-left p-4 font-medium text-sm">Events</th>
                            <th className="text-left p-4 font-medium text-sm">Role</th>
                            <th className="text-left p-4 font-medium text-sm">Status</th>
                            <th className="text-left p-4 font-medium text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredMembers.map((member) => (
                            <tr key={member.id} className="border-t border-border/50 hover:bg-muted/30">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                                    {member.name.split(" ").map(n => n[0]).join("")}
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">{member.name}</p>
                                    <p className="text-xs text-muted-foreground">{member.studentId}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-sm">{member.batch}</td>
                              <td className="p-4 text-sm">{wingNames[member.wing]}</td>
                              <td className="p-4 text-sm">{member.eventsParticipated}</td>
                              <td className="p-4">
                                <Badge variant="outline" className="capitalize">{roleNames[member.role]}</Badge>
                              </td>
                              <td className="p-4">
                                <Badge className={`capitalize ${statusColors[member.status]}`}>
                                  {member.status}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-1">
                                  <Button size="icon" variant="ghost" className="h-8 w-8">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button size="icon" variant="ghost" className="h-8 w-8">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  {member.status === "pending" && (
                                    <>
                                      <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500" onClick={() => handleApprove(member.id)}>
                                        <Check className="w-4 h-4" />
                                      </Button>
                                      <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500" onClick={() => handleReject(member.id)}>
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Event Management</CardTitle>
                      <CardDescription>Create and manage club events</CardDescription>
                    </div>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Event
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/50 gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Calendar className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{event.title}</h4>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <Badge variant="outline" className={`capitalize ${eventTypeColors[event.type]}`}>
                                {event.type}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Date(event.date).toLocaleDateString()}
                              </span>
                              <span className="text-sm text-muted-foreground">•</span>
                              <span className="text-sm text-muted-foreground">{event.venue}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {event.participants}/{event.maxParticipants} participants
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-16 md:ml-0">
                          <Badge variant={event.status === "completed" ? "secondary" : event.status === "upcoming" ? "default" : "outline"} className="capitalize">
                            {event.status}
                          </Badge>
                          <Button size="icon" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notices Tab */}
            <TabsContent value="notices" className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Notice Management</CardTitle>
                      <CardDescription>Create and manage notices</CardDescription>
                    </div>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Notice
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notices.map((notice) => (
                      <div key={notice.id} className="p-4 rounded-lg bg-muted/50 border border-border/50">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="capitalize">{notice.category}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Date(notice.publishDate).toLocaleDateString()}
                              </span>
                            </div>
                            <h4 className="font-medium">{notice.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notice.content}</p>
                            <p className="text-xs text-muted-foreground mt-2">By {notice.author}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="icon" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
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
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Certificate Management</CardTitle>
                      <CardDescription>Upload and manage certificates for members</CardDescription>
                    </div>
                    <Button>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Certificates
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.filter(e => e.status === "completed").map((event) => (
                      <div key={event.id} className="p-4 rounded-lg bg-muted/50 border border-border/50">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{event.title}</h4>
                            <p className="text-xs text-muted-foreground">{event.participants} participants</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Upload className="w-4 h-4 mr-1" />
                            Upload
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Download className="w-4 h-4 mr-1" />
                            Export
                          </Button>
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
