import LoadingSpinner from "../../common/loadingSpinner";

const ChangePasswordComponent = ({
    form,
    isLoading,
    errorMessage,
    handleChange,
    handleSubmit,
}) => {

    const { currentPassword, newPassword, verifyPassword } = form

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">비밀번호 변경</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <label htmlFor="currentPassword" className="text-sm text-gray-700">현재 비밀번호</label>
                    <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        placeholder="비밀번호"
                        value={currentPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    <label htmlFor="newPassword" className="text-sm text-gray-700">새 비밀번호</label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        placeholder="새 비밀번호"
                        value={newPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    <label htmlFor="verifyPassword" className="text-sm text-gray-700">비밀번호 확인</label>
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
                    {newPassword !== verifyPassword && (
                        <p className="text-sm text-red-500">비밀번호가 서로 일치하지 않습니다.</p>
                    )}

                    {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}

                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <button
                            type="submit"
                            className="w-full bg-rose-100 text-gray-700 py-2 rounded-lg hover:bg-rose-200 font-bold"
                        >
                            변경하기
                        </button>
                    )}
                </form>
            </div>
        </div>
    )
}

export default ChangePasswordComponent;