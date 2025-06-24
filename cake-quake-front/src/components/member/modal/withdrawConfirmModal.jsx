import { useState } from 'react';
import LoadingSpinner from '../../common/loadingSpinner';
import { verifyPassword } from '../../../api/authApi';
import { withdrawBuyer, withdrawSeller } from '../../../api/memberApi';
import { useAuth } from '../../../store/AuthContext';
import { useNavigate } from 'react-router';

// 비밀번호 확인 후 탈퇴하는 모달 창
const WithdrawConfirmModal = ({ isOpen, onClose }) => {
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [msg, setMsg] = useState("")
    const [error, setError] = useState("")

    const {user, signOut} = useAuth()
    const navigate = useNavigate()


    // 로그아웃
    const handleSignOut = async () => {
        await signOut() // 쿠키 제거
        navigate('/')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setIsLoading(true)
            // 비밀번호 확인
            await verifyPassword({ password })
            
            setPassword('') // 입력 초기화

            // 역학에 따라 탈퇴 처리 분리
            let res
            if (user?.role === 'SELLER') {
                res = await withdrawSeller() // seller 탈퇴 API
                console.log("Seller 탈퇴 api 호출")
            } else {
                res = await withdrawBuyer() // buyer 탈퇴 API
                console.log("buyer 탈퇴 api 호출")
            }
            setMsg(res.message)

            setTimeout(() => {
                handleSignOut()
                onClose()
            }, 3000) // 3초 후 자동 로그아웃.
            
            
        } catch (error) {
            let errorMessage
            if (error?.response?.data?.message === "비밀번호가 조건에 불충족할 경우") {
                errorMessage = "비밀번호가 틀렸습니다."
            } else {
                errorMessage = "비밀번호 확인 실패 또는 탈퇴 오류"
            }
            setError(errorMessage)
            console.error(error)
        } finally{
            setIsLoading(false) // 성공/실패 관계없이 로딩 종료
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            style={{ backgroundColor: 'rgba(169, 169, 169, 0.7)' }}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                {!msg && (
                <>
                    <h2 className="text-xl font-bold mb-4 text-red-500">정말 탈퇴하시겠습니까?</h2>
                    {user?.role === 'SELLER' && (
                        <div className=" font-bold mb-4 text-red-500">매장 정보도 함께 삭제됩니다.</div>
                    )}
                    <h2 className="text-lg mb-4">비밀번호 확인:</h2>
                </>
                )}
                {/* 탈퇴 완료 메시지 표시 */}
                {msg ? (
                    <p className="text-green-600 text-center">{msg}</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="비밀번호를 입력하세요"
                            className="border p-2 w-full mb-4"
                            required
                        />
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : (
                            <div className="flex justify-end">
                                <button 
                                    type="submit"
                                    className="w-full bg-blue-400 text-white py-2 rounded hover:bg-blue-600"
                                >
                                    확인
                                </button>
                            </div>
                        )}
                    </form>
                )}

                {/* 닫기 버튼은 메시지가 없을 때만 표시 */}
                {!msg && (
                    <button
                        onClick={onClose}
                        className="px-6 py-2 mt-5 text-white font-semibold rounded-lg shadow-md transition duration-300 mx-auto block"
                        style={{ backgroundColor: '#FFE3A9', color: '#333' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FFD278'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FFE3A9'}
                    >
                        닫기
                    </button>
                )}
            </div>
        </div>
    )
}

export default WithdrawConfirmModal;