import React, { useEffect, useState } from 'react';
import { getTemperature } from '../../../api/temperatureApi.jsx';
import {Link} from "react-router";

function BuyerProfile({ currentUserUid }) {
    const [temperature, setTemperature] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTemperature = async () => {
            if (!currentUserUid) {
                setError("사용자 정보를 찾을 수 없습니다.");
                // currentUserUid가 없으면 온도를 null로 설정하여 UI가 올바르게 처리되도록 합니다.
                setTemperature(null);
                return;
            }
            setLoading(true);
            setError(""); // 이전 오류 초기화
            try {
                const tem = await getTemperature(currentUserUid);
                // API 응답의 temperature가 유효한 숫자인지 확인하고 설정합니다.
                if (typeof tem?.temperature === 'number') {
                    setTemperature(tem.temperature);
                } else {
                    console.warn("API에서 유효하지 않은 온도 값이 반환되었습니다:", tem);
                    setTemperature(null); // 유효하지 않은 값이면 null로 설정
                    setError("온도 정보를 불러왔으나 유효한 값이 아닙니다.");
                }
            } catch (e) {
                console.error("TemperatureDisplay.fetchTemperature 오류:", e);
                setError("온도 정보를 불러오는 데 실패했습니다.");
                setTemperature(null); // 오류 시 온도 초기화
            } finally {
                setLoading(false);
            }
        };

        fetchTemperature();
    }, [currentUserUid]);

    const calculateTemperatureBarWidth = (tempValue) => {
        const minTemp = 0;
        const maxTemp = 100;
        const percentage = ((tempValue - minTemp) / (maxTemp - minTemp)) * 100;
        return Math.max(0, Math.min(100, percentage));
    };

    // temperature가 숫자인 경우에만 width를 계산합니다.
    const temperatureBarWidth = typeof temperature === 'number' ? calculateTemperatureBarWidth(temperature) : 0;

    return (
        <div className="bg-white rounded-lg p-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-4">
                <div className="flex items-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 mr-4 overflow-hidden">
                        <img
                            src='/cakeImage/default-cake.png'
                            alt="선택된 뱃지"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            <span id="user-id-display">사용자 아이디 불러와야댐</span>
                        </h2>
                        {loading && <p className="text-sm text-gray-500">온도 불러오는 중...</p>}
                        {error && <p className="text-sm text-red-500">{error}</p>}

                        {/* temperature가 숫자일 때만 toFixed 호출합니다.*/}
                        {typeof temperature === 'number' && (
                            <p className="text-sm text-gray-500">
                                <span className="font-semibold text-orange-300">온도 지수: {temperature.toFixed(1)}°C</span>
                            </p>
                        )}
                        {/* temperature가 아직 null이거나 오류 등으로 숫자가 아닌 경우 대체 텍스트를 표시합니다. */}
                        {temperature === null && !loading && !error && (
                            <p className="text-sm text-gray-500">온도 정보를 불러오지 못했습니다.</p>
                        )}
                    </div>
                </div>
                <div className="flex flex-col items-end mt-6 w-2/5">
                    <p className="text-sm mb-1 opacity-80 ">
                        😊{temperature?.toFixed(1)}°C
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-6">
                        <div
                            className={`h-6 rounded-full ${
                                typeof temperature === 'number'
                                    ? temperature < 36.5 ? 'bg-blue-400'
                                        : temperature < 60 ? 'bg-green-500'
                                            : temperature < 90 ? 'bg-orange-400'
                                                : 'bg-red-500'
                                    : 'bg-gray-300'
                            }`}
                            style={{ width: `${temperatureBarWidth}%` }}
                        ></div>
                    </div>
                </div>
                <Link to="details">
                <button className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826 3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    정보 수정
                </button>
                </Link>
            </div>
        </div>
    );
}
export default BuyerProfile;