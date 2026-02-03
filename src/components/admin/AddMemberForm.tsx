import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/api";
import { Upload, X } from "lucide-react";

interface AddMemberFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const batches = Array.from({ length: 10 }, (_, i) => `${50 + i}`);
const sections = ["A", "B", "C", "D"];
const religions = ["Islam", "Hinduism", "Christianity", "Buddhism", "Others"];
const clubWings = [
  { value: "Programming", label: "Programming Club" },
  { value: "Cyber Security", label: "Cyber Security Club" },
  { value: "R&D", label: "R&D Club" },
];

export function AddMemberForm({ open, onOpenChange, onSuccess }: AddMemberFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    studentId: "",
    batch: "",
    section: "",
    yearSemester: "",
    dateOfBirth: "",
    gender: "",
    shift: "",
    bloodGroup: "",
    religion: "",
    phoneNumber: "",
    whatsapp: "",
    presentAddress: "",
    permanentAddress: "",
    emergencyContact: "",
    clubWing: "" as "Programming" | "Cyber Security" | "R&D" | "",
    profilePhoto: "",
    paymentMethod: "" as "BKASH" | "NAGAD" | "",
    transactionId: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfilePreview(result);
        // In production, upload to Cloudinary and store URL
        updateField("profilePhoto", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clubWing || !formData.paymentMethod) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await apiService.createMember({
        ...formData,
        clubWing: formData.clubWing as "Programming" | "Cyber Security" | "R&D",
        paymentMethod: formData.paymentMethod as "BKASH" | "NAGAD",
      });
      
      toast({
        title: "Member Added",
        description: "New member has been registered successfully.",
      });
      
      onOpenChange(false);
      onSuccess?.();
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        studentId: "",
        batch: "",
        section: "",
        yearSemester: "",
        dateOfBirth: "",
        gender: "",
        shift: "",
        bloodGroup: "",
        religion: "",
        phoneNumber: "",
        whatsapp: "",
        presentAddress: "",
        permanentAddress: "",
        emergencyContact: "",
        clubWing: "",
        profilePhoto: "",
        paymentMethod: "",
        transactionId: "",
      });
      setProfilePreview("");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add member.",
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
          <DialogTitle>Add New Member</DialogTitle>
          <DialogDescription>Register a new CUCC member</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo */}
          <div className="flex items-center gap-4">
            <div className="relative">
              {profilePreview ? (
                <div className="relative w-20 h-20 rounded-full overflow-hidden">
                  <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setProfilePreview("");
                      updateField("profilePhoto", "");
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
              <p className="text-sm text-muted-foreground">Upload a clear photo for ID</p>
            </div>
          </div>

          {/* Personal Info */}
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
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => updateField("password", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID *</Label>
              <Input
                id="studentId"
                value={formData.studentId}
                onChange={(e) => updateField("studentId", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Academic Info */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Batch *</Label>
              <Select value={formData.batch} onValueChange={(v) => updateField("batch", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {batches.map(b => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Section *</Label>
              <Select value={formData.section} onValueChange={(v) => updateField("section", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Year/Semester</Label>
              <Input
                value={formData.yearSemester}
                onChange={(e) => updateField("yearSemester", e.target.value)}
                placeholder="e.g., 4th/8th"
              />
            </div>
          </div>

          {/* Personal Details */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => updateField("dateOfBirth", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={formData.gender} onValueChange={(v) => updateField("gender", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Shift</Label>
              <Select value={formData.shift} onValueChange={(v) => updateField("shift", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Blood Group</Label>
              <Select value={formData.bloodGroup} onValueChange={(v) => updateField("bloodGroup", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {bloodGroups.map(bg => (
                    <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Religion</Label>
              <Select value={formData.religion} onValueChange={(v) => updateField("religion", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {religions.map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phone Number *</Label>
              <Input
                value={formData.phoneNumber}
                onChange={(e) => updateField("phoneNumber", e.target.value)}
                placeholder="+880 1XXX XXXXXX"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp</Label>
              <Input
                value={formData.whatsapp}
                onChange={(e) => updateField("whatsapp", e.target.value)}
                placeholder="+880 1XXX XXXXXX"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Present Address *</Label>
            <Textarea
              value={formData.presentAddress}
              onChange={(e) => updateField("presentAddress", e.target.value)}
              required
            />
          </div>

          {/* Club Wing */}
          <div className="space-y-2">
            <Label>Club Wing *</Label>
            <Select value={formData.clubWing} onValueChange={(v) => updateField("clubWing", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select wing" />
              </SelectTrigger>
              <SelectContent>
                {clubWings.map(wing => (
                  <SelectItem key={wing.value} value={wing.value}>{wing.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payment Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Payment Method *</Label>
              <Select value={formData.paymentMethod} onValueChange={(v) => updateField("paymentMethod", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BKASH">bKash</SelectItem>
                  <SelectItem value="NAGAD">Nagad</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Transaction ID *</Label>
              <Input
                value={formData.transactionId}
                onChange={(e) => updateField("transactionId", e.target.value)}
                placeholder="Enter TrxID"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Member"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
