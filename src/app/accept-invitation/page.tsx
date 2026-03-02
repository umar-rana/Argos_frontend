"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function AcceptInvitationPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        password: "",
        confirm_password: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <p className="text-center text-red-500 font-medium">Invalid or missing invitation token.</p>
                        <Button className="w-full mt-4" onClick={() => router.push("/login")}>Go to Login</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirm_password) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await api.post("/auth/accept-invitation/", {
                token,
                password: formData.password,
                first_name: formData.first_name,
                last_name: formData.last_name
            });
            setIsSuccess(true);
            setTimeout(() => router.push("/login"), 3000);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to accept invitation. The link may be expired.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface p-4">
                <Card className="w-full max-w-md border-green-100 bg-green-50/30">
                    <CardContent className="pt-8 text-center space-y-4">
                        <div className="flex justify-center">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>
                        <CardTitle className="text-green-800">Welcome Aboard!</CardTitle>
                        <p className="text-green-700 text-sm">
                            Your account has been created. Redirecting you to login...
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface p-4">
            <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Complete Your Profile</CardTitle>
                    <p className="text-text-secondary text-center text-sm">
                        You've been invited to join the OKR Tracking platform.
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first_name">First Name</Label>
                                <Input
                                    id="first_name"
                                    placeholder="John"
                                    required
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_name">Last Name</Label>
                                <Input
                                    id="last_name"
                                    placeholder="Doe"
                                    required
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Create Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm_password">Confirm Password</Label>
                            <Input
                                id="confirm_password"
                                type="password"
                                required
                                value={formData.confirm_password}
                                onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded text-red-600 text-xs font-medium">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Setting up account...
                                </>
                            ) : (
                                "Join Organization"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
