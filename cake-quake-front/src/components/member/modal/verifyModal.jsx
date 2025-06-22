import { useState } from "react"
import LoadingSpinner from "../../common/loadingSpinner"
import { getVerificationCode, verifyCode } from "../../../api/authApi"

const VerifyModal = ({ phoneNumber, type, onClose, onSuccess }) => {

    const [isLoading, setIsLoading] = useState(false)

    const [code, setCode] = useState("")
    const [sent, setSent] = useState(false)
    const [modalMsg, setModalMsg] = useState("")
    const [error, setError] = useState("")

    const [serverCode, setServerCode] = useState("")

    // 인증 코드 발송
    const handleSendCode = async () => {
        try {
            setIsLoading(true)
            const res = await getVerificationCode({
                phoneNumber,
                type
            })
            console.log(res)
            setServerCode(res.data.verificationCode)
            setModalMsg("") // 이전 메시지 초기화
            setSent(true)
        } catch (err) {
            const errorMessage = err.response.data?.message || "인증 코드 전송 실패"
            setError(errorMessage)
        }  finally{
            setIsLoading(false) // 성공/실패 관계없이 로딩 종료
        }
    }

    // 코드 검증
    const handleVerify = async () => {
        try {
            const res = await verifyCode({ 
                phoneNumber,
                code: String(code),
                type
            })
            setModalMsg(res.message)

            // 잠시 후 onSuccess 실행
            setTimeout(() => {
                onSuccess() // 예: setIsVerified(true)
                onClose()
            }, 1500) // 1.5초 후 자동 종료
        } catch {
            setError("인증 실패")
        }
    }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
        style={{ backgroundColor: 'rgba(169, 169, 169, 0.7)' }}>
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">휴대폰 인증</h2>
            {/* 인증 완료 메시지 표시 */}
            {modalMsg ? (
                <p className="text-green-600 text-center">{modalMsg}</p>
            ) : (
                <>
                    {sent && serverCode && (
                        <p className="mt-2 text-sm text-gray-500">
                            [개발용] 인증코드: <span className="font-mono">{serverCode}</span>
                        </p>
                    )}

                    {!sent ? (
                        <button
                            onClick={handleSendCode}
                            className="w-full bg-blue-400 text-white py-2 rounded hover:bg-blue-600"
                        >
                            인증 코드 전송
                        </button>
                    ) : (
                        <>
                            <input
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="인증 코드 입력"
                                className="w-full border px-4 py-2 rounded mb-2"
                            />
                            {isLoading ? (
                                <LoadingSpinner />
                            ) : (
                                <button
                                    onClick={handleVerify}
                                    className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                                >
                                    인증 확인
                                </button>
                            )}
                        </>
                    )}

                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </>
            )}

            {/* 닫기 버튼은 항상 표시 */}
            <button
                onClick={onClose}
                className="px-6 py-2 mt-5 text-white font-semibold rounded-lg shadow-md transition duration-300 mx-auto block"
                style={{ backgroundColor: '#FFE3A9', color: '#333' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FFD278'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FFE3A9'}
            >
                닫기
            </button>
        </div>
    </div>

  )
}

export default VerifyModal;