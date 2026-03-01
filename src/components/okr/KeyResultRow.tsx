"use client";

import { KeyResult } from "@/store/okr";
import { StatusBadge, PriorityBadge } from "../ui/custom-badges";
import { useUIStore } from "@/store/ui";
import { useOKRStore } from "@/store/okr";
import { cn } from "@/lib/utils";

interface KeyResultRowProps {
    keyResult: KeyResult;
}

export function KeyResultRow({ keyResult }: KeyResultRowProps) {
    const setSidePanelOpen = useUIStore((state) => state.setSidePanelOpen);
    const setSelectedItem = useOKRStore((state) => state.setSelectedItem);

    const handleRowClick = () => {
        setSelectedItem({ type: 'kr', id: keyResult.id });
        setSidePanelOpen(true);
    };

    const progress = Math.min(
        100,
        Math.max(0, (keyResult.current_value / keyResult.target_value) * 100)
    );

    return (
        <div
            onClick={handleRowClick}
            className="grid grid-cols-[1fr_100px_120px_100px_150px_100px] gap-2 px-4 py-2 border-b hover:bg-gray-50 cursor-pointer text-sm items-center transition-colors group"
        >
            <div className="flex items-center gap-3 pl-8">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-primary transition-colors" />
                <span className="font-medium text-text-primary truncate">{keyResult.title}</span>
            </div>

            <div className="flex justify-center">
                <StatusBadge>{keyResult.rag_status}</StatusBadge>
            </div>

            <div className="flex flex-col gap-1 px-2">
                <div className="flex justify-between text-[10px] text-text-secondary font-medium">
                    <span>{Math.round(progress)}%</span>
                    <span>{keyResult.target_value}{keyResult.unit}</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={cn(
                            "h-full transition-all duration-500",
                            keyResult.rag_status === 'green' ? 'bg-rag-green' :
                                keyResult.rag_status === 'amber' ? 'bg-rag-amber' : 'bg-rag-red'
                        )}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="flex justify-center">
                <PriorityBadge>{keyResult.priority}</PriorityBadge>
            </div>

            <div className="text-right font-mono text-xs tabular-nums text-text-secondary">
                {keyResult.current_value} / {keyResult.target_value}
            </div>

            <div className="text-right text-xs text-text-secondary">
                {new Date(keyResult.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </div>
        </div>
    );
}
