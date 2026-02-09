import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Loader2, X, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const categories = ["All", "Events", "Workshops", "Contests", "Achievements", "Team"] as const;

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
    date: z.string().optional(),
    category: z.enum(["All", "Events", "Workshops", "Contests", "Achievements", "Team"]).optional(),
});

interface GalleryFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: any;
    onSuccess: () => void;
}

export function GalleryForm({ open, onOpenChange, initialData, onSuccess }: GalleryFormProps) {
    const { toast } = useToast();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            date: new Date().toISOString().split('T')[0],
            category: "Events",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                title: initialData?.title || "",
                description: initialData?.description || "",
                date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                category: initialData?.category || "Events",
            });
            setExistingImages(initialData?.images || []);
            setSelectedFiles([]);
            setPreviews([]);
        }
    }, [open, initialData, form]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setSelectedFiles((prev) => [...prev, ...newFiles]);

            const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
            setPreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            // Filter out "All" if selected, defaulting to "Events" or keep it if backend handles it (backend enum has 'All' but usually that's for filtering, not tagging)
            // The user requested "All" in the list, so we enable it.

            if (initialData) {
                await apiService.updateGallery(initialData._id || initialData.id, values, selectedFiles);
                toast({ title: "Gallery updated successfully" });
            } else {
                // Type assertion as zod validation guarantees required fields are present
                await apiService.createGallery(values as any, selectedFiles);
                toast({ title: "Gallery created successfully" });
            }
            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Something went wrong",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Edit Gallery" : "Create Gallery"}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Gallery title..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Gallery description..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category} value={category}>
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <FormLabel>Images</FormLabel>
                            <div className="flex flex-wrap gap-4 mb-4">
                                {existingImages.map((img: any, index: number) => (
                                    <div key={`existing-${index}`} className="relative w-24 h-24 rounded-md overflow-hidden border border-border group">
                                        <img
                                            src={img.url}
                                            alt={`Existing ${index}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}

                                {previews.map((preview, index) => (
                                    <div key={`new-${index}`} className="relative w-24 h-24 rounded-md overflow-hidden border border-border group">
                                        <img
                                            src={preview}
                                            alt={`Preview ${index}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}

                                <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-md cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors">
                                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground mt-1">Add Images</span>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </div>
                            <FormDescription>
                                Upload multiple images for this gallery.
                            </FormDescription>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {initialData ? "Update Gallery" : "Create Gallery"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
