"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Target, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import api from "@/lib/api";

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (values: LoginFormValues) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.post("/auth/login/", values);
            setAuth(response.data);
            router.push("/");
        } catch (err: any) {
            setError(err.response?.data?.detail || "Invalid email or password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white border rounded-lg shadow-sm p-8">
                <div className="flex flex-col items-center gap-2 mb-8">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white">
                        <Target size={32} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-text-primary">Welcome to Argos</h1>
                    <p className="text-text-secondary text-sm">Professional OKR Management Platform</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-rag-red/10 border border-rag-red/20 text-rag-red text-sm rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-primary" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            {...register("email")}
                            type="email"
                            id="email"
                            placeholder="name@company.com"
                            className="w-full h-10 px-3 bg-white border rounded-md text-sm outline-none focus:border-primary transition-colors"
                        />
                        {errors.email && (
                            <p className="text-xs text-rag-red">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-text-primary" htmlFor="password">
                                Password
                            </label>
                            <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                        </div>
                        <input
                            {...register("password")}
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            className="w-full h-10 px-3 bg-white border rounded-md text-sm outline-none focus:border-primary transition-colors"
                        />
                        {errors.password && (
                            <p className="text-xs text-rag-red">{errors.password.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-10 bg-primary hover:bg-primary-hover text-white rounded-md font-medium text-sm transition-colors flex items-center justify-center gap-2"
                    >
                        {isLoading && <Loader2 size={16} className="animate-spin" />}
                        Sign In
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t text-center">
                    <p className="text-xs text-text-secondary">
                        Don't have an account? <a href="#" className="text-primary hover:underline font-medium">Contact your HR Manager</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
