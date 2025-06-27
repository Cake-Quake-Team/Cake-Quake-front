import LoadingSpinner from "../../common/loadingSpinner";

const SignupSellerStep1Component = ({
    form,
    isLoading,
    errorMessage,
    handleChange,
    handlePhoneNumberChange,
    handleVerifyBusiness,
    handleBusinessFileChange,
    handleSubmit,
    openVerifyModal,
    isVerified,
    isBusinessVerified,
    inputRefs
}) => {

    const { userId, password, verifyPassword, uname, phoneNumber, publicInfo, businessNumber, bossName, openingDate, shopName } = form

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md mt-5">
                <h2 className="text-2xl font-bold mb-6 text-center">판매자 회원가입</h2>
                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="text"
                        id="userId"
                        name="userId"
                        value={userId}
                        onChange={handleChange}
                        placeholder="아이디"
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                        ref={inputRefs.userId}
                    />
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        placeholder="비밀번호"
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                        ref={inputRefs.password}
                    />

                    <input
                        type="password"
                        id="verifyPassword"
                        name="verifyPassword"
                        placeholder="비밀번호 확인"
                        value={verifyPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    {password !== verifyPassword && (
                        <p className="text-sm text-red-500">비밀번호가 서로 일치하지 않습니다.</p>
                    )}

                    <input
                        type="text"
                        id="uname"
                        name="uname"
                        placeholder="이름(닉네임)"
                        value={uname}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                        ref={inputRefs.uname}
                    />
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
                        className="w-full px-4 py-2 border rounded-lg"
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

                    <input
                        type="text"
                        id="shopName"
                        name="shopName"
                        value={shopName}
                        onChange={handleChange}
                        placeholder="상호명"
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                        ref={inputRefs.shopName}
                    />

                    <hr />
                    <div>
                        * 사업자 등록 번호, 대표자명, 개업일자는 사업자 등록 조회에 필수입니다.
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                        <input
                            type="text"
                            id="businessNumber"
                            name="businessNumber"
                            value={businessNumber}
                            onChange={handleChange}
                            placeholder="사업자등록번호(숫자10자리)"
                            className="w-full p-2 border rounded-lg"
                            ref={inputRefs.businessNumber}
                        />
                        <input
                            type="text"
                            id="bossName"
                            name="bossName"
                            value={bossName}
                            onChange={handleChange}
                            placeholder="대표자명"
                            className="w-full p-2 border rounded-lg"
                        />
                        {/* 나중에 보고 달력 입력으로 변경 */}
                        <input
                            type="text"
                            id="openingDate"
                            name="openingDate"
                            value={openingDate}
                            onChange={handleChange}
                            placeholder="개업일자 (YYYYMMDD)"
                            className="w-full p-2 border rounded-lg"
                            ref={inputRefs.isBusinessVerified}
                        />

                        <button
                            type="button"
                            onClick={handleVerifyBusiness}
                            disabled={isBusinessVerified}
                            className={`w-full py-2 rounded-lg font-bold ${
                                isBusinessVerified
                                ? "bg-green-100 text-green-700 cursor-not-allowed"
                                : "bg-blue-100 text-gray-700 hover:bg-blue-200"
                            }`}
                        >
                            {isBusinessVerified ? "사업자 등록 인증 완료" : "사업자 등록 조회"}
                        </button>
                    </div>

                    <div>
                        <label htmlFor="businessCertificate" className="block mb-1 font-medium">사업자 등록증 첨부</label>
                        <input
                            type="file"
                            id="businessCertificate"
                            name="businessCertificate"
                            accept="image/*"
                            onChange={handleBusinessFileChange}
                            className="w-full p-2 border rounded"
                            ref={inputRefs.businessCertificate}
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="publicInfo"
                            name="publicInfo"
                            checked={publicInfo}
                            onChange={handleChange}
                            className="mr-2"
                            ref={inputRefs.publicInfo}
                        />
                        <label htmlFor="publicInfo" className="text-sm text-gray-700">[필수] 개인정보 수집 밎 이용 동의</label>
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
                            다음 단계로
                        </button>
                    )}
                </form>
            </div>
        </div>


    )
}

export default SignupSellerStep1Component;
