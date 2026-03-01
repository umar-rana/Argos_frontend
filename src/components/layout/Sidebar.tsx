"use client";

import {
    BarChart3,
    LayoutGrid,
    Users,
    Target,
    ShieldAlert,
    Settings,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { useUIStore } from "@/store/ui";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { icon: LayoutGrid, label: "OKR Grid", href: "/" },
    { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
    { icon: Target, label: "Objectives", href: "/objectives" },
    { icon: Users, label: "Teams", href: "/teams" },
    { icon: ShieldAlert, label: "Risks", href: "/risks" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
    const { isNavCollapsed, toggleNav } = useUIStore();
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "bg-surface border-r flex flex-col transition-all duration-300 ease-in-out z-40 relative",
                isNavCollapsed ? "w-14" : "w-56"
            )}
        >
            <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md transition-all group overflow-hidden whitespace-nowrap",
                                isActive
                                    ? "bg-primary text-white font-medium"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                            )}
                        >
                            <item.icon size={20} className={cn("shrink-0", isActive ? "text-white" : "group-hover:text-primary")} />
                            <span className={cn(
                                "transition-opacity duration-200",
                                isNavCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-2 border-t bg-white/50">
                <button
                    onClick={toggleNav}
                    className="w-full flex items-center justify-center p-2 hover:bg-gray-100 rounded-md text-gray-400 hover:text-primary transition-colors"
                >
                    {isNavCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>
        </aside>
    );
}
