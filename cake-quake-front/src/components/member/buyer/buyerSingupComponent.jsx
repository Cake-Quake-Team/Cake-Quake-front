import { useState } from "react";
import { useNavigate } from "react-router";

const BuyerSignupComponent = () => {
    const [userId, setUserId] = useState("")
    const [password, setPassword] = useState("")
    const [verifyPassword, setVerifyPassword] = useState("")
    const [uname, setUname] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [publicInfo, setPublicInfo] = useState("")
    const [alarm, setAlarm] = useState(false)
    const [jointype, setJointype] = useState("basic")
    const [errorMessage, setErrorMessage] = useState("")

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage("")

        if (password !== verifyPassword) {
            setErrorMessage("비밀번호가 서로 일치하지 않습니다.");
            return;
        }

        const signupData = {
            userId,
            password,
            uname,
            phoneNumber,
            publicInfo,
            alarm,
        }

        try {
            // 여기에 axios 호출
            console.log("회원 가입 성공", signupData)
            navigate("/auth/signin")
        } catch (err) {
            const msg = err?.response?.data?.message || "회원가입 중 오류가 발생했습니다."
            setErrorMessage(msg)
            console.error("회원 가입 실패", err)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        id="userId"
                        type="text"
                        placeholder="아이디"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    <input
                        type="password"
                        placeholder="비밀번호 확인"
                        value={verifyPassword}
                        onChange={(e) => setVerifyPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    {password !== verifyPassword && (
                        <p className="text-sm text-red-500">비밀번호가 서로 일치하지 않습니다.</p>
                    )}
                    <input
                        type="text"
                        placeholder="이름(닉네임)"
                        value={uname}
                        onChange={(e) => setUname(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    <input
                        type="text"
                        placeholder="전화번호. 예) 010-0000-0000"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="publicInfo"
                            checked={publicInfo}
                            onChange={(e) => setPublicInfo(e.target.checked)}
                            className="mr-2"
                        />
                        <label htmlFor="publicInfo" className="text-sm text-gray-700">[필수] 개인정보 수집 밎 이용 동의</label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="alarm"
                            checked={alarm}
                            onChange={(e) => setAlarm(e.target.checked)}
                            className="mr-2"
                        />
                        <label htmlFor="alarm" className="text-sm text-gray-700">알림 수신 동의</label>
                    </div>

                    {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}

                    <button
                        type="submit"
                        className="w-full bg-rose-100 text-gray-700 py-2 rounded-lg hover:bg-rose-200 font-bold"
                    >
                        회원가입
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BuyerSignupComponent;
