"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Dumbbell, ArrowRight, Mail, Lock } from "lucide-react";
import { AuthRedirect } from "@/components/auth-redirect";
import { toast, Toaster } from "sonner";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    setIsSubmitting(true);

    try {
      await login(email, password);
      sessionStorage.setItem("justLoggedIn", "true");
      toast.success("Login successful! Redirecting...");

      const returnUrl = searchParams.get("returnUrl");
      setTimeout(() => {
        window.location.href = returnUrl ? decodeURIComponent(returnUrl) : "/";
      }, 300);
    } catch (error) {
      const errorMessage =
        error.message || "Login failed. Please check your credentials.";

      if (
        errorMessage.toLowerCase().includes("verify") ||
        errorMessage.toLowerCase().includes("verification")
      ) {
        toast.error(
          <div>
            {errorMessage}{" "}
            <Link
              href="/resend-verification"
              className="text-white font-medium underline"
            >
              Resend verification email
            </Link>
          </div>
        );
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthRedirect>
      <div className="min-h-screen bg-white">
        <Toaster position="top-center" />

        <div className="grid lg:grid-cols-2 min-h-screen">
          {/* Left Side - Branding */}
          <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white p-12">
            <div className="max-w-md text-center space-y-8">
              <div className="flex items-center justify-center space-x-3 mb-8">
                <Image
                  src="/logo.png"
                  alt="MuscleX Logo"
                  width={300}
                  height={300}
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <Dumbbell className="h-12 w-12 mx-auto mb-4 text-white" />
                  <h2 className="text-2xl font-bold mb-3">
                    Transform Your Body
                  </h2>
                  <p className="text-red-100 leading-relaxed">
                    Join thousands of fitness enthusiasts who trust MuscleX for
                    their transformation journey.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-2xl font-bold">50K+</div>
                    <div className="text-sm text-red-100">Active Users</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-2xl font-bold">1M+</div>
                    <div className="text-sm text-red-100">Workouts</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-2xl font-bold">4.9★</div>
                    <div className="text-sm text-red-100">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex flex-col justify-center px-6 py-12 lg:px-12">
            <div className="mx-auto w-full max-w-md">
              {/* Mobile Logo */}
              <div className="flex items-center justify-center space-x-3 my-14 lg:hidden">
                <Image
                  src="/logo.png"
                  alt="MuscleX Logo"
                  width={300}
                  height={300}
                  className="rounded-lg"
                />
              </div>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-600">
                  Sign in to continue your fitness journey
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="pl-10 h-12 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500 transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pl-10 pr-12 h-12 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500 transition-all duration-200"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      New to MuscleX?
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link href="/register">
                    <Button
                      variant="outline"
                      className="w-full h-12 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600 font-semibold rounded-xl transition-all duration-200"
                    >
                      Create New Account
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-xs text-gray-500">
                  By signing in, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthRedirect>
  );
}
