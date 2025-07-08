import React, { useState, useEffect, useCallback } from "react"; // useCallback 유지 및 사용
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
// API 임포트 경로 수정 및 getShopDetails 추가
import { getAvailableShops, getShopOperatingHours, getOccupiedTimeSlots, getShopDetails } from "../../../../api/scheduleApi"; // getShopDetails를 임포트합니다.

const OrderPickupScheduler = ({
                                  initialPickupDateFromState,
                                  initialPickupTimeFromState,
                                  initialSelectedShopFromState,
                                  initialShopIdFromProps, // <--- props로 넘어오는 이름과 일치하도록 수정
                                  onScheduleChange
                              }) => {
    // 상태 정의
    const [selectedDate, setSelectedDate] = useState(initialPickupDateFromState);
    const [selectedTime, setSelectedTime] = useState(initialPickupTimeFromState);
    const [availableShops, setAvailableShops] = useState([]); // 날짜 선택 시 해당 날짜에 예약 가능한 매장 목록
    const [selectedShop, setSelectedShop] = useState(initialSelectedShopFromState); // 사용자가 선택하거나 초기 고정된 매장의 상세 정보
    const [shopOperatingHours, setShopOperatingHours] = useState(null); // 선택된 매장의 운영 시간
    const [occupiedTimeSlots, setOccupiedTimeSlots] = useState([]); // 선택된 매장/날짜의 예약된 시간대

    const now = new Date(); // 캘린더 minDate/maxDate 기준 시각

    // 최종적으로 사용할 매장 ID (initialShopIdFromProps가 있으면 우선, 아니면 selectedShop의 ID)
    const finalShopId = initialShopIdFromProps || selectedShop?.shopId;

    // --- EFFECT 1: 날짜/최종 매장 ID 변경 시 스케줄 데이터 및 매장 상세 정보 불러오기 ---
    // 이 useEffect는 다음 경우에 실행됩니다:
    // 1. 컴포넌트가 처음 로드될 때 (selectedDate가 초기값으로 설정되어 있다면)
    // 2. selectedDate가 변경될 때
    // 3. finalShopId (고정 매장 ID 또는 사용자가 매장 선택으로 인해)가 변경될 때
    // 4. initial props가 변경될 때 (initialSelectedShopFromState, initialShopIdFromProps)
    useEffect(() => {
        const fetchShopAndScheduleData = async () => {
            if (selectedDate) { // 유효한 날짜가 선택된 경우에만 실행
                const dateString = selectedDate.toISOString().split('T')[0];

                // 1. 매장 상세 정보 가져오기 또는 확인 (finalShopId가 있을 경우)
                // 현재 selectedShop 상태가 finalShopId와 일치하는지, 그리고 매장 이름 정보까지 가지고 있는지 확인
                const needsShopDetailsFetch = finalShopId && (!selectedShop || selectedShop.shopId !== finalShopId || !selectedShop.shopName);

                if (needsShopDetailsFetch) {
                    try {
                        const details = await getShopDetails(finalShopId); // getShopDetails API 호출
                        setSelectedShop(details); // selectedShop 상태를 API로 가져온 상세 정보로 업데이트
                    } catch (error) {
                        console.error(`매장 상세 정보 조회 실패 (shopId: ${finalShopId}):`, error);
                        alert('매장 상세 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.');
                        setSelectedShop(null); // 오류 발생 시 매장 선택 초기화 (UI에 매장 정보가 표시되지 않음)
                        setShopOperatingHours(null); // 운영 시간도 초기화
                        setOccupiedTimeSlots([]); // 예약 시간도 초기화
                        return; // 매장 정보가 없으면 스케줄 조회는 의미가 없으므로 여기서 함수 종료
                    }
                } else if (selectedShop && selectedShop.shopId === finalShopId && selectedShop.shopName) {
                    // 이미 완전한 매장 상세 정보가 selectedShop에 있고 finalShopId와 일치하면
                    // 불필요하게 API를 다시 호출하거나 상태를 재설정할 필요 없음
                }

                // 2. 스케줄 관련 데이터 가져오기 (매장 정보가 성공적으로 설정된 후에)
                if (finalShopId) { // 최종 매장 ID가 결정된 경우에만 스케줄 조회
                    try {
                        const hours = await getShopOperatingHours(finalShopId, dateString);
                        setShopOperatingHours(hours);
                        const occupied = await getOccupiedTimeSlots(finalShopId, dateString);
                        setOccupiedTimeSlots(occupied);
                    } catch (error) {
                        console.error('스케줄 조회 실패:', error);
                        alert('스케줄 정보를 불러오는 데 실패했습니다.');
                        setShopOperatingHours(null);
                        setOccupiedTimeSlots([]);
                    }
                } else { // finalShopId가 아직 결정되지 않은 경우 (사용자가 매장을 직접 선택해야 하는 시나리오)
                    try {
                        const shops = await getAvailableShops(dateString); // 해당 날짜에 예약 가능한 매장 목록을 불러옴
                        setAvailableShops(shops);
                    } catch (error) {
                        console.error('예약 가능 매장 목록 조회 실패:', error);
                        alert('예약 가능한 매장 목록을 불러오는 데 실패했습니다.');
                        setAvailableShops([]);
                    }
                }
            } else {
                // selectedDate가 null인 경우, 스케줄 관련 모든 상태를 초기화
                setAvailableShops([]);
                setSelectedShop(null);
                setShopOperatingHours(null);
                setOccupiedTimeSlots([]);
            }
        };

        fetchShopAndScheduleData();
        // 의존성 배열: selectedShop을 제거하여 무한 루프를 방지합니다.
        // initial prop들(initialSelectedShopFromState, initialShopIdFromProps)을 추가하여 초기 prop 변경에 반응합니다.
        // finalShopId를 추가하여 최종적으로 결정된 매장 ID에 따라 데이터를 불러오도록 합니다.
    }, [selectedDate, finalShopId, initialSelectedShopFromState, initialShopIdFromProps]);


    // --- EFFECT 2: 부모 컴포넌트에 스케줄 변경 알림 ---
    // 이 useEffect는 selectedDate, selectedShop, selectedTime 중 하나라도 변경될 때마다 실행됩니다.
    // 변경된 최신 상태를 onScheduleChange 콜백 함수를 통해 부모 컴포넌트(CreateOrder)로 전달합니다.
    useEffect(() => {
        onScheduleChange(selectedDate, selectedShop, selectedTime);
    }, [selectedDate, selectedShop, selectedTime, onScheduleChange]); // onScheduleChange도 의존성에 포함 (useCallback 사용 시 필요)


    // --- 이벤트 핸들러: useCallback으로 감싸서 최적화 ---
    // useCallback을 사용하면 이 함수들이 불필요하게 다시 생성되는 것을 막아줍니다.
    // 특히 이 함수들이 하위 컴포넌트 (버튼 등)에 props로 전달될 때 유용합니다.
    const handleCalendarDateChange = useCallback(async (date) => {
        setSelectedDate(date);
        // 날짜 변경 시, 매장과 시간 선택은 초기화됩니다.
        // 단, initial props에서 넘어온 초기값들은 유지하려고 시도합니다. (다시 useEffect가 처리함)
        setSelectedShop(initialSelectedShopFromState);
        setSelectedTime(initialPickupTimeFromState);
        setAvailableShops([]);
        setShopOperatingHours(null);
        setOccupiedTimeSlots([]);
    }, [initialSelectedShopFromState, initialPickupTimeFromState]); // useCallback의 의존성 배열


    const handleShopSelect = useCallback(async (shop) => {
        // 사용자가 매장 목록에서 직접 매장을 선택했을 때 호출됩니다.
        // 이때 `shop` 객체는 `getAvailableShops` API가 반환하는 형태로, 매장 이름과 주소 등의 상세 정보를 포함해야 합니다.
        // 만약 `getAvailableShops`가 `shopId`만 반환한다면, 여기서도 `getShopDetails(shop.shopId)`를 호출하여 상세 정보를 가져와야 합니다.
        setSelectedShop(shop); // `shop` 객체는 상세 정보를 포함하고 있어야 합니다.
        setSelectedTime(null); // 매장 변경 시 픽업 시간 초기화
    }, []); // useCallback의 의존성 배열 (여기서는 외부 의존성 없음)


    const handleTimeSelect = useCallback((time) => {
        setSelectedTime(time); // 선택된 시간 상태 업데이트
        console.log('최종 선택된 시간:', time);
    }, []); // useCallback의 의존성 배열 (여기서는 외부 의존성 없음)


    // 캘린더 타일 비활성화 로직 (변경 없음)
    const tileDisabled = ({ date, view }) => {
        if (view === 'month') {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // 날짜만 비교
            if (date.getTime() < today.getTime()) {
                return true; // 지난 날짜 비활성화
            }
        }
        return false;
    };

    // 매장 운영 시간을 기반으로 시간대 목록 생성 (변경 없음)
    const generateTimeSlots = (open, close) => {
        if (!open || !close || !selectedDate) return [];
        const slots = [];
        const [openHour, openMinute] = open.split(':').map(Number);
        const [closeHour, closeMinute] = close.split(':').map(Number);

        let current = new Date(selectedDate);
        current.setHours(openHour, openMinute, 0, 0);

        const closeTime = new Date(selectedDate);
        closeTime.setHours(closeHour, closeMinute, 0, 0);

        const isToday = selectedDate.toDateString() === new Date().toDateString();
        const nowHours = new Date().getHours();
        const nowMinutes = new Date().getMinutes();

        if (openHour > closeHour || (openHour === closeHour && openMinute > closeMinute)) {
            while (current.getHours() < 24) {
                const slotTimeStr = current.toTimeString().substring(0, 5);
                const [slotHour, slotMinute] = slotTimeStr.split(':').map(Number);
                if (!(isToday && (slotHour < nowHours || (slotHour === nowHours && slotMinute <= nowMinutes)))) {
                    slots.push(slotTimeStr);
                }
                current.setMinutes(current.getMinutes() + 30);
            }
            current = new Date(selectedDate);
            current.setDate(current.getDate() + 1);
            current.setHours(0, 0, 0, 0);
            while (current.getHours() < closeHour || (current.getHours() === closeHour && current.getMinutes() <= closeMinute)) {
                const slotTimeStr = current.toTimeString().substring(0, 5);
                slots.push(slotTimeStr);
                current.setMinutes(current.getMinutes() + 30);
            }
        } else {
            while (current.getTime() < closeTime.getTime()) {
                const slotTimeStr = current.toTimeString().substring(0, 5);
                const [slotHour, slotMinute] = slotTimeStr.split(':').map(Number);
                if (!(isToday && (slotHour < nowHours || (slotHour === nowHours && slotMinute <= nowMinutes)))) {
                    slots.push(slotTimeStr);
                }
                current.setMinutes(current.getMinutes() + 30);
            }
        }
        return slots;
    };

    const timeSlots = selectedDate && shopOperatingHours
        ? generateTimeSlots(shopOperatingHours.openTime, shopOperatingHours.closeTime)
        : [];

    return (
        <>
            <div style={{ flex: '1 1 45%', minWidth: '320px', marginBottom: '20px' }}>
                <h2>1. 픽업 날짜를 선택해주세요</h2>
                <div style={{ width: '100%', maxWidth: '400px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', margin: '0 auto' }}>
                    <Calendar
                        onChange={handleCalendarDateChange}
                        value={selectedDate}
                        minDate={new Date()}
                        maxDate={new Date(now.setMonth(now.getMonth() + 3))}
                        selectRange={false}
                        tileDisabled={tileDisabled}
                        className="react-calendar-custom"
                    />
                </div>
                {selectedDate && (
                    <p style={{ marginTop: '15px', fontSize: '1.1em', fontWeight: 'bold', textAlign: 'center' }}>
                        선택된 날짜: {selectedDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                    </p>
                )}
            </div>

            <div style={{ flex: '1 1 45%', minWidth: '350px', marginBottom: '20px' }}>
                {finalShopId ? ( // finalShopId가 있으면 시간 선택 UI, 없으면 매장 목록 선택 UI
                    <>
                        <h2>2. 픽업 시간을 선택해주세요</h2>
                        {selectedDate && shopOperatingHours ? (
                            shopOperatingHours.isClosed ? ( // 매장이 휴무일인 경우
                                <p style={{ textAlign: 'center', color: '#dc3545', fontStyle: 'italic', padding: '20px', border: '1px dashed #f5c6cb', borderRadius: '8px' }}>
                                    매장 휴무일입니다: {shopOperatingHours.message || '예약 불가능'}
                                </p>
                            ) : ( // 매장이 휴무일이 아니고, 시간 슬롯이 있는 경우
                                timeSlots.length > 0 ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px', maxHeight: '600px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '8px', padding: '10px' }}>
                                        {timeSlots.map((time, index) => {
                                            const isBooked = occupiedTimeSlots.includes(time);
                                            return (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => handleTimeSelect(time)}
                                                    disabled={isBooked}
                                                    style={{
                                                        padding: '10px 15px',
                                                        border: `1px solid ${selectedTime === time ? '#007bff' : '#ddd'}`,
                                                        borderRadius: '5px',
                                                        backgroundColor: isBooked ? '#f0f0f0' : (selectedTime === time ? '#eaf4ff' : 'white'),
                                                        color: isBooked ? '#bbb' : '#333',
                                                        cursor: isBooked ? 'not-allowed' : 'pointer',
                                                        fontWeight: selectedTime === time ? 'bold' : 'normal',
                                                        transition: 'background-color 0.2s, border-color 0.2s',
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    {time}
                                                    {isBooked && <span style={{fontSize: '0.8em', display: 'block', color: '#888'}}> (예약됨)</span>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : ( // 매장 영업은 하지만, 생성된 시간 슬롯이 없는 경우
                                    <p style={{ textAlign: 'center', color: '#888', fontStyle: 'italic', padding: '20px', border: '1px dashed #ccc', borderRadius: '8px' }}>
                                        선택하신 날짜에 예약 가능한 시간대가 없습니다 (영업 시간: {shopOperatingHours.openTime?.substring(0,5)}~{shopOperatingHours.closeTime?.substring(0,5)}).
                                    </p>
                                )
                            )
                        ) : ( // 날짜는 선택했지만 아직 shopOperatingHours 정보가 없는 경우 (데이터 로딩 중이거나 매장 선택 전)
                            <p style={{ textAlign: 'center', color: '#888', fontStyle: 'italic', padding: '20px', border: '1px dashed #ccc', borderRadius: '8px' }}>
                                날짜를 선택하면 예약 가능한 시간이 표시됩니다.
                            </p>
                        )}
                    </>
                ) : ( // finalShopId가 없으면 매장 목록 선택 UI
                    <>
                        <h2>2. 예약 가능한 매장을 선택해주세요</h2>
                        {selectedDate ? ( // 날짜가 선택된 경우에만 매장 목록 표시 시도
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
                            ) : ( // 날짜 선택 후 예약 가능한 매장이 없는 경우
                                <p style={{ textAlign: 'center', color: '#888', fontStyle: 'italic', padding: '20px', border: '1px dashed #ccc', borderRadius: '8px' }}>
                                    선택하신 날짜에 예약 가능한 매장이 없습니다.
                                </p>
                            )
                        ) : ( // 날짜가 아직 선택되지 않은 경우
                            <p style={{ textAlign: 'center', color: '#888', fontStyle: 'italic', padding: '20px', border: '1px dashed #ccc', borderRadius: '8px' }}>
                                날짜를 선택하면 예약 가능한 매장이 표시됩니다.
                            </p>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default OrderPickupScheduler;