import { create } from 'zustand';
import { signup, login, logout, getProfile } from '../lib/api';
import type { SignupRequest, LoginRequest, SignupResponse, LoginResponse, User } from '../lib/api';

interface AuthState {
    user: User | null;
    loading: boolean;
    initialized: boolean;
    initialize: () => Promise<void>;
    login: (data: LoginRequest) => Promise<LoginResponse>;
    signup: (data: SignupRequest) => Promise<SignupResponse>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    loading: true,
    initialized: false,

    initialize: async () => {
        if (get().initialized) return;
        try {
            const user = await getProfile();
            set({ user, loading: false, initialized: true });
        } catch {
            set({ user: null, loading: false, initialized: true });
        }
    },

    login: async (data: LoginRequest) => {
        const response = await login(data);
        const user = 'user' in response ? response.user : response;
        set({ user });
        return response;
    },

    signup: async (data: SignupRequest) => {
        const response = await signup(data);
        const user = 'user' in response ? response.user : response;
        set({ user });
        return response;
    },

    logout: async () => {
        await logout();
        set({ user: null });
    },
}));
