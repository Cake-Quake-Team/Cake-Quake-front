import LoadingSpinner from "../../common/loadingSpinner";

const BuyerProfileDetailsAlarmComponent = ({
    buyerProfile,
    form,
    buttonLoading,
    errorMessage,
    handleChange,
    handleModify,
}) => {

    const { userId } = buyerProfile || {}
    const { allAlarm } = form || {}

    return(
        <div className="mt-5 flex items-center justify-center bg-white">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-center">알람 설정</h2>
                <div className="flex items-center mb-4">
                    <label className="inline-flex items-center cursor-pointer">
                        <span className="mr-3 text-sm font-bold text-gray-900">전체 알람</span>

                        <input
                            type="checkbox"
                            className="sr-only peer"
                            name="allAlarm"
                            checked={allAlarm}
                            onChange={handleChange}
                        />

                        <div
                            className={`
                                w-11 h-6 rounded-full bg-gray-300 peer-checked:bg-blue-600
                                relative transition-colors duration-300
                                after:content-[''] after:absolute after:top-0.5 after:left-0.5
                                after:bg-white after:border-gray-300 after:border after:rounded-full
                                after:h-5 after:w-5 after:transition-all
                                peer-checked:after:translate-x-5
                            `}
                        ></div>
                    </label>
                </div>
                {errorMessage && (
                    <div className="text-red-500 text-sm text-center">{errorMessage}</div>
                )}
                <button
                    onClick={handleModify}
                    disabled={buttonLoading}
                    className={"w-full mt-5 px-4 py-2 bg-violet-400 text-white font-bold rounded hover:bg-violet-600"}
                >
                    {buttonLoading ? <LoadingSpinner /> : '수정 완료'}
                </button>
            </div>
        </div>
    )
}

export default BuyerProfileDetailsAlarmComponent;