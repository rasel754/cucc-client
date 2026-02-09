
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import PageTitle from "@/components/common/PageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Code2, Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const { toast } = useToast();

    const [isLoading, setIsLoading] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    if (!token) {
        return (
            <Layout>
                <PageTitle title="Reset Password" />
                <div className="min-h-screen flex items-center justify-center bg-muted/30 py-12 px-4">
                    <Card className="w-full max-w-md shadow-xl border-border/50 text-center p-6">
                        <h2 className="text-xl font-bold text-destructive mb-2">Invalid Request</h2>
                        <p className="text-muted-foreground mb-4">No reset token provided. Please use the link from your email.</p>
                        <Link to="/login" className="text-primary hover:underline">
                            Return to Login
                        </Link>
                    </Card>
                </div>
            </Layout>
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            toast({
                title: "Validation Error",
                description: "Password must be at least 6 characters long.",
                variant: "destructive",
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            toast({
                title: "Validation Error",
                description: "Passwords do not match.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            await apiService.resetPassword(token, newPassword);
            toast({
                title: "Success",
                description: "Your password has been reset successfully. You can now login.",
            });
            navigate("/login");
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to reset password. The token may be invalid or expired.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <PageTitle title="Reset Password" />
            <div className="min-h-screen flex items-center justify-center bg-muted/30 py-12 px-4">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-block">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-cucc-navy rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <Code2 className="w-8 h-8 text-primary-foreground" />
                            </div>
                        </Link>
                        <h1 className="font-display text-2xl font-bold text-foreground">Set New Password</h1>
                        <p className="text-muted-foreground mt-1">Create a new password for your account</p>
                    </div>

                    <Card className="shadow-xl border-border/50">
                        <CardHeader className="text-center pb-4">
                            <CardTitle className="font-display text-xl">Reset Password</CardTitle>
                            <CardDescription>Enter your new password below</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="newPassword"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter new password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <Button type="submit" variant="hero" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Resetting..." : "Reset Password"}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </form>

                            <div className="mt-6 text-center">
                                <Link to="/login" className="text-muted-foreground hover:text-foreground text-sm">
                                    ← Back to Login
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
