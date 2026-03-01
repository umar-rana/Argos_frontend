import { cn } from "@/lib/utils";

interface BadgeProps {
    children: React.ReactNode;
    className?: string;
}

export function StatusBadge({ children, className }: BadgeProps) {
    const status = children?.toString().toLowerCase();

    const colors: Record<string, string> = {
        green: "bg-rag-green/10 text-rag-green border-rag-green/20",
        amber: "bg-rag-amber/10 text-rag-amber border-rag-amber/20",
        red: "bg-rag-red/10 text-rag-red border-rag-red/20",
        approved: "bg-status-approved/10 text-status-approved border-status-approved/20",
        pending: "bg-status-pending/10 text-status-pending border-status-pending/20",
        rejected: "bg-status-rejected/10 text-status-rejected border-status-rejected/20",
        draft: "bg-status-draft/10 text-status-draft border-status-draft/20",
    };

    return (
        <span className={cn(
            "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
            colors[status || ""] || "bg-gray-100 text-gray-500 border-gray-200",
            className
        )}>
            {children}
        </span>
    );
}

export function PriorityBadge({ children, className }: BadgeProps) {
    const priority = children?.toString().toLowerCase();

    const colors: Record<string, string> = {
        p0: "bg-priority-p0",
        p1: "bg-priority-p1",
        p2: "bg-priority-p2",
        p3: "bg-priority-p3",
    };

    return (
        <div className="flex items-center gap-1.5">
            <span className={cn("w-2 h-2 rounded-full", colors[priority || ""] || "bg-gray-300")} />
            <span className={cn("text-[11px] font-medium text-text-secondary uppercase", className)}>
                {children}
            </span>
        </div>
    );
}
