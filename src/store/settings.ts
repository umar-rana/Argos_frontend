import { create } from 'zustand';
import api from '@/lib/api';
import { AxiosError } from "axios";
import { useAuthStore } from './auth';

export interface EmailSettings {
    id: string;
    provider: 'gmail' | 'outlook' | 'smtp';
    smtp_server: string;
    smtp_port: number;
    smtp_user: string;
    is_active: boolean;
    updated_at: string;
}

interface SettingsState {
    emailSettings: EmailSettings | null;
    isLoading: boolean;
    error: string | null;
    fetchEmailSettings: () => Promise<void>;
    updateEmailSettings: (data: Partial<EmailSettings> & { smtp_password?: string }) => Promise<void>;
    testEmailConnection: () => Promise<{ success: boolean; message: string }>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
    emailSettings: null,
    isLoading: false,
    error: null,

    fetchEmailSettings: async () => {
        const orgId = useAuthStore.getState().activeOrganizationId;
        if (!orgId) return;

        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/orgs/${orgId}/email-settings/`);
            set({ emailSettings: response.data, isLoading: false });
        } catch (err) {
            const axiosError = err as AxiosError<{ detail: string }>;
            set({ error: axiosError.response?.data?.detail || 'Failed to fetch email settings', isLoading: false });
        }
    },

    updateEmailSettings: async (data) => {
        const orgId = useAuthStore.getState().activeOrganizationId;
        if (!orgId) return;

        set({ isLoading: true, error: null });
        try {
            const response = await api.patch(`/orgs/${orgId}/email-settings/`, data);
            set({ emailSettings: response.data, isLoading: false });
        } catch (err) {
            const axiosError = err as AxiosError<{ detail: string }>;
            set({ error: axiosError.response?.data?.detail || 'Failed to update email settings', isLoading: false });
            throw axiosError;
        }
    },

    testEmailConnection: async () => {
        const orgId = useAuthStore.getState().activeOrganizationId;
        if (!orgId) return { success: false, message: 'No organization selected' };

        try {
            const response = await api.post(`/orgs/${orgId}/email-settings/test/`);
            return { success: true, message: response.data.detail || 'Connection successful' };
        } catch (err) {
            const axiosError = err as AxiosError<{ detail: string }>;
            return { success: false, message: axiosError.response?.data?.detail || 'Connection failed' };
        }
    }
}));
