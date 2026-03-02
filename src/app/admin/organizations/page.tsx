"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Plus, Search, MoreVertical, ShieldCheck, ShieldAlert } from "lucide-react";

export default function OrganizationsAdminPage() {
    const [organizations, setOrganizations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchOrgs = async () => {
        try {
            const { data } = await api.get("/admin/organizations/");
            setOrganizations(data);
        } catch (err) {
            console.error("Failed to fetch organizations", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrgs();
    }, []);

    const filteredOrgs = organizations.filter(org =>
        org.name.toLowerCase().includes(search.toLowerCase()) ||
        org.slug.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-8 space-y-8 bg-surface min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                        <Building2 className="text-primary" />
                        Organization Management
                    </h1>
                    <p className="text-text-secondary text-sm">Platform Administration Console</p>
                </div>
                <Button className="flex items-center gap-2">
                    <Plus size={18} /> New Organization
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Organizations</CardTitle>
                            <CardDescription>Manage all client environments on the platform.</CardDescription>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <Input
                                placeholder="Search by name or slug..."
                                className="pl-10"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 border-b text-text-secondary font-medium">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Slug</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Created At</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-400">Loading organizations...</td>
                                    </tr>
                                ) : filteredOrgs.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No organizations found.</td>
                                    </tr>
                                ) : (
                                    filteredOrgs.map((org) => (
                                        <tr key={org.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-text-primary capitalize">{org.name}</td>
                                            <td className="px-6 py-4 text-text-secondary font-mono text-xs">{org.slug}</td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${org.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {org.status === 'active' ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                                                    {org.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-text-secondary">
                                                {new Date().toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-1 hover:bg-gray-100 rounded text-gray-400">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
