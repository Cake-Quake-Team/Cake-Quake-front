import { useEffect } from "react";
import LoadingSpinner from "../../common/loadingSpinner";


const SignupBuyerComponent = ({
    form,
    isLoading,
    errorMessage,
    handleChange,
    handlePhoneNumberChange,
    handleSubmit,
    openVerifyModal,
    isVerified
}) => {

    const { userId, password, verifyPassword, uname, phoneNumber, publicInfo, alarm } = form

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        id="userId"
                        name="userId"
                        placeholder="아이디"
                        value={userId}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg"
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

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="publicInfo"
                            name="publicInfo"
                            checked={publicInfo}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <label htmlFor="publicInfo" className="text-sm text-gray-700">[필수] 개인정보 수집 밎 이용 동의</label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="alarm"
                            name="alarm"
                            checked={alarm}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <label htmlFor="alarm" className="text-sm text-gray-700">알림 수신 동의</label>
                    </div>

                    {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}

                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <button
                            type="submit"
                            className="w-full bg-rose-100 text-gray-700 py-2 rounded-lg hover:bg-rose-200 font-bold"
                        >
                            회원가입
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}

export default SignupBuyerComponent;
