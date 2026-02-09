
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiService, Advisor } from "@/lib/api";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    role: z.string().min(2, "Role is required"),
    department: z.string().min(2, "Department is required"),
});

interface AdvisorFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    advisorToEdit?: Advisor | null;
}

export function AdvisorForm({ open, onOpenChange, onSuccess, advisorToEdit }: AdvisorFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            role: "",
            department: "",
        },
        values: advisorToEdit ? {
            name: advisorToEdit.name,
            email: advisorToEdit.email,
            role: advisorToEdit.role,
            department: advisorToEdit.department,
        } : undefined,
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            const formData = new FormData();

            if (selectedImage) {
                formData.append("file", selectedImage);
            }

            // Structure data to match backend expectation: req.body.data = JSON.stringify(payload)
            const payload = {
                name: values.name,
                email: values.email,
                role: values.role,
                department: values.department,
            };

            formData.append("data", JSON.stringify(payload));

            if (advisorToEdit) {
                await apiService.updateAdvisor(advisorToEdit._id, formData);
                toast({
                    title: "Success",
                    description: "Advisor updated successfully",
                });
            } else {
                if (!selectedImage) {
                    toast({
                        title: "Validation Error",
                        description: "Profile image is required for new advisors",
                        variant: "destructive",
                    });
                    setIsLoading(false);
                    return;
                }
                await apiService.createAdvisor(formData);
                toast({
                    title: "Success",
                    description: "Advisor created successfully",
                });
            }

            form.reset();
            setSelectedImage(null);
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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{advisorToEdit ? "Edit Advisor" : "Add Advisor"}</DialogTitle>
                    <DialogDescription>
                        {advisorToEdit
                            ? "Update advisor details here."
                            : "Add a new faculty advisor to the system."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Dr. John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="john@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Faculty Advisor" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="department"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Department</FormLabel>
                                    <FormControl>
                                        <Input placeholder="CSE" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormItem>
                            <FormLabel>Profile Photo</FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                                />
                            </FormControl>
                            {advisorToEdit && !selectedImage && (
                                <p className="text-xs text-muted-foreground mt-1">Leave empty to keep existing photo</p>
                            )}
                        </FormItem>
                        <DialogFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {advisorToEdit ? "Update Advisor" : "Create Advisor"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
