import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/api";
import { Notice } from "@/data/mockData";

interface NoticeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  editNotice?: Notice | null; // For editing existing notice
}

const categories = [
  { value: "general", label: "General" },
  { value: "event", label: "Event" },
  { value: "result", label: "Result" },
  { value: "important", label: "Important" },
];

export function NoticeForm({ open, onOpenChange, onSuccess, editNotice }: NoticeFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    attachment: "",
  });

  // Populate form when editing
  useEffect(() => {
    if (editNotice) {
      setFormData({
        title: editNotice.title,
        content: editNotice.content,
        category: editNotice.category,
        attachment: editNotice.attachment || "",
      });
    } else {
      setFormData({
        title: "",
        content: "",
        category: "",
        attachment: "",
      });
    }
  }, [editNotice, open]);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (editNotice) {
        await apiService.updateNotice(editNotice.id, formData);
        toast({
          title: "Notice Updated",
          description: "Notice has been updated successfully.",
        });
      } else {
        await apiService.createNotice(formData);
        toast({
          title: "Notice Created",
          description: "New notice has been published successfully.",
        });
      }
      
      onOpenChange(false);
      onSuccess?.();
      
      setFormData({
        title: "",
        content: "",
        category: "",
        attachment: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${editNotice ? "update" : "create"} notice.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editNotice ? "Edit Notice" : "Create New Notice"}</DialogTitle>
          <DialogDescription>
            {editNotice ? "Update the notice details" : "Publish a new notice for members"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Notice Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g., Registration Open for Contest"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Category *</Label>
            <Select value={formData.category} onValueChange={(v) => updateField("category", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Content *</Label>
            <Textarea
              value={formData.content}
              onChange={(e) => updateField("content", e.target.value)}
              placeholder="Write the notice content..."
              rows={5}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Attachment URL (optional)</Label>
            <Input
              value={formData.attachment}
              onChange={(e) => updateField("attachment", e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (editNotice ? "Updating..." : "Publishing...") : (editNotice ? "Update Notice" : "Publish Notice")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
