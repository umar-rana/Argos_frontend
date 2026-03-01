import { OKRGrid } from "@/components/okr/OKRGrid";
import { Plus, Filter, Download } from "lucide-react";
import { useAuthStore } from "@/store/auth";

export default function Home() {
  const activeOrgId = useAuthStore((state) => state.activeOrgId);

  const handleExport = () => {
    if (!activeOrgId) return;
    window.location.href = `http://localhost:8000/api/v1/orgs/${activeOrgId}/export/`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Action Bar */}
      <div className="h-12 border-b px-4 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-1 text-sm font-medium text-text-secondary">
          <span>Organization OKRs</span>
          <span className="text-gray-300 mx-1">/</span>
          <span className="text-text-primary">All Objectives</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 border hover:bg-gray-50 rounded-md transition-colors">
            <Filter size={14} />
            Filter
          </button>
          <button
            onClick={handleExport}
            className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 border hover:bg-gray-50 rounded-md transition-colors"
          >
            <Download size={14} />
            Export
          </button>
          <button className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 bg-primary text-white hover:bg-primary-hover rounded-md transition-colors">
            <Plus size={14} />
            New Objective
          </button>
        </div>
      </div>

      {/* Grid Area */}
      <div className="flex-1 overflow-hidden">
        <OKRGrid />
      </div>
    </div>
  );
}
