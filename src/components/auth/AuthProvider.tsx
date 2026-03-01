"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { accessToken } = useAuthStore();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        // Hydration check
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (!isHydrated) return;

        if (!accessToken && pathname !== "/login") {
            router.push("/login");
        } else if (accessToken && pathname === "/login") {
            router.push("/");
        }
    }, [accessToken, pathname, isHydrated, router]);

    if (!isHydrated) return null;

    return <>{children}</>;
}
