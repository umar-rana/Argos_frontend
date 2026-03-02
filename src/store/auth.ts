"use client";

import Cookies from "js-cookie";
import api from "@/lib/api";
import { AxiosError } from "axios";

import { User, Membership } from "@/types";

interface AuthState {
    user: User | null;
    memberships: Membership[];
    activeOrganizationId: string | null;
    accessToken: string | null;
    refreshToken: string | null;
    setAuth: (data: {
        user: User,
        memberships: Membership[],
        active_organization_id: string,
        access: string,
        refresh: string
    }) => void;
    logout: () => void;
    switchOrganization: (orgId: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            memberships: [],
            activeOrganizationId: null,
            accessToken: null,
            refreshToken: null,
            setAuth: (data) => {
                Cookies.set('argos-token', data.access, { expires: 1, secure: true, sameSite: 'strict' });
                set({
                    user: data.user,
                    memberships: data.memberships,
                    activeOrganizationId: data.active_organization_id,
                    accessToken: data.access,
                    refreshToken: data.refresh,
                });
            },
            logout: () => {
                Cookies.remove('argos-token');
                set({
                    user: null,
                    memberships: [],
                    activeOrganizationId: null,
                    accessToken: null,
                    refreshToken: null,
                });
            },
            switchOrganization: async (orgId) => {
                try {
                    const response = await api.post('/auth/switch-organization/', { organization_id: orgId });
                    const { access, refresh } = response.data;

                    Cookies.set('argos-token', access, { expires: 1, secure: true, sameSite: 'strict' });
                    set({
                        activeOrganizationId: orgId,
                        accessToken: access,
                        refreshToken: refresh,
                    });
                    window.location.reload(); // Refresh to clear all state and re-fetch for new org
                } catch (error) {
                    const axiosError = error as AxiosError<{ detail: string }>;
                    console.error("Failed to switch organization", axiosError.response?.data?.detail || axiosError.message);
                    throw axiosError;
                }
            },
        }),
        {
            name: "argos-auth",
        }
    )
);
