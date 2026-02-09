import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import PageTitle from "@/components/common/PageTitle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search, Check, X, Eye, Edit, Trash2, Plus, Image,
  TrendingUp, UserPlus, Bell, LogOut, GraduationCap, MoreHorizontal, Shield,
  Calendar, BarChart3, Users, FileText, Trophy
} from "lucide-react";
import { useEffect } from "react";
import {
  members as mockMembers, events, notices, dashboardStats,
  wingNames, roleNames, statusColors, eventTypeColors,
  Member
} from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiService, User as ApiUser, Event as ApiEvent, Notice, Alumni, ExecutiveMember, Gallery, Advisor } from "@/lib/api";
import { AddMemberForm } from "@/components/admin/AddMemberForm";
import { CreateEventForm } from "@/components/admin/CreateEventForm";
import { NoticeForm } from "@/components/admin/NoticeForm";
import { AlumniForm } from "@/components/admin/AlumniForm";
import { ExecutiveBodyForm } from "@/components/admin/ExecutiveBodyForm";
import { GalleryForm } from "@/components/admin/GalleryForm";
import { AdvisorForm } from "@/components/admin/AdvisorForm";
import { MemberDetailsDialog } from "@/components/admin/MemberDetailsDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getImageUrl } from "@/lib/utils";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [memberFilter, setMemberFilter] = useState({ batch: "all", wing: "all", status: "all" });
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [showCreateEventForm, setShowCreateEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ApiEvent | null>(null);
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [showAlumniForm, setShowAlumniForm] = useState(false);
  const [showExecutiveForm, setShowExecutiveForm] = useState(false);
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [editingExecutive, setEditingExecutive] = useState<ExecutiveMember | null>(null);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);

  // Member Details State
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [showMemberDetails, setShowMemberDetails] = useState(false);

  // Confirmation State
  const [confirmationAction, setConfirmationAction] = useState<{ type: "approve" | "reject" | "make_admin" | "delete" | "restore" | "delete_event" | "delete_notice" | "approve_alumni" | "reject_alumni" | "delete_executive" | "delete_gallery" | "delete_advisor", id: string, name: string } | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const [members, setMembers] = useState<Member[]>([]);
  const [realEvents, setRealEvents] = useState<ApiEvent[]>([]);
  const [realNotices, setRealNotices] = useState<Notice[]>([]); // Added Notice state
  const [alumniList, setAlumniList] = useState<Alumni[]>([]); // Added Alumni state
  const [executiveMembers, setExecutiveMembers] = useState<ExecutiveMember[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Advisor States
  const [showAdvisorForm, setShowAdvisorForm] = useState(false);
  const [editingAdvisor, setEditingAdvisor] = useState<Advisor | null>(null);

  const fetchEvents = async () => {
    try {
      const response = await apiService.getAllEvents();
      if (response.success && response.data) {
        setRealEvents(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  const fetchNotices = async () => {
    try {
      const response = await apiService.getAllNotices();
      if (response.success && response.data) {
        setRealNotices(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch notices:", error);
    }
  };

  const fetchAlumni = async () => {
    try {
      // Fetch both approved (public) and pending (admin-only)
      // Since we want to show ALL status in admin dashboard.
      // If backend has a 'getAll' we use that. If not, we merge.
      // The implementation plan suggested getAlumni and getPendingAlumni.
      // Ideally getAlumni(status='all') would be best if supported.
      // If getAlumni() only returns approved, we need to fetch pending separately and merge.

      const [publicRes, pendingRes] = await Promise.all([
        apiService.getAlumni(),
        apiService.getPendingAlumni().catch(() => ({ success: false, data: [] }))
      ]);

      let allAlumni: Alumni[] = [];
      if (publicRes.success && publicRes.data) {
        allAlumni = [...publicRes.data];
      }
      if (pendingRes.success && pendingRes.data) {
        // Avoid duplicates if any overlap
        const existingIds = new Set(allAlumni.map(a => a.id || a._id));
        const newPending = (pendingRes.data as Alumni[]).filter(a => !existingIds.has(a.id || a._id));
        allAlumni = [...allAlumni, ...newPending];
      }

      setAlumniList(allAlumni);
    } catch (error) {
      console.error("Failed to fetch alumni:", error);
    }
  };

  const fetchExecutives = async () => {
    try {
      const response = await apiService.getExecutiveBody();
      if (response.success && response.data) {
        setExecutiveMembers(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch executive members:", error);
    }
  };

  const fetchGalleries = async () => {
    try {
      const response = await apiService.getAllGalleries();
      if (response.success && response.data) {
        setGalleries(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch galleries:", error);
    }
  };

  const fetchAdvisors = async () => {
    try {
      const response = await apiService.getAllAdvisors();
      if (response.success && response.data) {
        setAdvisors(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch advisors:", error);
    }
  };

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getAllMembers();
      if (response.success && response.data) {
        // Map API User to UI Member
        const mappedMembers: Member[] = response.data.map((user: ApiUser) => {
          const backendStatus = user.approvalStatus?.trim().toUpperCase(); // Ensure trimming
          const uiStatus =
            backendStatus === "APPROVED" ? "approved" :
              backendStatus === "REJECTED" ? "rejected" :
                "pending";

          /* Debug logs removed */

          return {
            id: user.id || user._id, // ID PRECEDENCE FIX: Prioritize id (Custom ID) over _id to match backend expectations
            memberId: user.studentId, // Fallback
            name: user.name,
            email: user.email,
            phone: user.phoneNumber,
            studentId: user.studentId,
            batch: user.batch,
            department: "CSE", // Default or derive if available
            wing: mapWing(user.clubWing),
            role: user.role === "user" ? "member" : "admin",
            status: uiStatus,
            joinDate: user.createdAt,
            eventsParticipated: 0, // Not in API yet
            skills: user.skills || [],
            bloodGroup: user.bloodGroup,
            address: user.presentAddress,
            avatar: user.profilePhoto,
            isDeleted: user.isDeleted
          };
        });

        setMembers(mappedMembers);
      }
    } catch (error: any) {
      console.error("Failed to fetch members:", error);

      // Check for auth error (401)
      if (error.message?.includes("Unauthorized") || error.message?.includes("401") || error.message?.includes("jwt expired")) {
        toast({
          title: "Authentication Issue",
          description: "Could not fetch real data (401 Unauthorized). Showing mock data instead.",
          variant: "destructive",
        });
        // Fallback to mock data instead of logging out
        setMembers(mockMembers);
        return;
      }

      toast({
        title: "Error",
        description: "Failed to fetch members. Showing mock data.",
        variant: "destructive",
      });
      setMembers(mockMembers); // Fallback to mock data on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchEvents();
    fetchNotices();
    fetchAlumni(); // Fetch alumni on load
    fetchExecutives();
    fetchGalleries();
    fetchAdvisors();
  }, []);

  const mapWing = (wing: string): "programming" | "cybersecurity" | "research" => {
    switch (wing) {
      case "Programming": return "programming";
      case "Cyber Security": return "cybersecurity";
      case "Research & Development":
      case "R&D": return "research";
      default: return "programming"; // Default fallback
    }
  };

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

  const handleConfirmAction = async () => {
    if (!confirmationAction) return;

    setIsProcessingAction(true);
    const { id, type } = confirmationAction;
    const isApprovalAction = type === "approve" || type === "reject";
    const status = type === "approve" ? "APPROVED" : "REJECTED";
    const uiStatus = type === "approve" ? "approved" : "rejected";

    try {
      // Optimistic Update
      if (isApprovalAction) {
        setMembers(prev => prev.map(m =>
          m.id === id ? { ...m, status: uiStatus } : m
        ));
        const response = await apiService.updateMemberStatus(id, status);
        if (response.success) {
          toast({
            title: `Member ${type === "approve" ? "Approved" : "Rejected"}`,
            description: `Member has been ${type}d successfully.`,
            variant: type === "reject" ? "destructive" : "default",
          });
          fetchMembers(); // Refresh list to confirm
        } else {
          fetchMembers(); // Revert
        }
      } else if (type === "make_admin") {
        const response = await apiService.updateMemberRole(id, "admin");
        if (response.success) {
          toast({
            title: "Member Promoted",
            description: "Successfully promoted member to admin.",
          });
          fetchMembers();
        }
      } else if (type === "delete" || type === "restore") {
        const isDeleted = type === "delete";
        const response = await apiService.deleteMember(id, isDeleted);
        if (response.success) {
          toast({
            title: `Member ${isDeleted ? "Deleted" : "Restored"}`,
            description: `Successfully ${isDeleted ? "deleted" : "restored"} member.`,
          });
          fetchMembers();
        }
      } else if (type === "delete_event") {
        const response = await apiService.deleteEvent(id);
        if (response.success) {
          toast({
            title: "Event Deleted",
            description: "Event has been deleted successfully.",
          });
          fetchEvents();
        }
      } else if (type === "delete_notice") {
        const response = await apiService.deleteNotice(id);
        if (response.success) {
          toast({
            title: "Notice Deleted",
            description: "Notice has been deleted successfully.",
          });
          fetchNotices();
        }
      } else if (type === "approve_alumni") {
        const response = await apiService.approveAlumni(id);
        if (response.success) {
          toast({
            title: "Alumni Approved",
            description: "Alumni has been approved successfully.",
          });
          fetchAlumni();
        }
      } else if (type === "reject_alumni") {
        const response = await apiService.rejectAlumni(id);
        if (response.success) {
          toast({
            title: "Alumni Rejected",
            description: "Alumni has been rejected.",
            variant: "destructive",
          });
          fetchAlumni();
        }
      } else if (type === "delete_executive") {
        const response = await apiService.deleteExecutiveBodyMember(id);
        if (response.success) {
          toast({
            title: "Executive Removed",
            description: "Executive member has been removed successfully.",
          });
        }
        fetchExecutives();
      } else if (type === "delete_gallery") {
        const response = await apiService.deleteGallery(id);
        if (response.success) {
          toast({
            title: "Gallery Deleted",
            description: "Gallery has been deleted successfully.",
          });
          fetchGalleries();
        }
      } else if (type === "delete_advisor") {
        const response = await apiService.deleteAdvisor(id);
        if (response.success) {
          toast({
            title: "Advisor Removed",
            description: "Advisor has been removed successfully.",
          });
          fetchAdvisors();
        }
      }
    } catch (error: any) {
      const isAlumniAction = type?.includes("alumni");
      if (isAlumniAction) fetchAlumni(); else fetchMembers(); // Revert appropriate list

      toast({
        title: "Error",
        description: error.message || `Failed to ${type} member`,
        variant: "destructive",
      });
    } finally {
      setIsProcessingAction(false);
      setConfirmationAction(null);
    }
  };

  const handleEditEvent = (event: ApiEvent) => {
    setEditingEvent(event);
    setShowCreateEventForm(true);
  };

  const requestApprove = (member: Member) => {
    setConfirmationAction({ type: "approve", id: member.id, name: member.name });
  };

  const requestReject = (member: Member) => {
    setConfirmationAction({ type: "reject", id: member.id, name: member.name });
  };


  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleEditNotice = (notice: Notice) => {
    setEditingNotice(notice);
    setShowNoticeForm(true);
  };

  const handleCreateNotice = () => {
    setEditingNotice(null);
    setShowNoticeForm(true);
  };

  return (
    <Layout>
      <PageTitle title="Admin Dashboard" />
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
                  Welcome, {user?.name || "Admin"} • Manage members, events, and club activities
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
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
              <TabsTrigger value="alumni" className="gap-2">
                <GraduationCap className="w-4 h-4" />
                Alumni
              </TabsTrigger>
              <TabsTrigger value="executive" className="gap-2">
                <Shield className="w-4 h-4" />
                Executive Body
              </TabsTrigger>
              <TabsTrigger value="advisors" className="gap-2">
                <UserPlus className="w-4 h-4" />
                Advisors
              </TabsTrigger>
              <TabsTrigger value="certificates" className="gap-2">
                <FileText className="w-4 h-4" />
                Certificates
              </TabsTrigger>
              <TabsTrigger value="gallery" className="gap-2">
                <Image className="w-4 h-4" />
                Gallery
              </TabsTrigger>
            </TabsList>

            {/* Advisors Tab */}
            <TabsContent value="advisors" className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Advisor Management</CardTitle>
                      <CardDescription>Manage faculty advisors</CardDescription>
                    </div>
                    <Button onClick={() => {
                      setEditingAdvisor(null);
                      setShowAdvisorForm(true);
                    }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Advisor
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-border/50 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left p-4 font-medium text-sm">Advisor</th>
                            <th className="text-left p-4 font-medium text-sm">Role</th>
                            <th className="text-left p-4 font-medium text-sm">Department</th>
                            <th className="text-left p-4 font-medium text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {advisors.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                No advisors found. Add one to get started.
                              </td>
                            </tr>
                          ) : (
                            advisors.map((advisor) => (
                              <tr key={advisor._id} className="border-t border-border/50 hover:bg-muted/30">
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                      {advisor.profileImage?.url ? (
                                        <img src={getImageUrl(advisor.profileImage.url)} alt={advisor.name} className="w-full h-full object-cover" />
                                      ) : (
                                        <span className="text-sm font-medium">{advisor.name.split(" ").map(n => n[0]).join("")}</span>
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-medium text-sm">{advisor.name}</p>
                                      <p className="text-xs text-muted-foreground">{advisor.email}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <Badge variant="outline" className="capitalize">{advisor.role}</Badge>
                                </td>
                                <td className="p-4 text-sm">{advisor.department}</td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8"
                                      onClick={() => {
                                        setEditingAdvisor(advisor);
                                        setShowAdvisorForm(true);
                                      }}
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8 text-destructive"
                                      onClick={() => setConfirmationAction({ type: "delete_advisor", id: advisor._id, name: advisor.name })}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Executive Body Tab */}
            <TabsContent value="executive" className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Executive Body Management</CardTitle>
                      <CardDescription>Manage the current executive committee members</CardDescription>
                    </div>
                    <Button onClick={() => {
                      setEditingExecutive(null);
                      setShowExecutiveForm(true);
                    }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Executive Member
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-border/50 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left p-4 font-medium text-sm">Member</th>
                            <th className="text-left p-4 font-medium text-sm">Role</th>
                            <th className="text-left p-4 font-medium text-sm">Department</th>
                            <th className="text-left p-4 font-medium text-sm">Batch</th>
                            <th className="text-left p-4 font-medium text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {executiveMembers.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                No executive members found. Add one to get started.
                              </td>
                            </tr>
                          ) : (
                            executiveMembers.map((exec) => (
                              <tr key={exec.id || exec._id} className="border-t border-border/50 hover:bg-muted/30">
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                      {exec.profilePhoto ? (
                                        <img src={getImageUrl(exec.profilePhoto)} alt={exec.name} className="w-full h-full object-cover" />
                                      ) : (
                                        <span className="text-sm font-medium">{exec.name.split(" ").map(n => n[0]).join("")}</span>
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-medium text-sm">{exec.name}</p>
                                      <p className="text-xs text-muted-foreground">{exec.email}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <Badge variant="outline" className="capitalize">{exec.role}</Badge>
                                </td>
                                <td className="p-4 text-sm">{exec.department || "-"}</td>
                                <td className="p-4 text-sm">{exec.batch || "-"}</td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8"
                                      onClick={() => {
                                        setEditingExecutive(exec);
                                        setShowExecutiveForm(true);
                                      }}
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8 text-destructive"
                                      onClick={() => setConfirmationAction({ type: "delete_executive", id: exec.id || exec._id || "", name: exec.name })}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Members", value: members.length, icon: Users, color: "text-primary", trend: `+${dashboardStats.monthlyGrowth}%` },
                  { label: "Pending Approvals", value: pendingMembers.length, icon: UserPlus, color: "text-accent" },
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
                            <p className="text-xs text-accent flex items-center gap-1 mt-1">
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
                      <UserPlus className="w-5 h-5 text-accent" />
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
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                              {member.avatar ? (
                                <img src={getImageUrl(member.avatar)} alt={member.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-sm font-medium">{member.name.split(" ").map(n => n[0]).join("")}</span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{member.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Batch {member.batch} • {wingNames[member.wing]}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-accent hover:text-accent hover:bg-accent/10" onClick={() => requestApprove(member)}>
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => requestReject(member)}>
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
                    {realEvents.slice(0, 4).map((event) => (
                      <div key={event._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
                        <div>
                          <p className="font-medium text-sm">{event.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className={`text-xs capitalize ${eventTypeColors[event.eventType] || ''}`}>
                              {event.eventType}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(event.startTime).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Badge variant={new Date(event.endTime) < new Date() ? "secondary" : "default"} className="capitalize">
                          {new Date(event.endTime) < new Date() ? "Completed" : "Upcoming"}
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
                    <Button onClick={() => setShowAddMemberForm(true)}>
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
                        <SelectItem value="research">Research & Development Club</SelectItem>
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
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                    {member.avatar ? (
                                      <img src={getImageUrl(member.avatar)} alt={member.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="text-xs font-medium">{member.name.split(" ").map(n => n[0]).join("")}</span>
                                    )}
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
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8"
                                    onClick={() => {
                                      setSelectedMemberId(member.id);
                                      setShowMemberDetails(true);
                                    }}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>

                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button size="icon" variant="ghost" className="h-8 w-8">
                                        <MoreHorizontal className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuItem onClick={() => {
                                        setSelectedMemberId(member.id);
                                        setShowMemberDetails(true);
                                      }}>
                                        View Details
                                      </DropdownMenuItem>
                                      {member.role !== "admin" && (
                                        <DropdownMenuItem onClick={() => setConfirmationAction({ type: "make_admin", id: member.id, name: member.name })}>
                                          <Shield className="w-4 h-4 mr-2" />
                                          Make Admin
                                        </DropdownMenuItem>
                                      )}
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        className={member.isDeleted ? "text-green-600 focus:text-green-600" : "text-destructive focus:text-destructive"}
                                        onClick={() => setConfirmationAction({ type: member.isDeleted ? "restore" : "delete", id: member.id, name: member.name })}
                                      >
                                        {member.isDeleted ? <Check className="w-4 h-4 mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                                        {member.isDeleted ? "Restore User" : "Delete User"}
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>

                                  {member.status === "pending" && (
                                    <>
                                      <Button size="icon" variant="ghost" className="h-8 w-8 text-accent" onClick={() => requestApprove(member)}>
                                        <Check className="w-4 h-4" />
                                      </Button>
                                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => requestReject(member)}>
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
                    <Button onClick={() => setShowCreateEventForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Event
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {realEvents.map((event) => (
                      <div key={event._id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/50">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium">{event.title}</h3>
                            <Badge variant="outline" className={`text-xs capitalize ${eventTypeColors[event.eventType] || ''}`}>
                              {event.eventType}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>{new Date(event.startTime).toLocaleDateString()}</span>
                            <span>{event.venue}</span>
                            <span>{event.participants.length}/{event.maxParticipants} participants</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={new Date(event.endTime) < new Date() ? "secondary" : "default"} className="capitalize">
                            {new Date(event.endTime) < new Date() ? "Completed" : "Upcoming"}
                          </Badge>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleEditEvent(event)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive"
                            onClick={() => setConfirmationAction({ type: "delete_event", id: event._id, name: event.title })}
                          >
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
                      <CardDescription>Create and manage notices for members</CardDescription>
                    </div>
                    <Button onClick={handleCreateNotice}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Notice
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {realNotices.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No notices found.</p>
                    ) : (
                      realNotices.map((notice) => (
                        <div key={notice.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/50">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-medium">{notice.title}</h3>
                              <Badge variant="outline" className="capitalize">{notice.category}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                              {notice.content}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>By {notice.author}</span>
                              <span>{notice.date}</span>
                              {notice.hasAttachment && (
                                <span className="text-primary flex items-center gap-1">
                                  Attachment <Check className="w-3 h-3" />
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEditNotice(notice)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive"
                              onClick={() => setConfirmationAction({ type: "delete_notice", id: notice.id, name: notice.title })}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Alumni Tab */}
            <TabsContent value="alumni" className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Alumni Management</CardTitle>
                      <CardDescription>Manage alumni network and registrations</CardDescription>
                    </div>
                    <Button onClick={() => setShowAlumniForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Alumni
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alumniList.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No alumni found.</p>
                    ) : (
                      <div className="rounded-lg border border-border/50 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="text-left p-4 font-medium text-sm">Alumni</th>
                                <th className="text-left p-4 font-medium text-sm">Batch</th>
                                <th className="text-left p-4 font-medium text-sm">Company/Role</th>
                                <th className="text-left p-4 font-medium text-sm">Location</th>
                                <th className="text-left p-4 font-medium text-sm">Status</th>
                                <th className="text-left p-4 font-medium text-sm">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {alumniList.map((a) => (
                                <tr key={a.id || a._id} className="border-t border-border/50 hover:bg-muted/30">
                                  <td className="p-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                        {a.profilePhoto ? (
                                          <img src={getImageUrl(a.profilePhoto)} alt={a.name} className="w-full h-full object-cover" />
                                        ) : (
                                          <span className="text-xs font-medium">{a.name.split(" ").map(n => n[0]).join("")}</span>
                                        )}
                                      </div>
                                      <div>
                                        <p className="font-medium text-sm">{a.name}</p>
                                        <p className="text-xs text-muted-foreground">{a.email}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-4 text-sm">{a.batch}</td>
                                  <td className="p-4 text-sm">
                                    <div className="flex flex-col">
                                      <span className="font-medium">{a.company}</span>
                                      <span className="text-xs text-muted-foreground">{a.jobRole}</span>
                                    </div>
                                  </td>
                                  <td className="p-4 text-sm">{a.country}</td>
                                  <td className="p-4">
                                    <Badge
                                      className={`capitalize ${a.status === "APPROVED" ? "bg-green-500/15 text-green-700 hover:bg-green-500/25 border-green-500/20" :
                                        a.status === "REJECTED" ? "bg-red-500/15 text-red-700 hover:bg-red-500/25 border-red-500/20" :
                                          "bg-yellow-500/15 text-yellow-700 hover:bg-yellow-500/25 border-yellow-500/20"
                                        }`}
                                      variant="outline"
                                    >
                                      {a.status}
                                    </Badge>
                                  </td>
                                  <td className="p-4">
                                    <div className="flex items-center gap-2">
                                      {a.status === "PENDING" && (
                                        <>
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                            onClick={() => setConfirmationAction({ type: "approve_alumni", id: a.id || a._id, name: a.name })}
                                          >
                                            <Check className="w-4 h-4" />
                                          </Button>
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => setConfirmationAction({ type: "reject_alumni", id: a.id || a._id, name: a.name })}
                                          >
                                            <X className="w-4 h-4" />
                                          </Button>
                                        </>
                                      )}
                                      {(a.status === "APPROVED" || a.status === "REJECTED") && (
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="h-8 w-8 text-destructive"
                                          onClick={() => setConfirmationAction({ type: "reject_alumni", id: a.id || a._id, name: a.name })}
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery" className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Gallery Management</CardTitle>
                      <CardDescription>Manage photo galleries and albums</CardDescription>
                    </div>
                    <Button onClick={() => {
                      setEditingGallery(null);
                      setShowGalleryForm(true);
                    }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Gallery
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-border/50 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left p-4 font-medium text-sm">Image</th>
                            <th className="text-left p-4 font-medium text-sm">Title</th>
                            <th className="text-left p-4 font-medium text-sm">Date</th>
                            <th className="text-left p-4 font-medium text-sm">Category</th>
                            <th className="text-left p-4 font-medium text-sm">Images</th>
                            <th className="text-left p-4 font-medium text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {galleries.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                No galleries found. Create one to get started.
                              </td>
                            </tr>
                          ) : (
                            galleries.map((gallery) => (
                              <tr key={gallery._id} className="border-t border-border/50 hover:bg-muted/30">
                                <td className="p-4">
                                  <div className="w-16 h-10 rounded overflow-hidden bg-muted/30">
                                    {gallery.images && gallery.images.length > 0 ? (
                                      <img
                                        src={getImageUrl(gallery.images[0].url)}
                                        alt={gallery.title}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                        <Image className="w-4 h-4 opacity-20" />
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="p-4 font-medium text-sm">{gallery.title}</td>
                                <td className="p-4 text-sm">{new Date(gallery.date).toLocaleDateString()}</td>
                                <td className="p-4">
                                  <Badge variant="secondary" className="text-xs">
                                    {gallery.category}
                                  </Badge>
                                </td>
                                <td className="p-4 text-sm">{gallery.images?.length || 0}</td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8"
                                      onClick={() => {
                                        setEditingGallery(gallery);
                                        setShowGalleryForm(true);
                                      }}
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8 text-destructive"
                                      onClick={() => setConfirmationAction({ type: "delete_gallery", id: gallery._id, name: gallery.title })}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
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
                      <CardDescription>Generate and manage certificates</CardDescription>
                    </div>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Generate Certificates
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Certificate management features coming soon.</p>
                    <p className="text-sm mt-2">You'll be able to generate and manage certificates here.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Forms */}
      <AddMemberForm
        open={showAddMemberForm}
        onOpenChange={setShowAddMemberForm}
        onSuccess={() => {
          toast({ title: "Member added successfully" });
        }}
      />
      <CreateEventForm
        open={showCreateEventForm}
        onOpenChange={(open) => {
          setShowCreateEventForm(open);
          if (!open) setEditingEvent(null);
        }}
        onSuccess={() => {
          toast({ title: editingEvent ? "Event updated successfully" : "Event created successfully" });
          fetchEvents();
        }}
        initialData={editingEvent}
      />
      <NoticeForm
        open={showNoticeForm}
        onOpenChange={setShowNoticeForm}
        editNotice={editingNotice}
        onSuccess={() => {
          setEditingNotice(null);
          fetchNotices();
        }}
      />
      <AlumniForm
        open={showAlumniForm}
        onOpenChange={setShowAlumniForm}
        onSuccess={() => {
          toast({ title: "Alumni registered successfully" });
          fetchAlumni();
        }}
      />

      <MemberDetailsDialog
        open={showMemberDetails}
        onOpenChange={(open) => {
          setShowMemberDetails(open);
          if (!open) {
            // Refresh members list when dialog closes to reflect any status changes
            fetchMembers();
          }
        }}
        memberId={selectedMemberId}
      />

      <AlertDialog open={!!confirmationAction} onOpenChange={(open) => !open && setConfirmationAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmationAction?.type === "approve" ? "Approve Member" :
                confirmationAction?.type === "reject" ? "Reject Member" :
                  confirmationAction?.type === "make_admin" ? "Promote to Admin" :
                    confirmationAction?.type === "delete" ? "Delete Member" :
                      confirmationAction?.type === "restore" ? "Restore Member" :
                        confirmationAction?.type === "delete_event" ? "Delete Event" :
                          confirmationAction?.type === "delete_notice" ? "Delete Notice" :
                            "Confirm Action"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmationAction?.type === "approve" ? `Are you sure you want to approve ${confirmationAction.name}? They will gain access to member-only features.` :
                confirmationAction?.type === "reject" ? `Are you sure you want to reject ${confirmationAction.name}?` :
                  confirmationAction?.type === "make_admin" ? `Are you sure you want to promote ${confirmationAction.name} to Admin? This grants full access to the dashboard.` :
                    confirmationAction?.type === "delete" ? `Are you sure you want to delete ${confirmationAction.name}? This action can be undone later via Restore.` :
                      confirmationAction?.type === "restore" ? `Are you sure you want to restore ${confirmationAction.name}?` :
                        confirmationAction?.type === "delete_event" ? `Are you sure you want to permanently delete the event "${confirmationAction.name}"? This action cannot be undone.` :
                          confirmationAction?.type === "delete_notice" ? `Are you sure you want to delete the notice "${confirmationAction.name}"? This action cannot be undone.` :
                            confirmationAction?.type === "approve_alumni" ? `Are you sure you want to approve ${confirmationAction.name} as an alumni?` :
                              confirmationAction?.type === "reject_alumni" ? `Are you sure you want to reject ${confirmationAction.name}?` :
                                "Are you sure you want to proceed?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessingAction}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={
                confirmationAction?.type === "reject" ||
                  confirmationAction?.type === "delete" ||
                  confirmationAction?.type === "delete_event" ||
                  confirmationAction?.type === "delete_notice"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
              onClick={(e) => {
                e.preventDefault();
                handleConfirmAction();
              }}
              disabled={isProcessingAction}
            >
              {isProcessingAction ? "Processing..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <GalleryForm
        open={showGalleryForm}
        onOpenChange={setShowGalleryForm}
        initialData={editingGallery}
        onSuccess={() => {
          fetchGalleries();
          setEditingGallery(null);
        }}
      />

      <AdvisorForm
        open={showAdvisorForm}
        onOpenChange={setShowAdvisorForm}
        onSuccess={fetchAdvisors}
        advisorToEdit={editingAdvisor}
      />
      <ExecutiveBodyForm
        open={showExecutiveForm}
        onOpenChange={setShowExecutiveForm}
        onSuccess={() => {
          fetchExecutives();
          setEditingExecutive(null);
        }}
        initialData={editingExecutive}
      />
    </Layout>
  );
}
