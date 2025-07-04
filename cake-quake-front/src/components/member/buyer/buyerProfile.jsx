import React, { useEffect, useState } from 'react';
import { getTemperature } from '../../../api/temperatureApi.jsx';
import {Link} from "react-router";
import {getBuyerProfile} from "../../../api/memberApi.js";

function BuyerProfile( ) {
    const [temperature, setTemperature] = useState(null); // 온도 데이터 저장
    const [loading, setLoading] = useState(true); //전체 로딩 상태
    const [error, setError] = useState(""); //오류 메시지 저장
    const [buyerProfile,setBuyerProfile] = useState(null); //사용자 프로필 데이터 저장(uname,uid)


    useEffect(()=>{
        const fetchAllProfileData = async ()=>{
            setLoading(true);
            setError("");

            try{
                // 사용자 프로필 가지고 옴
                const profileApiResponse =await getBuyerProfile();
                console.log("getBuyerProfile 응답 : ", profileApiResponse);

                if (profileApiResponse.success && profileApiResponse.data) {
                    const fetchedProfileData = profileApiResponse.data;
                    setBuyerProfile(fetchedProfileData); // 가져온 프로필 데이터를 상태에 저장

                    // profileData에서 uid를 추출하여 온도 정보를 가져오는 데 사용합니다.
                    const userUid = fetchedProfileData.uid;
                    console.log("프로필에서 추출된 UID:", userUid);

                    // 2. 추출된 UID를 사용하여 온도 정보를 가져옵니다.
                    if (userUid) {
                        const tempApiResponse = await getTemperature(userUid); // 추출된 UID 사용
                        console.log("getTemperature 응답:", tempApiResponse);

                        // API 응답의 temperature가 유효한 숫자인지 확인하고 설정합니다.
                        if (typeof tempApiResponse?.temperature === 'number') {
                            setTemperature(tempApiResponse.temperature);
                        } else {
                            console.warn("API에서 유효하지 않은 온도 값이 반환되었습니다:", tempApiResponse);
                            setTemperature(null);
                            setError("온도 정보를 불러왔으나 유효한 값이 아닙니다.");
                        }
                    } else {
                        setError("사용자 UID를 찾을 수 없어 온도 정보를 불러올 수 없습니다.");
                        setTemperature(null);
                    }
                } else {
                    // 프로필 조회 실패 시 에러 처리
                    setError(profileApiResponse.message || "사용자 프로필을 불러오는데 실패했습니다.");
                    setBuyerProfile(null);
                    setTemperature(null);
                }
            } catch (e) {
                console.error("BuyerProfile 데이터 페칭 오류:", e);
                setError("프로필 및 온도 정보를 불러오는 데 실패했습니다.");
                setBuyerProfile(null);
                setTemperature(null);
            } finally {
                setLoading(false); // 모든 데이터 페칭 완료 (성공/실패 무관)
            }

        };
        fetchAllProfileData();
    },[])

    // 온도 바 너비 계산 함수
    const calculateTemperatureBarWidth = (tempValue) => {
        const minTemp = 0;
        const maxTemp = 100;
        const percentage = ((tempValue - minTemp) / (maxTemp - minTemp)) * 100;
        return Math.max(0, Math.min(100, percentage));
    };

    // temperature가 숫자인 경우에만 width를 계산합니다.
    const temperatureBarWidth = typeof temperature === 'number' ? calculateTemperatureBarWidth(temperature) : 0;

    // 로딩 중일 때 표시
    if (loading) {
        return (
            <div className="bg-white rounded-lg p-6 text-center text-gray-500">
                <p>프로필 및 온도 정보를 불러오는 중...</p>
            </div>
        );
    }

    // 에러가 발생했거나, 로딩 후 프로필 데이터가 없을 때 표시
    if (error || !buyerProfile) {
        return (
            <div className="bg-white rounded-lg p-6 text-center text-red-500">
                <p>{error || "사용자 프로필을 불러올 수 없습니다."}</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg p-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-4">
                <div className="flex items-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 mr-4 overflow-hidden">
                        <Link to="badges">
                            <img
                                src='/cakeImage/default-cake.png'
                                alt="선택된 뱃지"
                                className="w-full h-full object-cover"
                            />
                        </Link>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            <span id="user-id-display">{buyerProfile.uname || '사용자'}</span>
                        </h2>

                        {loading && <p className="text-sm text-gray-500">온도 불러오는 중...</p>}
                        {error && <p className="text-sm text-red-500">{error}</p>}

                        {/* temperature가 숫자일 때만 toFixed 호출합니다.*/}
                        {typeof temperature === 'number' && (
                            <p className="text-sm text-gray-500">
                                <Link to="/buyer/profile/temperature" className="font-semibold text-orange-300 hover:underline">
                                    온도 지수: {temperature.toFixed(1)}°C
                                </Link>
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