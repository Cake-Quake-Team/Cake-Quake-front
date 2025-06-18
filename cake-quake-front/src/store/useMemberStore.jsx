import { create } from 'zustand'

const useMemberStore = create((set) => ({
    sellerProfile: null,
    setSellerProfile: (profile) => set({ sellerProfile: profile }),
    clearSellerProfile: () => set({ sellerProfile: null }),
}))

export default useMemberStore