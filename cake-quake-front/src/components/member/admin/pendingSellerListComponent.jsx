

const PendingSellerListComponent = ({
    data,
    isFetching,
    error,
    handleApprove,
}) => {

    // console.log("data.content: ", data.data.content)
        return (
            <div>
                <div className="w-full flex justify-end">
                    {/* 우측: 필터 버튼들 */}
                    <div className="flex items-center space-x-2">
                        <button className="bg-black text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1 shadow-sm hover:bg-gray-300 transition-colors duration-200">
                            <span>✔</span>
                            <span>New</span>
                        </button>
                        <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm shadow-sm hover:bg-gray-300 transition-colors duration-200">
                            보류
                        </button>
                        <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm shadow-sm hover:bg-gray-300 transition-colors duration-200">
                            거절
                        </button>
                    </div>
                </div>
                
                {data?.content?.map((pending) => (
                    <div key={pending.tempSellerId} className="border-b p-2">
                        <h3>{pending.uname}</h3>
                        <p class="text-sm text-gray-500">tempSellerId: {pending.tempSellerId}</p>
                        <p>사용자 ID: {pending.userId}</p>
                        <p>전화번호: {pending.phoneNumber}</p>
                        <p>사업자 성명: {pending.bossName}</p>
                        <p>사업자 번호: {pending.businessNumber}</p>
                        <div className="flex items-center space-x-2">
                            <button 
                                className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1 shadow-sm hover:bg-green-800 transition-colors duration-200"
                                onClick={() => handleApprove(pending.tempSellerId)}    
                            >
                                <span>승인</span>
                            </button>
                            <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm shadow-sm hover:bg-gray-300 transition-colors duration-200">
                                보류
                            </button>
                            <button className="bg-red-300 text-gray-700 px-3 py-1 rounded-full text-sm shadow-sm hover:bg-red-600 transition-colors duration-200">
                                거절
                            </button>
                        </div>
                    </div>
                    
                ))}
                
            </div>
        )
}

export default PendingSellerListComponent;