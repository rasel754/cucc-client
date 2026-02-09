
import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import PageTitle from "@/components/common/PageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Code2 } from "lucide-react";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast({
                title: "Validation Error",
                description: "Please enter your email address.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const response: any = await apiService.forgotPassword(email);
            const resetToken = response.data?.resetToken;

            if (resetToken) {
                toast({
                    title: "Success",
                    description: "Redirecting to reset password page...",
                });
                // Auto-redirect to reset password page with token
                window.location.href = `/reset-password?token=${resetToken}`;
                return;
            }

            setIsSubmitted(true);
            toast({
                title: "Success",
                description: "If an account exists with this email, you will receive a password reset link.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to process your request.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <PageTitle title="Forgot Password" />
            <div className="min-h-screen flex items-center justify-center bg-muted/30 py-12 px-4">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-block">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-cucc-navy rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <Code2 className="w-8 h-8 text-primary-foreground" />
                            </div>
                        </Link>
                        <h1 className="font-display text-2xl font-bold text-foreground">Forgot Password</h1>
                        <p className="text-muted-foreground mt-1">Recover your CUCC account access</p>
                    </div>

                    <Card className="shadow-xl border-border/50">
                        <CardHeader className="text-center pb-4">
                            <CardTitle className="font-display text-xl">Reset Password</CardTitle>
                            <CardDescription>
                                {isSubmitted
                                    ? "Check your email for instructions"
                                    : "Enter your email to receive a reset link"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isSubmitted ? (
                                <div className="text-center space-y-4">
                                    <div className="p-4 bg-primary/10 rounded-lg text-primary">
                                        <p className="text-sm">
                                            We have sent a password reset link to <strong>{email}</strong>.
                                            Please check your inbox and spam folder.
                                        </p>
                                    </div>
                                    <Button variant="outline" className="w-full" onClick={() => setIsSubmitted(false)}>
                                        Try another email
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your registered email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <Button type="submit" variant="hero" className="w-full" disabled={isLoading}>
                                        {isLoading ? "Sending Link..." : "Send Reset Link"}
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </form>
                            )}

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
