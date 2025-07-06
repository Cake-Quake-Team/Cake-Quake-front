
import 'react-calendar/dist/Calendar.css';
import {useEffect, useState} from "react";
import{getAvailableShops} from "../../api/scheduleApi.jsx";
import DatePickerModal from "./datePickerModal.jsx";
import ShopSelectionModal from "./ShopSelectionModal.jsx";
import TimeSelectionModal from "./timeSelectionModal.jsx";
import {useNavigate} from "react-router";


function PickupScheduler({ onComplete }) {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedShop, setSelectedShop] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [availableShops, setAvailableShops] = useState([]); // 매장 목록은 모달에 전달하기 위해 필요
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false); // DatePickerModal을 사용하므로 다시 필요
    const [isShopSelectorOpen, setIsShopSelectorOpen] = useState(false);
    const [isTimeSelectorOpen, setIsTimeSelectorOpen] = useState(false);
    const [loadingShops, setLoadingShops] = useState(false);
    const [shopError, setShopError] = useState(null);

    // Effect to fetch shops when date changes
    // 이펙트는 그대로 유지: 날짜가 바뀌면 해당 날짜에 이용 가능한 매장 목록을 불러옵니다.
    // 이 매장 목록은 ShopSelectionModal로 전달되어 모달 내에서 보여지게 됩니다.
    useEffect(() => {
        const fetchShops = async () => {
            if (selectedDate) {
                setLoadingShops(true);
                setShopError(null);
                setSelectedShop(null); // 날짜 변경 시 매장 및 시간 초기화
                setSelectedTime(null);

                const dateString = selectedDate.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });

                try {
                    const shops = await getAvailableShops(dateString);
                    setAvailableShops(shops);
                } catch (error) {
                    console.error('Failed to fetch available shops:', error);
                    setShopError('예약 가능한 매장을 불러오는 데 실패했습니다.');
                    setAvailableShops([]);
                } finally {
                    setLoadingShops(false);
                }
            } else {
                setAvailableShops([]); // 날짜가 없으면 매장 목록도 비움
            }
        };
        fetchShops();
    }, [selectedDate]);

    // Calendar 컴포넌트의 날짜 변경 핸들러 (DatePickerModal에서 사용)
    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setIsDatePickerOpen(false); // 날짜 선택 후 모달 닫기
    };

    // 매장 선택 모달에서 매장을 선택했을 때 호출
    const handleShopSelectFromModal = (shop) => {
        setSelectedShop(shop);
        setIsShopSelectorOpen(false); // 모달 닫기
        setSelectedTime(null); // 매장 변경 시 시간 초기화
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
        setIsTimeSelectorOpen(false); // 시간 선택 후 모달 닫기
    };

    const handleProceedToOrder = () => {
        if (selectedDate && selectedShop && selectedTime) {
            // 부모 컴포넌트에 완료 정보 전달 (원래 기능)
            if (onComplete) {
                onComplete({
                    selectedDate,
                    selectedShop,
                    selectedTime
                });
            }

            // 매장 상세 조회 화면으로 이동
            // selectedShop.shopId를 사용하여 매장 상세 라우트로 이동합니다.
            navigate(`/buyer/shops/${selectedShop.shopId}`);

        } else {
            alert("날짜, 매장, 시간을 모두 선택해주세요.");
        }
    };

    const formatDateDisplay = (date) => {
        if (!date) return '날짜 선택'; // 초기값
        return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
    };

    const formatShopDisplay = (shop) => {
        if (!shop) return '매장 선택';
        return shop.shopName;
    };

    const formatTimeDisplay = (time) => {
        if (!time) return '시간 선택';
        return time.substring(0, 5); // HH:MM
    };

    const isProceedButtonDisabled = !selectedDate || !selectedShop || !selectedTime;

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: 'auto' }}>
            {/* 상단 픽업 스케줄 조회 섹션 (이미지: image_781113.png과 동일) */}
            <div style={{
                marginBottom: '30px', // 하단 내용이 없으므로 margin-bottom은 그대로 유지하거나 조절
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '10px',
                backgroundColor: '#f9f9f9',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
            }}>
                <h2 style={{ marginBottom: '15px', color: '#333' }}>픽업 스케줄 조회</h2>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    {/* 1. 픽업 날짜 (버튼으로 모달 띄우기) */}
                    <div style={{ flex: '1 1 28%', minWidth: '180px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>1. 픽업 날짜</label>
                        <button
                            onClick={() => setIsDatePickerOpen(true)} // <-- 버튼 클릭 시 DatePickerModal 열기
                            style={{
                                width: '100%', padding: '12px 15px', border: '1px solid #ccc', borderRadius: '8px',
                                backgroundColor: 'white', textAlign: 'left', cursor: 'pointer', fontSize: '1em',
                                color: selectedDate ? '#333' : '#999', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                            }}
                        >
                            <span>{formatDateDisplay(selectedDate)}</span>
                            <span style={{ fontSize: '1.2em' }}>📅</span>
                        </button>
                    </div>

                    {/* 2. 매장 선택 (버튼으로 모달 띄우기) */}
                    <div style={{ flex: '1 1 28%', minWidth: '180px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>2. 매장 선택</label>
                        <button
                            onClick={() => selectedDate && setIsShopSelectorOpen(true)} // 날짜 선택 시에만 활성화
                            disabled={!selectedDate}
                            style={{
                                width: '100%', padding: '12px 15px', border: '1px solid #ccc', borderRadius: '8px',
                                backgroundColor: !selectedDate ? '#eee' : 'white', textAlign: 'left',
                                cursor: !selectedDate ? 'not-allowed' : 'pointer', fontSize: '1em',
                                color: selectedShop ? '#333' : '#999', display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center', opacity: !selectedDate ? 0.7 : 1
                            }}
                        >
                            <span>{formatShopDisplay(selectedShop)}</span>
                            <span style={{ fontSize: '1.2em' }}>📍</span>
                        </button>
                    </div>

                    {/* 3. 픽업 시간 (버튼으로 모달 띄우기) */}
                    <div style={{ flex: '1 1 28%', minWidth: '180px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>3. 픽업 시간</label>
                        <button
                            onClick={() => selectedShop && setIsTimeSelectorOpen(true)} // 매장 선택 시에만 활성화
                            disabled={!selectedShop}
                            style={{
                                width: '100%', padding: '12px 15px', border: '1px solid #ccc', borderRadius: '8px',
                                backgroundColor: !selectedShop ? '#eee' : 'white', textAlign: 'left',
                                cursor: !selectedShop ? 'not-allowed' : 'pointer', fontSize: '1em',
                                color: selectedTime ? '#333' : '#999', display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center', opacity: !selectedShop ? 0.7 : 1
                            }}
                        >
                            <span>{formatTimeDisplay(selectedTime)}</span>
                            <span style={{ fontSize: '1.2em' }}>⏰</span>
                        </button>
                    </div>
                </div>

                {/* 예약 확정 버튼 */}
                <button
                    onClick={handleProceedToOrder}
                    disabled={isProceedButtonDisabled}
                    style={{
                        marginTop: '20px', padding: '15px 30px',
                        backgroundColor: isProceedButtonDisabled ? '#cccccc' : '#28a745',
                        color: 'white', border: 'none', borderRadius: '8px',
                        cursor: isProceedButtonDisabled ? 'not-allowed' : 'pointer',
                        fontSize: '1.2em', fontWeight: 'bold', transition: 'background-color 0.2s',
                        alignSelf: 'flex-end'
                    }}>
                    예약 확정 및 다음 단계로 이동
                </button>
            </div>

            {/* 모달들 */}
            <DatePickerModal
                isOpen={isDatePickerOpen}
                onClose={() => setIsDatePickerOpen(false)}
                onSelectDate={handleDateSelect}
                selectedDate={selectedDate}
            />

            <ShopSelectionModal
                isOpen={isShopSelectorOpen}
                onClose={() => setIsShopSelectorOpen(false)}
                onSelectShop={handleShopSelectFromModal}
                selectedShop={selectedShop}
                availableShops={availableShops} // 날짜 선택 후 불러온 매장 목록을 모달에 전달
                loading={loadingShops}
                error={shopError}
            />

            {selectedShop && selectedDate && ( // 매장과 날짜가 선택되어야 시간 모달을 활성화 (선택 사항)
                <TimeSelectionModal
                    isOpen={isTimeSelectorOpen}
                    onClose={() => setIsTimeSelectorOpen(false)}
                    onSelectTime={handleTimeSelect}
                    shopId={selectedShop.shopId}
                    date={selectedDate}
                    selectedTime={selectedTime}
                />
            )}
        </div>
    );
}

export default PickupScheduler;
