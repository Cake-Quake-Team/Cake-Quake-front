import { create } from "zustand";

// 승인 대기 목록을 상태별로 나누기 위한 용도 - new, 보류, 거절
export const useSellerFilterStore = create((set) => ({
    filterStatus: "ALL",
    setFilterStatus: (status) => set({ filterStatus: status }),
}))