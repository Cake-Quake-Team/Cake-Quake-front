import LoadingSpinner from "../../common/loadingSpinner";


const SignupSellerStep2Component = ({
    form,
    isLoading,
    handleChange,
    handleFileChange,
    errorMessage,
    handleSubmit,
    previewUrl,
    AddressPopupButton
}) => {

    const { shopPhoneNumber, openTime, closeTime, mainProductDescription } = form

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-xl mt-5">
                <h2 className="text-2xl font-bold mb-6 text-center">판매자 회원가입</h2>
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="flex flex-col items-center space-y-4">
                        {/* 원형 이미지 미리보기 */}
                        <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                            {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="미리보기"
                                className="object-cover w-full h-full"
                            />
                            ) : (
                            <span className="text-sm text-gray-500">미리보기 없음</span>
                            )}
                        </div>

                            
                        <label htmlFor="shopImage" className="block mb-1 font-medium">매장 이미지 추가</label>
                        {/* 파일 입력 */}
                        <input
                            id="shopImage"
                            name="shopImage"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>

                    <div>
                        <label htmlFor="shopAddress" className="block mb-1 font-medium">매장 주소</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                id="shopAddress"
                                name="shopAddress"
                                value={form.shopAddress}
                                onChange={handleChange}
                                placeholder="주소를 선택해주세요"
                                className="w-full p-2 border rounded-lg text-sm leading-snug break-words"
                                readOnly
                            />
                            {/* 부모 컴포넌트에서 받은 버튼 */}
                            {AddressPopupButton}
                        </div>

                        <label htmlFor="shopAddressDetail" className="block mt-3 mb-1 font-medium">상세 주소</label>
                        <input
                            type="text"
                            id="shopAddressDetail"
                            name="shopAddressDetail"
                            value={form.shopAddressDetail}
                            onChange={handleChange}
                            placeholder="상세 주소를 입력해주세요 (예: 101동 1001호)"
                            className="w-full text-sm p-2 border rounded-lg"
                        />
                    </div>

                    <label htmlFor="shopPhoneNumber" className="block mt-3 mb-1 font-medium">※매장 전화는 생략 가능 합니다.</label>
                    <input
                        type="text"
                        id="shopPhoneNumber"
                        name="shopPhoneNumber"
                        value={shopPhoneNumber}
                        onChange={handleChange}
                        placeholder="매장 전화번호 (051-XXX(X)-XXXX)"
                        maxLength={14}
                        inputMode="numeric" // 모바일 숫자 키패드 유도
                        className="w-full px-4 py-2 border rounded-lg"
                    />

                    <div>
                        <label htmlFor="openTime" className="block mb-1 font-medium text-gray-500">영업 시작 시각(오전 10:00)</label>
                        <input
                            type="time"
                            id="openTime"
                            name="openTime"
                            value={openTime}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>

                    <div>
                        <label htmlFor="closeTime" className="block mb-1 font-medium text-gray-500">영업 종료 시각(오후 09:00)</label>
                        <input
                            type="time"
                            id="closeTime"
                            name="closeTime"
                            placeholder="영업 종료 시각"
                            value={closeTime}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>

                    <div>
                        <label htmlFor="mainProductDescription"
                            className="block mb-1 font-medium text-gray-500">주요 제품 설명은 10~200자 사이로 적어주세요.</label>
                        <textarea
                            id="mainProductDescription"
                            name="mainProductDescription"
                            value={mainProductDescription}
                            onChange={handleChange}
                            placeholder="주요 제품 설명"
                            required
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label htmlFor="sanitationCertificate"
                            className="block mb-1 font-medium">[선택]매장 위생 관련 인증서 추가</label>
                        <input
                            id="sanitationCertificate"
                            name="sanitationCertificate"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {errorMessage && (
                        <div className="text-red-500 text-sm text-center">{errorMessage}</div>
                    )}

                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-violet-400 text-white font-bold rounded hover:bg-violet-600"
                        >
                            회원 가입 승인 요청 접수
                        </button>
                    )}
                </form>
            </div>
        </div>


    )
}

export default SignupSellerStep2Component;
