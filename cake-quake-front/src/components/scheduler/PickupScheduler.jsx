
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

    const [availableShops, setAvailableShops] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingShops, setLoadingShops] = useState(false);
    const [shopError, setShopError] = useState(null);

    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [isShopSelectorOpen, setIsShopSelectorOpen] = useState(false);
    const [isTimeSelectorOpen, setIsTimeSelectorOpen] = useState(false);

    // Effect to fetch shops when date changes or page changes
    useEffect(() => {
        const fetchShops = async (reset = false) => {
            if (!selectedDate) {
                setAvailableShops([]);
                setPage(0);
                setHasMore(true);
                return;
            }

            if (!hasMore && !reset) return;

            setLoadingShops(true);
            setShopError(null);

            const dateString = selectedDate.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });

            try {
                // ⭐ getAvailableShops의 반환 값에서 content와 last를 구조 분해 할당합니다.
                const { content, last } = await getAvailableShops(dateString, null, true, reset ? 0 : page, 10);

                // ⭐ 매장 목록을 업데이트할 때 'content' 배열을 사용합니다.
                setAvailableShops(prevShops => reset ? content : [...prevShops, ...content]);
                setHasMore(!last); // 'last' 플래그를 사용하여 더 불러올 데이터가 있는지 업데이트합니다.
                setPage(prevPage => prevPage + 1);
            } catch (error) {
                console.error('Failed to fetch available shops:', error);
                setShopError('예약 가능한 매장을 불러오는 데 실패했습니다.');
                setAvailableShops([]);
            } finally {
                setLoadingShops(false);
            }
        };

        if (selectedDate) {
            fetchShops(true);
        } else {
            setAvailableShops([]);
            setPage(0);
            setHasMore(true);
        }

    }, [selectedDate]);

    // 매장 선택 모달에서 스크롤 이벤트 발생 시 다음 페이지 데이터를 불러오는 함수
    const loadMoreShops = () => {
        if (!loadingShops && hasMore) {
            const dateString = selectedDate.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
            setLoadingShops(true);
            setShopError(null);
            getAvailableShops(dateString, null, true, page, 10)
                .then(({ content, last }) => { // ⭐ 여기서도 content와 last를 구조 분해 할당합니다.
                    setAvailableShops(prevShops => [...prevShops, ...content]);
                    setHasMore(!last);
                    setPage(prevPage => prevPage + 1);
                })
                .catch(error => {
                    console.error('Failed to load more shops:', error);
                    setShopError('더 많은 매장을 불러오는 데 실패했습니다.');
                })
                .finally(() => {
                    setLoadingShops(false);
                });
        }
    };


    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setSelectedShop(null);
        setSelectedTime(null);
        setIsDatePickerOpen(false);
        setPage(0);
        setHasMore(true);
    };

    const handleShopSelectFromModal = (shop) => {
        setSelectedShop(shop);
        setIsShopSelectorOpen(false);
        setSelectedTime(null);
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
        setIsTimeSelectorOpen(false);
    };

    const handleProceedToOrder = () => {
        if (selectedDate && selectedShop && selectedTime) {
            if (onComplete) {
                onComplete({ selectedDate, selectedTime });
            }
            navigate(`/buyer/shops/${selectedShop.shopId}`);
        } else {
            alert("날짜, 매장, 시간을 모두 선택해주세요.");
        }
    };

    const formatDateDisplay = (date) => {
        if (!date) return '날짜 선택';
        return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
    };

    const formatShopDisplay = (shop) => {
        if (!shop) return '매장 선택';
        return shop.shopName;
    };

    const formatTimeDisplay = (time) => {
        if (!time) return '시간 선택';
        return time.substring(0, 5);
    };

    const isProceedButtonDisabled = !selectedDate || !selectedShop || !selectedTime;

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: 'auto' }}>
            <div style={{
                marginBottom: '30px',
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
                    <div style={{ flex: '1 1 28%', minWidth: '180px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>1. 픽업 날짜</label>
                        <button
                            onClick={() => setIsDatePickerOpen(true)}
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

                    <div style={{ flex: '1 1 28%', minWidth: '180px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>2. 매장 선택</label>
                        <button
                            onClick={() => selectedDate && setIsShopSelectorOpen(true)}
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

                    <div style={{ flex: '1 1 28%', minWidth: '180px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>3. 픽업 시간</label>
                        <button
                            onClick={() => selectedShop && setIsTimeSelectorOpen(true)}
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
                selectedDate={selectedDate}
                availableShops={availableShops}
                loading={loadingShops}
                error={shopError}
                onLoadMore={loadMoreShops}
                hasMore={hasMore}
            />

            {selectedShop && selectedDate && (
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
