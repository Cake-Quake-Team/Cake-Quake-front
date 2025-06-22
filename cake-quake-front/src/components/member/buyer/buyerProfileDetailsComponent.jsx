
const BuyerProfileDetailsComponent = ({
    isLoading,
    errorMessage,
    buyerData,
    handleModifyProfile,
    handleAlarmSettings,
    handleWithdraw,
    handleChangePw,
}) => {

    if (isLoading) return <p>로딩 중입니다...</p>
    if (errorMessage) return <p className="text-red-500">{errorMessage}</p>
    if (!buyerData) return null

    const { userId, uname, phoneNumber, alarm } = buyerData

    return(
        <div className="max-w-3xl mx-auto mt-5 p-4 bg-white shadow-md rounded-lg space-y-4">
            <h2 className="text-3xl font-bold text-center text-gray-800">My Profile</h2>

            <div className="space-y-4">
                <p className="text-lg"><strong>아이디:</strong> <span className="text-gray-700">{userId}</span></p>
                <p className="text-lg"><strong>닉네임:</strong> <span className="text-gray-700">{uname}</span></p>
                <p className="text-lg"><strong>전화번호:</strong> <span className="text-gray-700">{phoneNumber}</span></p>
                <p className="text-lg"><strong>알림 상태:</strong> <span className="text-gray-700">{alarm ? 'on' : 'off'}</span></p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 justify-center items-center mt-4">
                <button 
                    className="w-28 aspect-square flex items-center justify-center border border-indigo-500 text-indigo-500 rounded-full hover:bg-indigo-50 text-sm font-semibold"
                    onClick={handleModifyProfile}
                    >
                    정보 수정
                </button>
                <button
                    className="w-28 aspect-square flex items-center justify-center border border-indigo-500 text-indigo-500 rounded-full hover:bg-indigo-50 text-sm font-semibold"
                    onClick={handleChangePw}
                >
                    비밀번호 변경
                </button>
                <button
                    className="w-28 aspect-square flex items-center justify-center border border-indigo-500 text-indigo-500 rounded-full hover:bg-indigo-50 text-sm font-semibold"
                    onClick={handleAlarmSettings}
                >
                    알람 설정
                </button>
            </div>

            {/* 탈퇴 버튼 */}
            <div className="flex justify-end mt-4">
                <button
                    onClick={handleWithdraw}
                    className="text-xs px-2 py-1 border border-red-500 text-red-500 rounded-lg hover:bg-red-50">
                    탈퇴
                </button>
            </div>

      </div>
    )
}

export default BuyerProfileDetailsComponent;