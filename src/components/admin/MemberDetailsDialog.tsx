import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { apiService, User } from "@/lib/api";
import { getImageUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Calendar, Clock, BookOpen, Layers, Award, Shield, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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
import { Check, X } from "lucide-react";

interface MemberDetailsDialogProps {
    memberId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function MemberDetailsDialog({
    memberId,
    open,
    onOpenChange,
}: MemberDetailsDialogProps) {
    const [member, setMember] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    // Status Update State
    const [statusAction, setStatusAction] = useState<{ type: "approve" | "reject" | "make_admin" | "delete" | "restore", id: string } | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (open && memberId) {
            fetchMemberDetails(memberId);
        } else {
            setMember(null);
            setError(null);
        }
    }, [open, memberId]);

    const fetchMemberDetails = async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiService.getMemberById(id);
            if (response.success && response.data) {
                setMember(response.data);
            } else {
                setError(response.message || "Failed to load member details");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred while fetching details");
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getStatusColor = (status: string) => {
        const normalizedStatus = status?.toUpperCase();
        switch (normalizedStatus) {
            case "APPROVED": return "bg-green-500/10 text-green-500 border-green-500/20";
            case "PENDING": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "REJECTED": return "bg-red-500/10 text-red-500 border-red-500/20";
            default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
        }
    };

    const handleStatusUpdate = async () => {
        if (!statusAction) return;

        setIsUpdating(true);
        try {
            if (statusAction.type === "approve" || statusAction.type === "reject") {
                const status = statusAction.type === "approve" ? "APPROVED" : "REJECTED";
                const response = await apiService.updateMemberStatus(statusAction.id, status);

                if (response.success) {
                    toast({
                        title: `Member ${statusAction.type === "approve" ? "Approved" : "Rejected"}`,
                        description: `Successfully ${statusAction.type}d member application.`,
                    });
                    // Refresh member details
                    fetchMemberDetails(statusAction.id);
                }
            } else if (statusAction.type === "make_admin") {
                const response = await apiService.updateMemberRole(statusAction.id, "admin");
                if (response.success) {
                    toast({
                        title: "Member Promoted",
                        description: "Successfully promoted member to admin.",
                    });
                    // Refresh member details
                    fetchMemberDetails(statusAction.id);
                }
            } else if (statusAction.type === "delete" || statusAction.type === "restore") {
                const isDeleted = statusAction.type === "delete";
                const response = await apiService.deleteMember(statusAction.id, isDeleted);
                if (response.success) {
                    toast({
                        title: `Member ${isDeleted ? "Deleted" : "Restored"}`,
                        description: `Successfully ${isDeleted ? "deleted" : "restored"} member.`,
                    });
                    // Refresh member details
                    fetchMemberDetails(statusAction.id);
                }
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update status",
                variant: "destructive",
            });
        } finally {
            setIsUpdating(false);
            setStatusAction(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Member Details</DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-24 w-24 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-48" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-destructive">{error}</div>
                ) : member ? (
                    <div className="space-y-8">
                        {/* Header / Profile Info */}
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center p-4 bg-muted/30 rounded-lg border border-border/50">
                            <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-primary/20 bg-background flex-shrink-0">
                                {member.profilePhoto ? (
                                    <img
                                        src={getImageUrl(member.profilePhoto)}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-3xl font-bold text-primary">
                                        {member.name?.charAt(0) || "U"}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 space-y-1">
                                <h2 className="text-2xl font-bold">{member.name}</h2>
                                <div className="flex flex-wrap gap-2 items-center text-muted-foreground">
                                    <span className="flex items-center gap-1.5 text-sm">
                                        <BookOpen className="w-4 h-4" />
                                        {member.studentId}
                                    </span>
                                    <span className="hidden md:inline">•</span>
                                    <span className="flex items-center gap-1.5 text-sm">
                                        <Layers className="w-4 h-4" />
                                        Batch {member.batch}
                                    </span>
                                    <span className="hidden md:inline">•</span>
                                    <span className="flex items-center gap-1.5 text-sm">
                                        <Badge variant="outline" className={`capitalize ${getStatusColor(member.approvalStatus)}`}>
                                            {member.approvalStatus}
                                        </Badge>
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                <Badge variant="secondary" className="capitalize px-3 py-1">
                                    {member.role || "Member"}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    Joined {formatDate(member.createdAt)}
                                </span>

                                {/* Action Buttons */}
                                <div className="flex gap-2 mt-2 flex-wrap justify-end">
                                    {(member.approvalStatus?.toUpperCase() === "PENDING" || member.approvalStatus?.toUpperCase() === "REJECTED") && (
                                        <>
                                            <Button
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700 h-8"
                                                onClick={() => setStatusAction({ type: "approve", id: member.id || member._id || "" })}
                                            >
                                                <Check className="w-4 h-4 mr-1" /> Approve
                                            </Button>
                                            {member.approvalStatus?.toUpperCase() !== "REJECTED" && (
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="h-8"
                                                    onClick={() => setStatusAction({ type: "reject", id: member.id || member._id || "" })}
                                                >
                                                    <X className="w-4 h-4 mr-1" /> Reject
                                                </Button>
                                            )}
                                        </>
                                    )}

                                    {/* Make Admin Button */}
                                    {member.role !== "admin" && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-8 border-primary text-primary hover:bg-primary/10"
                                            onClick={() => setStatusAction({ type: "make_admin", id: member.id || member._id || "" })}
                                        >
                                            <Shield className="w-3.5 h-3.5 mr-1" /> Make Admin
                                        </Button>
                                    )}

                                    {/* Delete/Restore Button */}
                                    <Button
                                        size="sm"
                                        variant={member.isDeleted ? "outline" : "destructive"}
                                        className={member.isDeleted ? "h-8 border-green-600 text-green-600 hover:bg-green-50" : "h-8 bg-red-600 hover:bg-red-700"}
                                        onClick={() => setStatusAction({ type: member.isDeleted ? "restore" : "delete", id: member.id || member._id || "" })}
                                    >
                                        {member.isDeleted ? <Check className="w-3.5 h-3.5 mr-1" /> : <X className="w-3.5 h-3.5 mr-1" />}
                                        {member.isDeleted ? "Restore User" : "Delete User"}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Personal Information */}
                            <div className="space-y-4">
                                <h3 className="text-md font-semibold flex items-center gap-2 border-b pb-2">
                                    <Shield className="w-4 h-4 text-primary" />
                                    Personal Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-3 text-sm">
                                        <span className="text-muted-foreground">Email:</span>
                                        <span className="col-span-2 font-medium flex items-center gap-2 truncate" title={member.email}>
                                            <Mail className="w-3.5 h-3.5 opacity-70" /> {member.email}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 text-sm">
                                        <span className="text-muted-foreground">Phone:</span>
                                        <span className="col-span-2 font-medium flex items-center gap-2">
                                            <Phone className="w-3.5 h-3.5 opacity-70" /> {member.phoneNumber}
                                        </span>
                                    </div>
                                    {member.whatsapp && (
                                        <div className="grid grid-cols-3 text-sm">
                                            <span className="text-muted-foreground">WhatsApp:</span>
                                            <span className="col-span-2 font-medium">{member.whatsapp}</span>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-3 text-sm">
                                        <span className="text-muted-foreground">Gender:</span>
                                        <span className="col-span-2 font-medium capitalize">{member.gender}</span>
                                    </div>
                                    <div className="grid grid-cols-3 text-sm">
                                        <span className="text-muted-foreground">Blood Group:</span>
                                        <span className="col-span-2 font-medium">{member.bloodGroup}</span>
                                    </div>
                                    <div className="grid grid-cols-3 text-sm">
                                        <span className="text-muted-foreground">Religion:</span>
                                        <span className="col-span-2 font-medium">{member.religion}</span>
                                    </div>
                                    <div className="grid grid-cols-3 text-sm">
                                        <span className="text-muted-foreground">Date of Birth:</span>
                                        <span className="col-span-2 font-medium">{formatDate(member.dateOfBirth)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Academic Information */}
                            <div className="space-y-4">
                                <h3 className="text-md font-semibold flex items-center gap-2 border-b pb-2">
                                    <BookOpen className="w-4 h-4 text-primary" />
                                    Academic Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-3 text-sm">
                                        <span className="text-muted-foreground">Department:</span>
                                        <span className="col-span-2 font-medium">CSE</span>
                                    </div>
                                    <div className="grid grid-cols-3 text-sm">
                                        <span className="text-muted-foreground">Section:</span>
                                        <span className="col-span-2 font-medium">{member.section}</span>
                                    </div>
                                    <div className="grid grid-cols-3 text-sm">
                                        <span className="text-muted-foreground">Year/Semester:</span>
                                        <span className="col-span-2 font-medium">{member.yearSemester}</span>
                                    </div>
                                    <div className="grid grid-cols-3 text-sm">
                                        <span className="text-muted-foreground">Shift:</span>
                                        <span className="col-span-2 font-medium capitalize">{member.shift}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Club Information */}
                            <div className="space-y-4">
                                <h3 className="text-md font-semibold flex items-center gap-2 border-b pb-2">
                                    <Award className="w-4 h-4 text-primary" />
                                    Club Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-3 text-sm">
                                        <span className="text-muted-foreground">Wing:</span>
                                        <span className="col-span-2 font-medium">
                                            <Badge variant="outline">{member.clubWing}</Badge>
                                        </span>
                                    </div>
                                    {member.skills && member.skills.length > 0 && (
                                        <div className="text-sm">
                                            <p className="text-muted-foreground mb-1.5">Skills:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {member.skills.map((skill, idx) => (
                                                    <Badge key={idx} variant="secondary" className="text-xs">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {member.extraCurricular && member.extraCurricular.length > 0 && (
                                        <div className="text-sm mt-3">
                                            <p className="text-muted-foreground mb-1.5">Extra Curricular:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {member.extraCurricular.map((activity, idx) => (
                                                    <Badge key={idx} variant="secondary" className="text-xs">
                                                        {activity}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Address & Emergency */}
                            <div className="space-y-4">
                                <h3 className="text-md font-semibold flex items-center gap-2 border-b pb-2">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    Address & Contact
                                </h3>
                                <div className="space-y-3">
                                    <div className="text-sm">
                                        <p className="text-muted-foreground mb-1">Present Address:</p>
                                        <p className="font-medium whitespace-pre-wrap text-muted-foreground/80">{member.presentAddress}</p>
                                    </div>
                                    {member.permanentAddress && (
                                        <div className="text-sm">
                                            <p className="text-muted-foreground mb-1">Permanent Address:</p>
                                            <p className="font-medium whitespace-pre-wrap text-muted-foreground/80">{member.permanentAddress}</p>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-3 text-sm pt-2">
                                        <span className="text-muted-foreground">Emergency:</span>
                                        <span className="col-span-2 font-medium text-destructive">{member.emergencyContact || "N/A"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="text-md font-semibold flex items-center gap-2 border-b pb-2">
                                    <DollarSign className="w-4 h-4 text-primary" />
                                    Payment Information
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-muted/20 p-3 rounded border border-border/40">
                                    <div>
                                        <span className="block text-muted-foreground text-xs uppercase tracking-wider">Method</span>
                                        <span className="font-medium">{member.paymentMethod}</span>
                                    </div>
                                    <div>
                                        <span className="block text-muted-foreground text-xs uppercase tracking-wider">Transaction ID</span>
                                        <span className="font-medium font-mono bg-muted/50 px-1 rounded">{member.transactionId}</span>
                                    </div>
                                    <div>
                                        <span className="block text-muted-foreground text-xs uppercase tracking-wider">Status</span>
                                        <span className="font-medium text-green-500">Paid</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                ) : null}
            </DialogContent>

            <AlertDialog open={!!statusAction} onOpenChange={(open) => !open && setStatusAction(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Action</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to {statusAction?.type.replace('_', ' ')} this member?
                            {statusAction?.type === "reject" && " This will mark the application as rejected."}
                            {statusAction?.type === "approve" && " This will verify the member and grant them access."}
                            {statusAction?.type === "make_admin" && " This will grant full admin privileges to this user."}
                            {statusAction?.type === "delete" && " This will soft delete the user account."}
                            {statusAction?.type === "restore" && " This will restore the user account."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleStatusUpdate();
                            }}
                            className={statusAction?.type === "reject" ? "bg-destructive hover:bg-destructive/90" : "bg-green-600 hover:bg-green-700"}
                            disabled={isUpdating}
                        >
                            {isUpdating ? "Updating..." : "Confirm"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Dialog>
    );
}
