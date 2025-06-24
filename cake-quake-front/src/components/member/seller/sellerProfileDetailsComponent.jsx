
const SellerProfileDetailsComponent = ({
    isLoading,
    errorMessage,
    sellerData,
    handleModifyProfile,
    handleWithdraw,
}) => {

    if (isLoading) return <p>로딩 중입니다...</p>
    if (errorMessage) return <p className="text-red-500">{errorMessage}</p>
    if (!sellerData) return null

    const { userId, uname, phoneNumber, shopPreview } = sellerData

    return(
        <div className="max-w-3xl mx-auto mt-5 p-4 bg-white shadow-md rounded-lg space-y-4">
            <h2 className="text-3xl font-bold text-center text-gray-800">마이페이지</h2>

            <div className="space-y-4">
                <p className="text-lg"><strong>아이디:</strong> <span className="text-gray-700">{userId}</span></p>
                <p className="text-lg"><strong>닉네임:</strong> <span className="text-gray-700">{uname}</span></p>
                <p className="text-lg"><strong>전화번호:</strong> <span className="text-gray-700">{phoneNumber}</span></p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 justify-center items-center mt-4">
                <button className="w-28 aspect-square flex items-center justify-center border border-orange-400 text-orange-500 rounded-full hover:bg-orange-50 text-sm font-semibold">
                    PG키 등록
                </button>
                <button 
                    className="w-28 aspect-square flex items-center justify-center border border-indigo-500 text-indigo-500 rounded-full hover:bg-indigo-50 text-sm font-semibold"
                    onClick={handleModifyProfile}
                >
                    정보 수정
                </button>
                <button className="w-28 aspect-square flex items-center justify-center border border-indigo-500 text-indigo-500 rounded-full hover:bg-indigo-50 text-sm font-semibold"
                >
                    비밀번호 변경
                </button>
            </div>

            {/* 탈퇴 버튼 */}
            <div className="flex justify-end mt-4">
                <button
                    onClick={handleWithdraw}
                    className="text-xs px-2 py-1 border border-red-500 text-red-500 rounded-lg hover:bg-red-50">
                    탈퇴
                </button>
            </div>

            {/* 매장 요약 정보 */}
            {shopPreview && (
                <div className="border p-3 rounded-md bg-gray-50">
                    <h2 className="text-2xl font-bold text-center text-gray-800">매장 요약 정보</h2>
                    <p className="text-lg"><strong>매장 명:</strong> <span className="text-gray-700">{shopPreview.shopName}</span></p>
                    <p className="text-lg"><strong>주소:</strong> <span className="text-gray-700">{shopPreview.address}</span></p>
                    
                    {/* 매장 자세히 보기 버튼 */}
                    <div className="flex justify-end mt-4">
                        <button
                            className="mt-2 px-3 py-1 border border-sky-400 text-sky-400 text-sm rounded-lg hover:bg-sky-50"
                            onClick={() => {
                                // 매장 상세 페이지로 이동 (shopId를 경로에 포함)
                                window.location.href = `/shops/${shopPreview.shopId}`;
                            }}
                        >
                            매장 정보 자세히 보기
                        </button>
                    </div>
                </div>
            )}
      </div>
    )
}

export default SellerProfileDetailsComponent;