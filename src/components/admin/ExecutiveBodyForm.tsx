import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiService, ExecutiveMember } from "@/lib/api";
import { Upload, X } from "lucide-react";

interface ExecutiveBodyFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    initialData?: ExecutiveMember | null;
}

export function ExecutiveBodyForm({ open, onOpenChange, onSuccess, initialData }: ExecutiveBodyFormProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [profilePreview, setProfilePreview] = useState<string>("");
    const [profileFile, setProfileFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        department: "",
        batch: "",
        linkedin: "",
        github: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                email: initialData.email || "",
                role: initialData.role || "",
                department: initialData.department || "",
                batch: initialData.batch || "",
                linkedin: initialData.linkedin || "",
                github: initialData.github || "",
            });
            if (initialData.image?.url || initialData.profilePhoto) {
                setProfilePreview(initialData.image?.url || initialData.profilePhoto); // Assuming URL or path
            } else {
                setProfilePreview("");
            }
        } else {
            // Reset for create mode
            setFormData({
                name: "",
                email: "",
                role: "",
                department: "",
                batch: "",
                linkedin: "",
                github: "",
            });
            setProfilePreview("");
        }
        setProfileFile(null);
    }, [initialData, open]);

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.role || !formData.email) {
            toast({
                title: "Validation Error",
                description: "Name, Email and Role are required.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            if (initialData && (initialData.id || initialData._id)) {
                // Update
                const id = initialData.id || initialData._id;
                await apiService.updateExecutiveBodyMember(id!, formData, profileFile);
                toast({
                    title: "Member Updated",
                    description: "Executive member updated successfully.",
                });
            } else {
                // Create
                await apiService.addExecutiveBodyMember(formData, profileFile);
                toast({
                    title: "Member Added",
                    description: "New executive member added successfully.",
                });
            }

            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to save executive member.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Edit Executive Member" : "Add Executive Member"}</DialogTitle>
                    <DialogDescription>
                        {initialData ? "Update details of the executive member" : "Add a new member to the executive body"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Photo */}
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            {profilePreview ? (
                                <div className="relative w-20 h-20 rounded-full overflow-hidden">
                                    <img src={profilePreview.startsWith("data:") || profilePreview.startsWith("http") ? profilePreview : `https://cucc-server.vercel.app${profilePreview}`} alt="Profile" className="w-full h-full object-cover" />
                                    {/* Fixed image preview logic to handle both data URLs (new uploads) and server paths */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setProfilePreview("");
                                            setProfileFile(null);
                                        }}
                                        className="absolute top-0 right-0 p-1 bg-destructive text-destructive-foreground rounded-full"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-20 h-20 rounded-full bg-muted border-2 border-dashed border-border cursor-pointer hover:border-primary transition-colors">
                                    <Upload className="w-5 h-5 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground mt-1">Photo</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            )}
                        </div>
                        <div className="flex-1">
                            <Label>Profile Photo</Label>
                            <p className="text-sm text-muted-foreground">Upload a professional photo (optional)</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => updateField("name", e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => updateField("email", e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="role">Role *</Label>
                            <Input
                                id="role"
                                value={formData.role}
                                onChange={(e) => updateField("role", e.target.value)}
                                placeholder="e.g. President, General Secretary"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Input
                                id="department"
                                value={formData.department}
                                onChange={(e) => updateField("department", e.target.value)}
                                placeholder="e.g. CSE"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="batch">Batch</Label>
                            <Input
                                id="batch"
                                value={formData.batch}
                                onChange={(e) => updateField("batch", e.target.value)}
                                placeholder="e.g. 56"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="linkedin">LinkedIn URL</Label>
                            <Input
                                id="linkedin"
                                value={formData.linkedin}
                                onChange={(e) => updateField("linkedin", e.target.value)}
                                placeholder="https://linkedin.com/in/..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="github">GitHub URL</Label>
                            <Input
                                id="github"
                                value={formData.github}
                                onChange={(e) => updateField("github", e.target.value)}
                                placeholder="https://github.com/..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : (initialData ? "Update Member" : "Add Member")}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
