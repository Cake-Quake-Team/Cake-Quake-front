import LoadingSpinner from "../../common/loadingSpinner";

const BuyerProfileDetailsModifyComponent = ({
    buyerProfile,
    form,
    buttonLoading,
    errorMessage,
    handleChange,
    handlePhoneNumberChange,
    handleModify,
    openVerifyModal,
    isVerified,
    inputRefs
}) => {

    const { userId } = buyerProfile || {}
    const {uname, phoneNumber } = form || {}

    // 아이디랑 휴대폰 번호만 수정 가능.
    // 휴대폰 인증 요청 버튼
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">정보 수정</h2>
                <form onSubmit={handleModify} className="space-y-4">
                    <input
                        type="text"
                        id="userId"
                        name="userId"
                        value={userId}
                        readOnly
                        className="w-full px-4 py-2 border rounded-lg text-gray-400"
                    />
                    <label htmlFor="uname" className="text-sm text-gray-700">이름(닉네임)</label>
                    <input
                        type="text"
                        id="uname"
                        name="uname"
                        placeholder="이름(닉네임)"
                        value={uname}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border-2 border-emerald-300 rounded-lg"
                        ref={inputRefs.uname}
                    />
                    <label htmlFor="phoneNumber" className="text-sm text-gray-700">전화번호</label>
                    <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="전화번호 (010-XXXX-XXXX)"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        required
                        maxLength={13} // 010-1234-5678까지 최대 13자
                        inputMode="numeric" // 모바일 숫자 키패드 유도
                        className="w-full px-4 py-2 border-2 border-emerald-300 rounded-lg"
                        ref={inputRefs.phoneNumber}
                    />
                    {/* 휴대전화 인증 버튼 */}
                    <button
                        type="button"
                        onClick={openVerifyModal}
                        disabled={isVerified} // 인증 완료 시 버튼 비활성화
                        className={`w-full py-2 rounded-lg font-bold ${
                            isVerified
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"  // 비활성 상태 디자인
                            : "bg-blue-100 text-gray-700 hover:bg-blue-200"
                        }`}
                    >
                        {isVerified ? "전화번호 인증 완료" : "전화번호 인증"}
                    </button>
                    <p className="text-sm text-gray-500">전화번호 변경 시에만 새로 인증이 필요합니다.</p>
                    {errorMessage && (
                        <div className="text-red-500 text-sm text-center">{errorMessage}</div>
                    )}

                    {buttonLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-violet-400 text-white font-bold rounded hover:bg-violet-600"
                        >
                            완료
                        </button>
                    )}
                </form>
            </div>
        </div>
    )

}

export default BuyerProfileDetailsModifyComponent;