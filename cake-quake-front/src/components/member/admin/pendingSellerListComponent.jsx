import { useState } from "react";
import LoadingSpinner from "../../common/loadingSpinner";


const PendingSellerListComponent = ({
    data,
    isFetching,
    errorMessage,
    handleApprove,
    statusFilter,
    setStatusFilter,
    filteredData,
    handleHold,
    handleReject,
    isFetchingNextPage,
    observerTargetRef,
    handleTypeChange,
    handleKeywordChange,
    handleSearch,
    selectedType,
    searchKeyword,
}) => {

    const [openRowId, setOpenRowId] = useState(null);

    const toggleRow = (id) => {
        setOpenRowId((prev) => (prev === id ? null : id));
    }

    return (
        <div>
            <div className="w-full flex justify-end">
                {/* 우측: 필터 버튼들 */}
                <div className="flex items-center space-x-2">
                    <button
                    onClick={() => setStatusFilter("PENDING")}
                    className={`px-3 py-1 rounded-full text-sm flex items-center shadow-sm transition-colors duration-200 
                        ${statusFilter === "PENDING" ? "bg-black text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                    >
                        ✔ New
                    </button>
                    <button
                        onClick={() => setStatusFilter("ALL")}
                        className={`px-3 py-1 rounded-full text-sm shadow-sm transition-colors duration-200 
                        ${statusFilter === "ALL" ? "bg-black text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                    >
                        전체 목록
                    </button>
                    <button
                        onClick={() => setStatusFilter("HOLD")}
                        className={`px-3 py-1 rounded-full text-sm shadow-sm transition-colors duration-200 
                        ${statusFilter === "HOLD" ? "bg-black text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                    >
                        보류 목록
                    </button>
                    <button
                        onClick={() => setStatusFilter("REJECTED")}
                        className={`px-3 py-1 rounded-full text-sm shadow-sm transition-colors duration-200 
                        ${statusFilter === "REJECTED" ? "bg-black text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                    >
                        거절 목록
                    </button>
                    <button
                        onClick={() => setStatusFilter("APPROVED")}
                        className={`px-3 py-1 rounded-full text-sm shadow-sm transition-colors duration-200 
                        ${statusFilter === "APPROVED" ? "bg-black text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                    >
                        승인 목록
                    </button>
                </div>
            </div>
            {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}

            {/* 검색 창 */}
            <div className="w-full max-w-4xl mx-auto flex items-center gap-4 py-4">
                <input
                    type="text"
                    placeholder="검색어를 입력하세요."
                    value={searchKeyword || '' }
                    onChange={handleKeywordChange}
                    required
                    className="flex-1 px-5 py-1 text-lg font-medium border rounded-lg shadow-sm focus:ring focus:ring-blue-500 focus:outline-none"
                />
                <div className="relative flex-shrink-0 w-52">
                    <select
                        value={selectedType || "N"}
                        onChange={handleTypeChange}
                        className="w-full px-4 py-1 text-lg font-medium border rounded-lg shadow-sm bg-white focus:ring focus:ring-blue-500 focus:outline-none"
                    >
                        <option value="N">---</option>
                        <option value="USERID">User ID</option>
                        <option value="UNAME">Username</option>
                        <option value="SHOPNAME">Shop Name</option>
                    </select>
                </div>
                <button
                    onClick={handleSearch}
                    className="flex-shrink-0 px-6 py-1 text-lg font-bold text-white bg-teal-500 rounded-lg shadow-sm hover:bg-teal-600"
                >
                    Pind
                </button>
            </div>
            {/* 검색 창 끝 */}
            
            {/* 대기 목록 표 */}
            <div className="overflow-x-auto mt-3">
                <table className="min-w-full border border-gray-200 text-sm text-left">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr className="text-xs md:text-sm">
                            <th className="px-2 md:px-4 py-2 border">ID</th>
                            <th className="px-2 md:px-4 py-2 border">상태</th>
                            <th className="px-2 md:px-4 py-2 border">사용자</th>
                            <th className="px-2 md:px-4 py-2 border">매장명</th>
                            <th className="px-2 md:px-4 py-2 border">사업자 번호</th>
                            <th className="px-2 md:px-4 py-2 border">전화번호</th>
                            <th className="px-2 md:px-4 py-2 border">대표자</th>
                            <th className="px-2 md:px-3 py-2 border">파일📂</th>
                            <th className="px-2 md:px-4 py-2 border">승인 작업</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData?.map((pending, index ) => {
                            const isOpen = openRowId === pending.tempSellerId;
                            const isLast = index === filteredData.length - 1; // 마지막 요소 확인

                            return (
                                <>
                                    <tr key={pending.tempSellerId}
                                        className="border-t text-xs md:text-sm"
                                        ref={isLast ? observerTargetRef : null}  // 자동으로 다음 페이지 로딩  
                                        onClick={() => toggleRow(pending.tempSellerId)}
                                    >
                                        <td className="px-2 md:px-4 py-2">
                                            <span className="mr-1">{isOpen ? "▼" : "▶"}</span>
                                            {pending.tempSellerId}
                                        </td>
                                        <td className="px-2 md:px-4 py-2">
                                            <span
                                                className={`px-2 py-1 rounded-full text-[10px] md:text-xs border 
                                                    ${pending.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border-yellow-400' : ''}
                                                    ${pending.status === 'APPROVED' ? 'bg-green-100 text-green-800 border-green-500' : ''}
                                                    ${pending.status === 'REJECTED' ? 'bg-red-100 text-red-800 border-red-400' : ''}
                                                    ${pending.status === 'HOLD' ? 'bg-gray-200 text-gray-700 border-gray-300' : ''}
                                                `}
                                            >
                                                {pending.status}
                                            </span>
                                        </td>
                                        <td className="px-2 md:px-4 py-2">
                                            {pending.uname} <br/>
                                            <span className="text-gray-500 text-xs md:inline">({pending.userId})</span>
                                        </td>
                                        <td className="px-2 md:px-4 py-2">{pending.shopName}</td>
                                        <td className="px-2 md:px-4 py-2">{pending.businessNumber}</td>
                                        <td className="px-2 md:px-4 py-2">{pending.phoneNumber}</td>
                                        <td className="px-2 md:px-4 py-2">{pending.bossName}</td>
                                        <td className="px-2 md:px-3 py-2">
                                            {/* 파일 드롭다운 */}
                                            <div className="relative">
                                                <select
                                                    defaultValue=""
                                                    onChange={(e) => {
                                                        const selected = e.target.value
                                                        let fileUrl = ""
                                                        let basePath = ""

                                                        switch (selected) {
                                                            case "business":
                                                                fileUrl = pending.businessCertificateUrl
                                                                basePath = "http://localhost/selleruploads/"
                                                                break;
                                                            case "shop":
                                                                fileUrl = pending.shopImageUrl
                                                                basePath = "http://localhost/shop/Images/"
                                                                break;
                                                            case "sanitation":
                                                                fileUrl = pending.sanitationCertificateUrl
                                                                basePath = "http://localhost/selleruploads/"
                                                                break;
                                                            default:
                                                                return
                                                        }

                                                        if (fileUrl) {
                                                            window.open(`${basePath}${fileUrl}`, "_blank")
                                                        } else {
                                                            alert("파일이 없습니다.")
                                                        }

                                                        // 선택 초기화 (선택 후 자동 초기화되도록)
                                                        e.target.value = "";
                                                    }}
                                                    className="w-full px-2 py-1 text-sm border rounded bg-white shadow-sm"
                                                >
                                                    <option value="" disabled>파일 보기</option>
                                                    <option value="business">사업자 등록증</option>
                                                    <option value="shop">매장 대표 이미지</option>
                                                    <option value="sanitation">위생 인증서</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="px-2 md:px-4 py-2">
                                            {/* 승인 작업 버튼 */}
                                            <div className="flex flex-col md:flex-row gap-1">
                                                {isFetching ? (
                                                    <LoadingSpinner />
                                                ) : (
                                                    <button
                                                        className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                                                        onClick={() => handleApprove(pending.tempSellerId)}
                                                    >
                                                        승인
                                                    </button>
                                                )}
                                                {isFetching ? (
                                                    <LoadingSpinner />
                                                ) : (
                                                    <button
                                                        className="bg-gray-300 text-gray-800 px-2 py-1 rounded text-xs hover:bg-gray-400"
                                                        onClick={() => handleHold(pending.tempSellerId)}
                                                    >
                                                        보류
                                                    </button>
                                                )}
                                                {isFetching ? (
                                                    <LoadingSpinner />
                                                ) : (
                                                    <button
                                                        className="bg-red-400 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                                                        onClick={() => handleReject(pending.tempSellerId)}
                                                    >
                                                        거절
                                                    </button>
                                                )}
                                            </div>
                                            {/* 승인 작업 버튼 끝 */}
                                        </td>
                                    </tr>
                                    {/* 아코디언 상세 정보 행 */}
                                    {isOpen && (
                                        <tr className="bg-gray-50 text-xs text-gray-700">
                                            <td colSpan={9} className="px-4 py-3">
                                                <div className="grid grid-cols-2 gap-y-1 gap-x-4">
                                                    <p><strong>매장 주소:</strong> {pending.address}</p>
                                                    <p><strong>매장 설명:</strong> {pending.mainProductDescription}</p>
                                                    <p><strong>운영 시간:</strong> {pending.openTime} ~ {pending.closeTime}</p>
                                                    <p><strong>오픈일:</strong> {pending.openingDate}</p>
                                                    <p><strong>등록일:</strong> {pending.regDate}</p>
                                                    <p><strong>수정일:</strong> {pending.modDate}</p>
                                                    <p><strong>공개 여부:</strong> {pending.publicInfo ? "공개" : "비공개"}</p>
                                                    <p><strong>가입 방식:</strong> {pending.socialType}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>   
                            );
                        })}

                        {/* 로딩 상태 표시 */}
                        {isFetchingNextPage && (
                            <tr>
                                <td colSpan="9" className="text-center py-2">
                                    <LoadingSpinner />
                                    <p>다음 데이터를 로딩 중입니다...</p>
                                </td>
                            </tr>
                        )}

                    </tbody>
                </table>
            </div>
            {/* 대기 목록 표 끝 */}
            
            {!isFetching && data?.pages[0]?.totalCount === 0 && (
                <div className="flex items-center justify-center py-20">
                    <p className="text-2xl text-gray-500 font-semibold">검색된 내용이 없습니다.</p>
                </div>
            )}

        </div>
    );
}

export default PendingSellerListComponent;