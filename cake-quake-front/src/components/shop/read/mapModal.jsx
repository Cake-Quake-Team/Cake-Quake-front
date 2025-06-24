import { useEffect, useState } from "react";

function MapModal({ address, onClose }) {
    console.log("MapModal 렌더링");
    const [loaded, setLoaded] = useState(false);

    // 1) 스크립트 로딩 + window.kakao 존재 확인
    useEffect(() => {
        console.log("useEffect: 스크립트 로딩 시작");

        const existingScript = document.getElementById("kakao-map-script");
        if (!existingScript) {
            const script = document.createElement("script");
            script.id = "kakao-map-script";
            script.src =
                "https://dapi.kakao.com/v2/maps/sdk.js?appkey=ce53977cec71e784179bc9105edf27ff&libraries=services";
            script.async = true;

            script.onload = () => {
                console.log("✅ Kakao SDK 스크립트 로드 완료");
                checkKakaoObject();
            };

            script.onerror = () => {
                console.error("❌ Kakao SDK 스크립트 로드 실패");
            };

            document.head.appendChild(script);
        } else {
            checkKakaoObject();
        }

        // window.kakao 객체 생성을 최대 10번 (1초간격)까지 확인하는 함수
        function checkKakaoObject() {
            let count = 0;
            const intervalId = setInterval(() => {
                count++;
                if (window.kakao && window.kakao.maps) {
                    console.log("✅ window.kakao 객체 확인됨");
                    clearInterval(intervalId);
                    setLoaded(true);
                } else if (count > 10) {
                    clearInterval(intervalId);
                    console.error("❌ window.kakao 객체가 생성되지 않았습니다.");
                }
            }, 100);
        }
    }, []);

    // 2) loaded 가 true 이고 address가 있을 때 지도 렌더링
    useEffect(() => {
        if (!loaded || !address) return;

        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(address, function (result, status) {
            if (status === window.kakao.maps.services.Status.OK) {
                const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

                const container = document.getElementById("map");
                const options = {
                    center: coords,
                    level: 3,
                };

                const map = new window.kakao.maps.Map(container, options);

                new window.kakao.maps.Marker({
                    map,
                    position: coords,
                });
            } else {
                console.error("주소 검색 실패:", status);
            }
        });
    }, [loaded, address]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 w-[90%] max-w-md">
                <div id="map" style={{ width: "100%", height: "300px" }}></div>
                <button
                    className="mt-4 w-full bg-blue-500 text-white py-2 rounded"
                    onClick={onClose}
                >
                    닫기
                </button>
            </div>
        </div>
    );
}

export default MapModal;
