"use client";

import { Objective } from "@/store/okr";
import { KeyResultRow } from "./KeyResultRow";
import { ChevronDown, ChevronRight, Target } from "lucide-react";
import { useState } from "react";
import { StatusBadge, PriorityBadge } from "../ui/custom-badges";
import { cn } from "@/lib/utils";
import { useOKRStore } from "@/store/okr";
import { useUIStore } from "@/store/ui";

interface ObjectiveRowProps {
    objective: Objective;
}

export function ObjectiveRow({ objective }: ObjectiveRowProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const setSidePanelOpen = useUIStore((state) => state.setSidePanelOpen);
    const setSelectedItem = useOKRStore((state) => state.setSelectedItem);

    const handleRowClick = (e: React.MouseEvent) => {
        // If clicking a button (chevron), don't open side panel
        if ((e.target as HTMLElement).closest('button')) return;

        setSelectedItem({ type: 'objective', id: objective.id });
        setSidePanelOpen(true);
    };

    return (
        <div className="border-b last:border-0">
            <div
                onClick={handleRowClick}
                className="grid grid-cols-[1fr_100px_120px_100px_150px_100px] gap-2 px-4 py-3 bg-surface hover:bg-gray-100/80 cursor-pointer text-sm items-center transition-colors border-b border-gray-100"
            >
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-0.5 hover:bg-gray-200 rounded text-gray-400"
                    >
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    <div className="p-1 bgColor-[#EFF6FF] text-[#1D4ED8] rounded">
                        <Target size={14} />
                    </div>
                    <span className="font-bold text-text-primary truncate">{objective.title}</span>
                </div>

                <div className="flex justify-center">
                    <StatusBadge>{objective.status}</StatusBadge>
                </div>

                <div className="flex justify-center">
                    {/* Placeholder for objective summary progress */}
                    <div className="h-1.5 w-16 bg-gray-200 rounded-full" />
                </div>

                <div className="flex justify-center">
                    <PriorityBadge>{objective.priority}</PriorityBadge>
                </div>

                <div className="text-right text-xs text-text-secondary font-medium">
                    {objective.key_results?.length || 0} Key Results
                </div>

                <div className="text-right text-xs text-text-secondary">
                    {new Date(objective.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
            </div>

            {isExpanded && objective.key_results && (
                <div className="bg-white">
                    {objective.key_results.map((kr) => (
                        <KeyResultRow key={kr.id} keyResult={kr} />
                    ))}
                </div>
            )}
        </div>
    );
}
