import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import {useEffect, useState} from "react";
import{getAvailableTimes,getAvailableShops} from "../../api/scheduleApi.jsx";
import ShopSelectionModal from "./ShopSelectionModal.jsx";

function PickupScheduler() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [availableShops, setAvailableShops] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedShop, setSelectedShop] = useState(null);

    const currentShopId = 5;


    // 1. selectedDate 또는 currentShopId가 변경될 때, 예약 가능한 시간 조회
    useEffect(() => {
        if (selectedDate && currentShopId) {
            const fetchTimes = async () => {
                const formattedDate = selectedDate.toISOString().split('T')[0];
                try {
                    const times = await getAvailableTimes(currentShopId, formattedDate);
                    console.log("API에서 받은 시간 목록 (useEffect 내부):", times); // <-- 이 로그는 여기에 두세요.
                    setAvailableTimes(times);
                    // 날짜 변경 시 이전 선택 초기화
                    setSelectedTime(null);
                    setSelectedShop(null);
                    setAvailableShops([]);
                    setIsModalOpen(false);
                } catch (error) {
                    console.error("가능한 시간 조회 중 오류 발생:", error);
                    setAvailableTimes([]);
                    setSelectedTime(null);
                    setSelectedShop(null);
                    setAvailableShops([]);
                    setIsModalOpen(false);
                }
            };
            fetchTimes();
        } else {
            // 날짜가 선택되지 않았을 때 모든 관련 상태 초기화
            setAvailableTimes([]);
            setSelectedTime(null);
            setAvailableShops([]);
            setIsModalOpen(false);
            setSelectedShop(null);
        }
    }, [selectedDate, currentShopId]);

    // 2. selectedDate와 selectedTime이 모두 변경될 때, 예약 가능한 매장 조회 및 모달 열기
    useEffect(() => {
        if (selectedDate && selectedTime) {
            const fetchShops = async () => {
                const formattedDate = selectedDate.toISOString().split('T')[0];
                const formattedTime = selectedTime.length === 5 ? selectedTime + ':00' : selectedTime;

                try {
                    const shops = await getAvailableShops(formattedDate, formattedTime);
                    setAvailableShops(shops);
                    setIsModalOpen(true);
                } catch (error) {
                    console.error("가능한 매장 조회 중 오류 발생:", error);
                    setAvailableShops([]);
                    setIsModalOpen(false);
                }

            };
            fetchShops();
        } else {
            setAvailableShops([]);
            setIsModalOpen(false);
        }
    }, [selectedDate, selectedTime]);

    // --- 핸들러 함수들 ---

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    };

    const handleShopSelect = (shop) => {
        setSelectedShop(shop);
        setIsModalOpen(false);
        alert(`선택된 매장: ${shop.shopName}, 픽업: ${selectedDate.toLocaleDateString()} ${selectedTime}`);
    };

    const tileDisabled = ({ date, view }) => {
        if (view === 'month') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date < today;
        }
        return false;
    };

    return (
        <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '25px' }}>케이크 픽업 예약</h2>

            <div style={{ marginBottom: '25px' }}>
                <h3 style={{ marginBottom: '15px', color: '#555' }}>1. 픽업 날짜 선택:</h3>
                <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    minDate={new Date()}
                    tileDisabled={tileDisabled}
                    locale="ko-KR"
                    className="custom-calendar"
                />
                {selectedDate && (
                    <p style={{ marginTop: '15px', textAlign: 'center', fontSize: '1.1em', fontWeight: 'bold' }}>
                        선택된 날짜: <span style={{ color: '#007bff' }}>{selectedDate.toLocaleDateString('ko-KR')}</span>
                    </p>
                )}
            </div>

            {selectedDate && (
                <div style={{ marginBottom: '25px' }}>
                    <h3 style={{ marginBottom: '15px', color: '#555' }}>2. 픽업 시간 선택:</h3>
                    {/* console.log("availableTimes 상태:", availableTimes); <-- 이 줄을 제거했습니다! */}
                    {availableTimes.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                            {availableTimes.map((time) => (
                                <button
                                    key={time}
                                    onClick={() => handleTimeSelect(time)}
                                    style={{
                                        padding: '12px 18px',
                                        backgroundColor: selectedTime === time ? '#007bff' : '#f0f0f0',
                                        color: selectedTime === time ? 'white' : '#333',
                                        border: '1px solid #ccc',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        fontWeight: selectedTime === time ? 'bold' : 'normal',
                                        transition: 'background-color 0.2s, color 0.2s, transform 0.1s',
                                        boxShadow: selectedTime === time ? '0 2px 5px rgba(0, 123, 255, 0.3)' : 'none'
                                    }}
                                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    {time.substring(0, 5)}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', color: '#888', fontStyle: 'italic' }}>선택하신 날짜에 예약 가능한 시간이 없습니다.</p>
                    )}
                </div>
            )}

            <ShopSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                shops={availableShops}
                onSelectShop={handleShopSelect}
            />

            {selectedShop && selectedDate && selectedTime && (
                <div style={{ marginTop: '30px', padding: '20px', border: '1px dashed #28a745', borderRadius: '8px', backgroundColor: '#e6ffe6', boxShadow: '0 2px 5px rgba(40, 167, 69, 0.2)' }}>
                    <h3 style={{ color: '#28a745', marginBottom: '15px' }}>✅ 최종 픽업 정보 요약:</h3>
                    <p style={{ fontSize: '1.1em', lineHeight: '1.6' }}>
                        <strong style={{ color: '#333' }}>날짜:</strong> <span style={{ color: '#007bff' }}>{selectedDate.toLocaleDateString('ko-KR')}</span>
                        <br />
                        <strong style={{ color: '#333' }}>시간:</strong> <span style={{ color: '#007bff' }}>{selectedTime.substring(0, 5)}</span>
                        <br />
                        <strong style={{ color: '#333' }}>매장:</strong> <span style={{ color: '#007bff' }}>{selectedShop.shopName}</span> ({selectedShop.address})
                    </p>
                    <button
                        style={{
                            marginTop: '20px',
                            padding: '12px 25px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 8px rgba(40, 167, 69, 0.3)',
                            transition: 'background-color 0.3s, transform 0.2s'
                        }}
                        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        주문 진행하기
                    </button>
                </div>
            )}
        </div>
    );
}

export default PickupScheduler;

