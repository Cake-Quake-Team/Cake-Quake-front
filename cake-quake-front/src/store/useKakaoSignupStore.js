import { create } from 'zustand'

const useKakaoSignupStore = create((set) => ({
    kakaoInfo: null,
    setKakaoInfo: (kakaoInfo) => set({ kakaoInfo }),
    reset: () => set({ kakaoInfo: null }),
}))

export default useKakaoSignupStore
