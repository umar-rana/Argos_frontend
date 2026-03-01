"use client";

import { create } from "zustand";

interface UIState {
  isNavCollapsed: boolean;
  toggleNav: () => void;
  isSidePanelOpen: boolean;
  setSidePanelOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isNavCollapsed: false,
  toggleNav: () => set((state) => ({ isNavCollapsed: !state.isNavCollapsed })),
  isSidePanelOpen: false,
  setSidePanelOpen: (open) => set({ isSidePanelOpen: open }),
}));
