import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiService, Notice } from "@/lib/api";

interface NoticeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  editNotice?: Notice | null; // For editing existing notice
}

const categories = [
  { value: "Programming Contest", label: "Programming Contest" },
  { value: "Hackathon", label: "Hackathon" },
  { value: "Workshop", label: "Workshop" },
  { value: "Seminar", label: "Seminar" },
  { value: "Bootcamp", label: "Bootcamp" },
];

export function NoticeForm({ open, onOpenChange, onSuccess, editNotice }: NoticeFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  });

  // Populate form when editing
  useEffect(() => {
    if (editNotice) {
      setFormData({
        title: editNotice.title,
        content: editNotice.content,
        category: editNotice.category,
      });
      setSelectedFile(null); // Reset file on edit open
    } else {
      setFormData({
        title: "",
        content: "",
        category: "",
      });
      setSelectedFile(null);
    }
  }, [editNotice, open]);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editNotice) {
        await apiService.updateNotice(editNotice.id, formData, selectedFile);
        toast({
          title: "Notice Updated",
          description: "Notice has been updated successfully.",
        });
      } else {
        await apiService.createNotice(formData, selectedFile);
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
      });
      setSelectedFile(null);
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
            <Label>Attachment (optional)</Label>
            <Input
              type="file"
              onChange={handleFileChange}
              accept="image/*,.pdf"
            />
            {editNotice?.attachment && !selectedFile && (
              <p className="text-xs text-muted-foreground mt-1">
                Current attachment: <a href={editNotice.attachment} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View</a>
              </p>
            )}
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
