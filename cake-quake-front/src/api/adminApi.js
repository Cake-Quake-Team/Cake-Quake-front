
const baseUrl = import.meta.env.VITE_API_BASE_URL
const endpoints = {
    sellerPending: 'admin/sellers/pending',
}

// 판매자 승인 대기 목록 조회
export const getpendingSellerList = async(page, size) => {
    try {
        const params = {
            page,
            size,
        }

        // 선택적 파라미터 추가
        if (type) params.type = type
        if (keyword) params.keyword = keyword

        const res = await jwtAxios.get(`${baseUrl}/${endpoints.sellerPending}`, {
            params,
        })

        console.log(res.data)
        return res.data
    } catch (error) {
        console.log("접근 오류:")
        throw error
    }
}