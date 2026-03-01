import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const authStorage = localStorage.getItem("trackr-auth");
    if (authStorage) {
        const { state } = JSON.parse(authStorage);
        if (state.accessToken) {
            config.headers.Authorization = `Bearer ${state.accessToken}`;
        }
    }
    return config;
});

export default api;
