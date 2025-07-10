import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ShieldCheck, Mail, Lock } from "lucide-react";
import { bg } from "@/assets";

export default function LoginPage() {
  const { login, isAuthenticated, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validate inputs
    if (!email.trim()) {
      setFormError("Email is required");
      return;
    }

    if (!password) {
      setFormError("Password is required");
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
    } catch (error: any) {
      console.error("Login error:", error);
      setFormError(error.message || "Failed to login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      {/* Login Form Section */}
      <div className="flex w-full flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50/50 p-8 md:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-700 shadow-xl">
              <ShieldCheck className="h-10 w-10 text-white" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-gray-900">Admin Portal</h1>
              <p className="text-base text-gray-600">
                Secure access to MuscleX administration dashboard
              </p>
            </div>
          </div>

          {(error || formError) && (
            <div className="animate-fadeIn rounded-lg border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600 shadow-sm">
              {formError || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="flex items-center gap-2 text-base font-medium text-gray-700"
                >
                  <Mail className="h-4 w-4 text-gray-500" />
                  Email Address
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@musclex.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    required
                    className="h-12 rounded-lg border-gray-200 bg-white px-4 shadow-sm transition-colors focus:border-red-500 focus:ring-red-500 disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="flex items-center gap-2 text-base font-medium text-gray-700"
                >
                  <Lock className="h-4 w-4 text-gray-500" />
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    required
                    className="h-12 rounded-lg border-gray-200 bg-white px-4 shadow-sm transition-colors focus:border-red-500 focus:ring-red-500 disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="relative h-12 w-full overflow-hidden rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-base font-medium text-white shadow-lg transition-all hover:from-red-700 hover:to-red-800 disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  <span>Sign in to Dashboard</span>
                </div>
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Secure login • Admin access only
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Image Section - Only visible on md and larger screens */}
      <div className="hidden md:block md:w-1/2 relative">
        <div className="absolute inset-0">
          <img
            src={bg}
            alt="MuscleX Admin"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-red-900/90 via-red-800/50 to-transparent" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-12 py-20">
            <div className="w-full max-w-xl space-y-8 text-center">
              <div className="space-y-4">
                <h2 className="text-5xl font-bold leading-tight text-white drop-shadow-lg">
                  Welcome to MuscleX
                </h2>
                <p className="text-xl font-medium text-red-50/90 drop-shadow">
                  Your Complete Admin Dashboard
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="group rounded-xl bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/15">
                  <p className="text-lg font-semibold text-white">Products</p>
                  <p className="mt-1 text-sm text-red-100/80">
                    Manage inventory
                  </p>
                </div>
                <div className="group rounded-xl bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/15">
                  <p className="text-lg font-semibold text-white">Orders</p>
                  <p className="mt-1 text-sm text-red-100/80">Track sales</p>
                </div>
                <div className="group rounded-xl bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/15">
                  <p className="text-lg font-semibold text-white">Analytics</p>
                  <p className="mt-1 text-sm text-red-100/80">View insights</p>
                </div>
              </div>

              <div className="mt-12 space-y-4 rounded-2xl bg-white/5 p-8 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-white">
                  Powerful Admin Tools
                </h3>
                <p className="text-red-50/90">
                  Access everything you need to manage your store efficiently
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
