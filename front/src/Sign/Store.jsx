import create from 'zustand';

const useAuthStore = create((set) => ({
  isLoggedIn: false,
  userId: null,
  role: null,
  setLogin: (userId, role) => set({ isLoggedIn: true, userId, role }),
  setLogout: () => set({ isLoggedIn: false, userId: null, role: null }),
}));

export default useAuthStore;
