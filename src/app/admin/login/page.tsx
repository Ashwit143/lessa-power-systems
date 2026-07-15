"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Zap } from "lucide-react";
import Image from "next/image";
import { AdminLoginSchema, type AdminLoginInput } from "@/schemas";
import { Input } from "@/components/ui/forms";
import { Button } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/config";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginInput>({
    resolver: zodResolver(AdminLoginSchema),
  });

  const onSubmit = async (data: AdminLoginInput) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, we would authenticate with Supabase here
      // For demo mode, we just redirect to the dashboard
      setTimeout(() => {
        toast.success("Login successful (Demo Mode)");
        router.push("/admin");
      }, 800);
    } catch (error) {
      toast.error("Invalid credentials");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image
            src="/banners/logo.png"
            alt="Leesa Power Systems"
            width={200}
            height={50}
            className="h-12 w-auto object-contain"
            priority
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-neutral-900">
          Admin Portal
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-600">
          {SITE_CONFIG.businessName}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-card sm:rounded-xl sm:px-10 border border-neutral-200">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              required
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              required
              error={errors.password?.message}
              {...register("password")}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-600"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-semibold text-primary-700 hover:text-primary-800">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isSubmitting}
                leftIcon={<LogIn className="h-5 w-5" aria-hidden="true" />}
              >
                Sign in
              </Button>
            </div>
            
            <div className="mt-4 p-4 bg-amber-50 rounded-lg text-sm text-amber-800 text-center border border-amber-200">
              <strong>Demo Mode:</strong> Any email and password will work. Authentication is bypassed since database is disconnected.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
