import { create } from 'zustand';

const useAuthStore = create((set) => ({
  isLoggedIn: false,
  setLogin: () => set({ isLoggedIn: true }),
  setLogout: () => set({ isLoggedIn: false }),
}));

export default useAuthStore;
