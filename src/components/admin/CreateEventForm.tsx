import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiService, Event } from "@/lib/api";

interface CreateEventFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  initialData?: Event | null; // Allow null
}

const eventTypes = [
  { value: "contest", label: "Contest" },
  { value: "workshop", label: "Workshop" },
  { value: "seminar", label: "Seminar" },
  { value: "hackathon", label: "Hackathon" },
  { value: "bootcamp", label: "Bootcamp" },
];

const wings = [
  { value: "programming", label: "Programming Club" },
  { value: "cybersecurity", label: "Cyber Security" },
  { value: "Research & Development", label: "Research & Development Club" },
  { value: "all", label: "All Wings" },
];

export function CreateEventForm({ open, onOpenChange, onSuccess, initialData }: CreateEventFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to format date for datetime-local input
  const formatDateForInput = (isoString?: string) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    eventType: initialData?.eventType || "",
    startTime: formatDateForInput(initialData?.startTime) || "",
    endTime: formatDateForInput(initialData?.endTime) || "",
    registrationDeadline: formatDateForInput(initialData?.registrationDeadline) || "",
    maxParticipants: initialData?.maxParticipants ? String(initialData.maxParticipants) : "",
    organizingWing: initialData?.organizingWing || "",
    venue: initialData?.venue || "",
    description: initialData?.description || "",
  });

  // Effect to update form if initialData changes (e.g. when opening different event)
  // This is crucial if the dialog is reused without unmounting
  /* 
  useEffect(() => {
     if (open && initialData) { ... } else if (open && !initialData) { ... reset ... }
  }, [open, initialData]);
  */
  // Simpler approach: Reset/Set when open changes or key changes in parent. 
  // Let's rely on parent remounting or manual reset in Success.
  // Actually, better to use a useEffect here to sync props to state.

  const [coverImage, setCoverImage] = useState<File | null>(null);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          title: initialData.title,
          eventType: initialData.eventType,
          startTime: formatDateForInput(initialData.startTime),
          endTime: formatDateForInput(initialData.endTime),
          registrationDeadline: formatDateForInput(initialData.registrationDeadline),
          maxParticipants: String(initialData.maxParticipants),
          organizingWing: initialData.organizingWing || "",
          venue: initialData.venue,
          description: initialData.description,
        });
      } else {
        setFormData({
          title: "",
          eventType: "",
          startTime: "",
          endTime: "",
          registrationDeadline: "",
          maxParticipants: "",
          organizingWing: "",
          venue: "",
          description: "",
        });
      }
      setCoverImage(null);
    }
  }, [open, initialData]);



  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert datetime-local strings to ISO strings
      const payload = {
        title: formData.title,
        eventType: formData.eventType,
        description: formData.description,
        venue: formData.venue,
        organizingWing: formData.organizingWing || undefined,
        maxParticipants: Number(formData.maxParticipants) || 0,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        registrationDeadline: new Date(formData.registrationDeadline).toISOString(),
      };

      if (initialData) {
        await apiService.updateEvent(initialData._id, payload, coverImage);
        toast({
          title: "Event Updated",
          description: "Event has been updated successfully.",
        });
      } else {
        await apiService.createEvent(payload, coverImage);
        toast({
          title: "Event Created",
          description: "New event has been created successfully.",
        });
      }

      onOpenChange(false);
      onSuccess?.();

      // Reset form
      setFormData({
        title: "",
        eventType: "",
        startTime: "",
        endTime: "",
        registrationDeadline: "",
        maxParticipants: "",
        organizingWing: "",
        venue: "",
        description: "",
      });
      setCoverImage(null);

    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create event.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Event" : "Create New Event"}</DialogTitle>
          <DialogDescription>{initialData ? "Update event details" : "Add a new event for club members"}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g., Intra University Programming Contest"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Event Type *</Label>
              <Select value={formData.eventType} onValueChange={(v) => updateField("eventType", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Contest">Contest</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                  <SelectItem value="Seminar">Seminar</SelectItem>
                  <SelectItem value="Hackathon">Hackathon</SelectItem>
                  <SelectItem value="Bootcamp">Bootcamp</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Organizing Wing</Label>
              <Select value={formData.organizingWing} onValueChange={(v) => updateField("organizingWing", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select wing (Optional)" />
                </SelectTrigger>
                <SelectContent>
                  {wings.map(wing => (
                    <SelectItem key={wing.value} value={wing.value}>{wing.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time *</Label>
              <Input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => updateField("startTime", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>End Time *</Label>
              <Input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => updateField("endTime", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Registration Deadline *</Label>
              <Input
                type="datetime-local"
                value={formData.registrationDeadline}
                onChange={(e) => updateField("registrationDeadline", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Max Participants</Label>
              <Input
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => updateField("maxParticipants", e.target.value)}
                placeholder="50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Venue *</Label>
            <Input
              value={formData.venue}
              onChange={(e) => updateField("venue", e.target.value)}
              placeholder="e.g., Computer Lab 1, Block C"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Cover Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Describe the event details..."
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (initialData ? "Updating..." : "Creating...") : (initialData ? "Update Event" : "Create Event")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
