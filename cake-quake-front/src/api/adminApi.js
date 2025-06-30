import jwtAxios from "../utils/jwtUtil"

const baseUrl = import.meta.env.VITE_API_BASE_URL
const endpoints = {
    sellerPending: 'admin/sellers/pending',
}

// 판매자 승인 대기 목록 조회
export const getpendingSellerList = async(page, size, status, type, keyword) => {
    try {
        const params = {
            page,
            size,
        }
        console.log(params)
        // 선택적 파라미터 추가
        if (type) params.type = type
        if (keyword) params.keyword = keyword

        if (status && status !== "ALL") {
            params.status = status
        }

        const res = await jwtAxios.get(`${baseUrl}/${endpoints.sellerPending}`, { params })

        console.log("API data: ",res)
        return res
    } catch (error) {
        console.log("접근 오류:")
        throw error
    }
};

// 판매자 승인
export const approvePendingSeller = async (tempSellerId) => {
    try {
        const res = await jwtAxios.post(`${baseUrl}/admin/sellers/${tempSellerId}/approve`)
        console.log("판매자 승인 응답:", res.data)
        return res.data
    } catch (error) {
        console.error("판매자 승인 중 오류:", error)
        throw error
    }
};

// 판매자 보류
export const holdPendingSeller = async (tempSellerId) => {
    console.log("tempSellerId: ", tempSellerId)
    try {
        const res = await jwtAxios.patch(`${baseUrl}/admin/sellers/${tempSellerId}/hold`)
        console.log("판매자 상태 변경 응답:", res.data)
        return res.data
    } catch (error) {
        console.error("판매자 상태 변경 중 오류:", error)
        throw error
    }
};

// 판매자 거절
export const rejectPendingSeller = async (tempSellerId) => {
    console.log("tempSellerId: ", tempSellerId)
    try {
        const res = await jwtAxios.patch(`${baseUrl}/admin/sellers/${tempSellerId}/reject`)
        console.log("판매자 상태 변경 응답:", res.data)
        return res.data
    } catch (error) {
        console.error("판매자 상태 변경 중 오류:", error)
        throw error
    }
};