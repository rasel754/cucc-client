import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("user" | "admin")[];
  requireApproval?: boolean;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  requireApproval = true,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user's membership is approved
  if (requireApproval && user?.approvalStatus !== "APPROVED") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">⏳</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Membership Pending</h1>
        <p className="text-muted-foreground mb-4">
          Your membership application is currently{" "}
          <span className="font-medium text-accent">{user?.approvalStatus}</span>.
          Please wait for admin approval to access the dashboard.
        </p>
        <a
          href="/"
          className="text-primary hover:underline"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  // Check role-based access
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/member/dashboard" replace />;
  }

  return <>{children}</>;
}
