"use client";

import { useOKRStore } from "@/store/okr";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";
import { LayoutDashboard, Target, TrendingUp, AlertTriangle } from "lucide-react";

import { useEffect } from "react";
import { useNotificationStore } from "@/store/notifications";

export default function DashboardPage() {
    const { objectives, auditLogs, dashboardData, fetchOKRs, fetchAuditLogs, fetchDashboardData } = useOKRStore();
    const { fetchNotifications } = useNotificationStore();

    useEffect(() => {
        fetchOKRs();
        fetchAuditLogs();
        fetchNotifications();
        fetchDashboardData();
    }, [fetchOKRs, fetchAuditLogs, fetchNotifications, fetchDashboardData]);

    // Use live dashboard data if available, otherwise fallback to calculated/mocks
    const stats = dashboardData?.stats || {
        total_objectives: objectives.length,
        total_krs: objectives.reduce((acc, obj) => acc + (obj.key_results?.length || 0), 0),
        active_teams: 0,
        completion_rate: 0
    };

    const pieData = dashboardData?.health_distribution || [
        { name: 'On Track', value: 0, color: '#10B981' },
        { name: 'At Risk', value: 0, color: '#F59E0B' },
        { name: 'Off Track', value: 0, color: '#EF4444' },
    ];

    const barData = dashboardData?.top_objectives || objectives.slice(0, 5).map(obj => ({
        name: obj.title.length > 20 ? obj.title.substring(0, 20) + '...' : obj.title,
        progress: 0
    }));

    return (
        <div className="p-8 space-y-8 bg-surface min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                        <LayoutDashboard className="text-primary" />
                        Executive Dashboard
                    </h1>
                    <p className="text-text-secondary text-sm">Real-time overview of organization performance</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Objectives" value={stats.total_objectives} icon={<Target className="text-blue-500" />} />
                <StatCard title="Total Key Results" value={stats.total_krs} icon={<TrendingUp className="text-green-500" />} />
                <StatCard title="Active Teams" value={stats.active_teams} icon={<LayoutDashboard className="text-amber-500" />} />
                <StatCard title="Completion Rate %" value={stats.completion_rate} icon={<TrendingUp className="text-primary" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <h3 className="font-bold text-text-primary mb-6">Health Distribution</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-6 mt-4">
                            {pieData.map(d => (
                                <div key={d.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                                    <span className="text-xs text-text-secondary">{d.name} ({d.value})</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <h3 className="font-bold text-text-primary mb-6">Top Objectives Progress (%)</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" domain={[0, 100]} hide />
                                    <YAxis dataKey="name" type="category" width={150} fontSize={12} />
                                    <Tooltip />
                                    <Bar dataKey="progress" fill="#2563EB" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col">
                    <h3 className="font-bold text-text-primary mb-6">Recent Activity</h3>
                    <div className="flex-1 space-y-4 overflow-auto max-h-[800px] pr-2">
                        {auditLogs.length === 0 ? (
                            <div className="text-center py-12 text-gray-400 text-xs">No activity logged yet.</div>
                        ) : (
                            auditLogs.slice(0, 15).map((log) => (
                                <div key={log.id} className="flex gap-3 pb-4 border-b last:border-0">
                                    <div className="mt-1">
                                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border">
                                            <TrendingUp size={14} className="text-primary opacity-50" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-text-primary leading-snug">
                                            <span className="font-bold">{log.performed_by_details?.first_name || 'System'}</span>
                                            {" "}{log.action.replace(/_/g, ' ').toLowerCase()}
                                        </p>
                                        <p className="text-xs text-text-secondary truncate mt-0.5">
                                            {log.entity_type}
                                        </p>
                                        <span className="text-[10px] text-gray-400 mt-1 block">
                                            {new Date(log.performed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(log.performed_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <button className="w-full mt-6 py-2 text-[10px] font-bold uppercase text-gray-400 hover:text-primary transition-colors border border-dashed rounded-md">
                        View Full Activity Log
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
    return (
        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center justify-between">
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
                <p className="text-3xl font-bold text-text-primary">{value}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-full">
                {icon}
            </div>
        </div>
    );
}
