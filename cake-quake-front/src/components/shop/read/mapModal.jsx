import { useEffect, useState, useRef } from "react";
import AlertModal from "../../common/AlertModal.jsx";

function useKakaoMapScript(appKey) {
    const [scriptReady, setScriptReady] = useState(false);

    useEffect(() => {
        const SCRIPT_ID = "kakao-map-sdk";
        let script = document.getElementById(SCRIPT_ID);

        // 스크립트가 이미 로드되었는지 확인 (비동기 라이브러리 로딩 상태까지 포함)
        if (window.kakao && window.kakao.maps) {
            // 라이브러리 로드가 완료되었는지 확인
            if (window.kakao.maps.services && window.kakao.maps.services.Geocoder) {
                setScriptReady(true);
                return;
            }
        }

        if (!script) {
            script = document.createElement("script");
            script.id = SCRIPT_ID;
            script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services&autoload=false`;
            script.async = true;
            script.onerror = () => console.error("❌ Kakao SDK 스크립트 로드 실패");
            document.head.appendChild(script);
        }

        // 카카오맵 SDK와 라이브러리 로드 완료를 보장하는 콜백 함수
        const handleLoad = () => {
            window.kakao.maps.load(() => {
                setScriptReady(true);
            });
        };

        // 스크립트 로드 이벤트 리스너 추가
        script.addEventListener("load", handleLoad);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            script.removeEventListener("load", handleLoad);
        };

    }, []);

    return scriptReady;
}

function MapModal({ address, onClose }) {

    const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_APP_KEY;
    const scriptReady = useKakaoMapScript(KAKAO_APP_KEY);

    const mapRef = useRef(null);
    const markerRef = useRef(null);

    const [formError, setFormError] = useState(null);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => setShowError(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showError]);

    // 2) scriptReady가 true 이고 address가 있을 때 지도 렌더링
    useEffect(() => {
        // scriptReady 상태가 true가 될 때까지 기다림
        if (!scriptReady || !address) {
            return;
        }

        const geocoder = new window.kakao.maps.services.Geocoder();
        const container = document.getElementById("map");

        if (!container) {
            console.error("❌ 지도 컨테이너(id='map')를 찾을 수 없습니다.");
            return;
        }

        // 주소 검색
        geocoder.addressSearch(address, function (result, status) {
            if (status === window.kakao.maps.services.Status.OK) {
                const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

                //  기존 지도 객체가 없으면 새로 생성, 있으면 중심만 이동
                if (!mapRef.current) {
                    const options = { center: coords, level: 3 };
                    mapRef.current = new window.kakao.maps.Map(container, options);
                } else {
                    mapRef.current.setCenter(coords);
                }

                // 기존 마커 객체가 없으면 새로 생성, 있으면 위치만 변경
                if (!markerRef.current) {
                    markerRef.current = new window.kakao.maps.Marker({
                        map: mapRef.current,
                        position: coords,
                    });
                } else {
                    markerRef.current.setPosition(coords);
                }

            } else {
                console.error("주소 검색 실패:", status);
                setFormError({message: `주소 '${address}'에 대한 위치 정보를 찾을 수 없습니다.`, type: 'error'});
                setShowError(true);
            }
        });

        // Cleanup 함수
        return () => {
            if (mapRef.current) {
                if (markerRef.current) markerRef.current.setMap(null);
            }
        };

    }, [scriptReady, address]);

    return (
        <div className="fixed top-30 right-8 z-50 w-[95%] max-w-lg">
            {showError && formError && (
                <AlertModal
                    message={formError.message}
                    type={formError.type || "error"}
                    show={showError}
                />
            )}
            <div className="bg-white rounded-2xl shadow-2xl p-6">
                <div
                    id="map"
                    style={{ width: "100%", height: "300px" }}
                    className="mb-6 rounded-lg overflow-hidden border border-gray-200"
                >
                    {!scriptReady && (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                            지도 로딩 중...
                        </div>
                    )}
                </div>
                {/* 닫기 버튼 */}
                <button
                    className="mt-6 w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
                    onClick={onClose}
                >
                    닫기
                </button>
            </div>
        </div>
    );
}

export default MapModal;