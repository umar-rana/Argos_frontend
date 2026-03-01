"use client";

import { create } from "zustand";
import api from "@/lib/api";
import { useAuthStore } from "./auth";

export interface KeyResult {
    id: string;
    objective: string;
    title: string;
    description: string;
    kr_type: string;
    start_value: number;
    target_value: number;
    current_value: number;
    unit: string;
    priority: string;
    rag_status: string;
    due_date: string;
}

export interface Objective {
    id: string;
    title: string;
    description: string;
    priority: string;
    status: string;
    due_date: string;
    key_results: KeyResult[];
}

interface OKRState {
    objectives: Objective[];
    selectedItem: { type: 'objective' | 'kr', id: string } | null;
    history: any[];
    risks: any[];
    accomplishments: any[];
    isLoading: boolean;
    error: string | null;
    fetchOKRs: () => Promise<void>;
    updateKR: (krId: string, data: any) => Promise<void>;
    setSelectedItem: (item: { type: 'objective' | 'kr', id: string } | null) => void;
    fetchItemDetails: (type: 'objective' | 'kr', id: string) => Promise<void>;
}

export const useOKRStore = create<OKRState>((set, get) => ({
    objectives: [],
    selectedItem: null,
    history: [],
    risks: [],
    accomplishments: [],
    isLoading: false,
    error: null,

    setSelectedItem: (item) => {
        set({ selectedItem: item });
        if (item) {
            get().fetchItemDetails(item.type, item.id);
        }
    },

    fetchItemDetails: async (type, id) => {
        const activeOrgId = useAuthStore.getState().activeOrgId;
        if (!activeOrgId) return;

        try {
            if (type === 'kr') {
                const [historyRes, risksRes, accRes] = await Promise.all([
                    api.get(`/orgs/${activeOrgId}/key-results/${id}/history/`),
                    api.get(`/orgs/${activeOrgId}/risks/?key_result=${id}`),
                    api.get(`/orgs/${activeOrgId}/accomplishments/?key_result=${id}`)
                ]);
                set({
                    history: historyRes.data,
                    risks: risksRes.data,
                    accomplishments: accRes.data
                });
            }
        } catch (err) {
            console.error("Failed to fetch item details", err);
        }
    },

    fetchOKRs: async () => {
        const activeOrgId = useAuthStore.getState().activeOrgId;
        if (!activeOrgId) return;

        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/orgs/${activeOrgId}/objectives/`);
            set({ objectives: response.data, isLoading: false });
        } catch (err: any) {
            set({
                error: err.response?.data?.detail || "Failed to fetch OKRs",
                isLoading: false
            });
        }
    },

    updateKR: async (krId, data) => {
        const activeOrgId = useAuthStore.getState().activeOrgId;
        if (!activeOrgId) return;

        try {
            await api.patch(`/orgs/${activeOrgId}/key-results/${krId}/`, data);
            await get().fetchOKRs(); // Reload to get consistent state
        } catch (err: any) {
            set({ error: err.response?.data?.detail || "Failed to update KR" });
        }
    },
}));
