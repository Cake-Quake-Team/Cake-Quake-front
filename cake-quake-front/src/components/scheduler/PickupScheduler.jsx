import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import {useCallback, useEffect, useState} from "react";
import{getAvailableTimes,getAvailableShops} from "../../api/scheduleApi.jsx";
import ShopSelectionModal from "./ShopSelectionModal.jsx";
import {useNavigate, useParams} from "react-router";

function PickupScheduler() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableShops, setAvailableShops] = useState([]);
    const [selectedShop, setSelectedShop] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null); // 사용자가 선택한 최종 시간

    const now = new Date();
    // --- 이벤트 핸들러 ---
    const handleCalendarDateChange = async (date) => {
        setSelectedDate(date);
        setSelectedShop(null); // 날짜 변경 시 매장 및 시간 초기화
        setSelectedTime(null);

        const dateString = date.toISOString().split('T')[0];

        try {
            const shops = await getAvailableShops(dateString);
            setAvailableShops(shops);
        } catch (error) {
            console.error('예약 가능한 매장 조회 실패:', error);
            alert('예약 가능한 매장을 불러오는 데 실패했습니다.');
            setAvailableShops([]);
        }
    };

    const handleShopSelect = (shop) => {
        setSelectedShop(shop);
        setSelectedTime(null); // 매장 변경 시 시간 초기화
        console.log('최종 선택된 매장:', shop);
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time); // 선택된 시간 상태 업데이트
        console.log('최종 선택된 시간:', time);
        // ✨ 이 시점에서 매장, 날짜, 시간이 모두 선택됨
        // 최종 예약 확인 또는 다음 단계로 이동하는 로직을 여기에 추가
    };

    return (
        <div style={{
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
            maxWidth: '1200px',
            margin: 'auto',
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap' // 화면이 작아질 때 줄바꿈
        }}>
            {/* 왼쪽 섹션: 캘린더 */}
            <div style={{ flex: '1 1 45%', minWidth: '320px', marginBottom: '20px' }}>
                <h2>1. 픽업 날짜를 선택해주세요</h2>
                <div style={{ width: '100%', maxWidth: '400px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', margin: '0 auto' }}>
                    <Calendar
                        onChange={handleCalendarDateChange}
                        value={selectedDate}
                        minDate={new Date()} // 현재 날짜
                        maxDate={new Date(now.setMonth(now.getMonth() + 3))} // 오늘로부터 3개월 뒤
                        selectRange={false}
                        className="react-calendar-custom"
                    />
                </div>
                {selectedDate && (
                    <p style={{ marginTop: '15px', fontSize: '1.1em', fontWeight: 'bold', textAlign: 'center' }}>
                        선택된 날짜: {selectedDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                    </p>
                )}
            </div>

            {/* 오른쪽 섹션: 예약 가능한 매장 목록 */}
            <div style={{ flex: '1 1 45%', minWidth: '350px', marginBottom: '20px' }}>
                <h2>2. 예약 가능한 매장을 선택해주세요</h2>
                {selectedDate ? (
                    availableShops.length > 0 ? (
                        <ul style={{ listStyle: 'none', padding: 0, maxHeight: '600px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '8px' }}>
                            {availableShops.map((shop) => (
                                <li key={shop.shopId}
                                    style={{
                                        marginBottom: '10px',
                                        border: `2px solid ${selectedShop?.shopId === shop.shopId ? '#007bff' : '#eee'}`,
                                        padding: '15px',
                                        cursor: 'pointer',
                                        borderRadius: '8px',
                                        backgroundColor: selectedShop?.shopId === shop.shopId ? '#eaf4ff' : '#f9f9f9',
                                        transition: 'background-color 0.2s, border-color 0.2s',
                                    }}
                                    onClick={() => handleShopSelect(shop)}
                                    onMouseOver={e => e.currentTarget.style.backgroundColor = selectedShop?.shopId === shop.shopId ? '#eaf4ff' : '#eef'}
                                    onMouseOut={e => e.currentTarget.style.backgroundColor = selectedShop?.shopId === shop.shopId ? '#eaf4ff' : '#f9f9f9'}
                                >
                                    <strong style={{ fontSize: '1.2em', color: '#333' }}>{shop.shopName}</strong>
                                    <p style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>{shop.address}</p>
                                    <p style={{ fontSize: '0.8em', color: '#999' }}>
                                        영업 시간: {shop.openTime?.substring(0, 5)} ~ {shop.closeTime?.substring(0, 5)}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ textAlign: 'center', color: '#888', fontStyle: 'italic', padding: '20px', border: '1px dashed #ccc', borderRadius: '8px' }}>
                            선택하신 날짜에 예약 가능한 매장이 없습니다.
                        </p>
                    )
                ) : (
                    <p style={{ textAlign: 'center', color: '#888', fontStyle: 'italic', padding: '20px', border: '1px dashed #ccc', borderRadius: '8px' }}>
                        날짜를 선택하면 예약 가능한 매장이 표시됩니다.
                    </p>
                )}
            </div>

            {/* 하단 섹션: 선택된 픽업 정보 및 시간 선택 */}
            {selectedShop && selectedDate && (
                <div style={{
                    marginTop: '30px',
                    padding: '20px',
                    border: '1px solid #007bff',
                    borderRadius: '8px',
                    backgroundColor: '#eaf4ff',
                    width: '100%', // 전체 너비 사용
                    flexBasis: '100%' // flexbox에서 한 줄 전체를 차지
                }}>
                    <h2>선택된 픽업 정보 확인</h2>
                    <p><strong>날짜:</strong> {selectedDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</p>
                    <p><strong>매장:</strong> {selectedShop.shopName} ({selectedShop.address})</p>

                    {/* 시간 선택 컴포넌트 렌더링 */}
                    {selectedShop && selectedDate && (
                        <TimeSelection
                            shopId={selectedShop.shopId}
                            date={selectedDate}
                            onSelectTime={handleTimeSelect}
                        />
                    )}

                    {/* 최종 예약 확인 버튼 (시간까지 선택되었을 때만 활성화) */}
                    {selectedTime && (
                        <button
                            onClick={() => {
                                alert(`최종 예약! 날짜: ${selectedDate.toLocaleDateString()}, 매장: ${selectedShop.shopName}, 시간: ${selectedTime.substring(0, 5)}`);
                                // TODO: 최종 예약 생성 API 호출 및 다음 페이지 (예: 케이크 선택 또는 결제)로 이동
                                // 예: navigate('/order-confirmation', { state: { selectedDate, selectedShop, selectedTime } });
                            }}
                            style={{
                                marginTop: '20px',
                                padding: '12px 25px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '1.1em',
                                fontWeight: 'bold',
                                transition: 'background-color 0.2s',
                            }}>
                            예약 확정 및 다음 단계로 이동
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}


export default PickupScheduler;

//픽업 날짜 선택 -> 예약하려는 날짜 선택