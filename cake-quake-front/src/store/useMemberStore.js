import { create } from 'zustand'

const useMemberStore = create((set) => ({
    profile: null,
    setProfile: (profile) => set({ profile }),
    clearProfile: () => set({ profile: null }),
}))

export default useMemberStore;