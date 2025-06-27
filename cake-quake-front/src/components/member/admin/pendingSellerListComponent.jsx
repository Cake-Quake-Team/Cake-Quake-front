

const PendingSellerListComponent = ({
    data,
    isFetching,
    error,
    handleApprove,
}) => {

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
                
                <div className="overflow-x-auto mt-3">
                    <table className="min-w-full border border-gray-200 text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-4 py-2 border">ID</th>
                                <th className="px-4 py-2 border">사용자</th>
                                <th className="px-4 py-2 border">매장명</th>
                                <th className="px-4 py-2 border">사업자 번호</th>
                                <th className="px-4 py-2 border">전화번호</th>
                                <th className="px-4 py-2 border">대표자</th>
                                <th className="px-4 py-2 border">상태</th>
                                <th className="px-4 py-2 border">승인 작업</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.content?.map((pending) => (
                                <tr key={pending.tempSellerId} className="border-t">
                                    <td className="px-4 py-2">{pending.tempSellerId}</td>
                                    <td className="px-4 py-2">{pending.uname} ({pending.userId})</td>
                                    <td className="px-4 py-2">{pending.shopName}</td>
                                    <td className="px-4 py-2">{pending.businessNumber}</td>
                                    <td className="px-4 py-2">{pending.phoneNumber}</td>
                                    <td className="px-4 py-2">{pending.bossName}</td>
                                    <td className="px-4 py-2">
                                        <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                                            {pending.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex gap-1">
                                            <button
                                                className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                                                onClick={() => handleApprove(pending.tempSellerId)}
                                            >
                                                승인
                                            </button>
                                            <button className="bg-gray-300 text-gray-800 px-2 py-1 rounded text-xs hover:bg-gray-400">
                                                보류
                                            </button>
                                            <button className="bg-red-400 text-white px-2 py-1 rounded text-xs hover:bg-red-600">
                                                거절
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                
            </div>
        )
}

export default PendingSellerListComponent;