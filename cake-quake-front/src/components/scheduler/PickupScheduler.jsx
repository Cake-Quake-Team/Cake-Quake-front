import 'react-calendar/dist/Calendar.css';
import { useEffect, useState } from "react";
import { getAvailableShops } from "../../api/scheduleApi.jsx";
import DatePickerModal from "./datePickerModal.jsx";
import ShopSelectionModal from "./ShopSelectionModal.jsx";
import TimeSelectionModal from "./timeSelectionModal.jsx";
import { useNavigate } from "react-router";
// 아이콘 추가 (선택 사항: lucide-react 또는 react-icons에서 필요한 아이콘 import)
import { Calendar as CalendarIcon, MapPin, Clock, ArrowRight } from 'lucide-react';


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
            navigate(`/buyer/shops/${selectedShop.shopId}`); // 매장 상세 조회 화면으로 이동

        } else {
            alert("날짜, 매장, 시간을 모두 선택해주세요.");
        }
    };

    const formatDateDisplay = (date) => {

        if (!date) return '픽업 날짜를 선택하세요.';

        return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
    };

    const formatShopDisplay = (shop) => {
        if (!shop) return '매장을 선택하세요.';
        return shop.shopName;
    };

    const formatTimeDisplay = (time) => {

        if (!time) return '픽업 시간을 선택하세요.';
        return time.substring(0, 5);
    };

    const isProceedButtonDisabled = !selectedDate || !selectedShop || !selectedTime;

    return (
        // max-w-4xl -> max-w-6xl 로 변경하여 가로 폭을 넓힙니다.
        <div className="p-5 font-pretendard max-w-6xl mx-auto my-2">
            <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200 flex flex-col gap-6">
                <h2 className="font-semibold text-gray-800 mb-2">픽업 스케줄 조회</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* 1. 픽업 날짜 */}
                    <div className="flex flex-col">

                        <button
                            onClick={() => setIsDatePickerOpen(true)}
                            className="w-full flex items-center justify-between px-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 text-base font-medium
                                    hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200
                                    disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed text-sm"
                        >
                            <span className="text-gray-500">{formatDateDisplay(selectedDate)}</span>
                            <CalendarIcon size={20} className="text-gray-500" />
                        </button>
                    </div>

                    {/* 2. 매장 선택 */}
                    <div className="flex flex-col">
                        <button
                            onClick={() => selectedDate && setIsShopSelectorOpen(true)}
                            disabled={!selectedDate}
                            className="w-full flex items-center justify-between px-3 py-3 text-sm border border-gray-300 rounded-lg text-base font-medium
                                    hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200
                                    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                        >
                            <span className={selectedShop ? "text-gray-500" : "text-gray-400"}>{formatShopDisplay(selectedShop)}</span>
                            <MapPin size={20} className="text-gray-500" />
                        </button>
                    </div>

                    {/* 3. 픽업 시간 */}
                    <div className="flex flex-col">
                        <button
                            onClick={() => selectedShop && setIsTimeSelectorOpen(true)}
                            disabled={!selectedShop}
                            className="w-full flex items-center justify-between px-3 py-3 text-sm border border-gray-300 rounded-lg text-base font-medium
                                    hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200
                                    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                        >
                            <span className={selectedTime ? "text-gray-500" : "text-gray-400"}>{formatTimeDisplay(selectedTime)}</span>
                            <Clock size={20} className="text-gray-500" />
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleProceedToOrder}
                    disabled={isProceedButtonDisabled}
                    className="mt-4 w-full md:w-auto px-4 py-2 bg-black text-white rounded-full
                                hover:bg-gray-400 hover:scale-[1.01] transition-all duration-300
                                disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none
                                md:self-end"
                >
                    예약하러가기
                    <ArrowRight size={20} className="inline-block ml-2 -mr-1" />
                </button>
            </div>


            {/* 모달들 (기존과 동일) */}
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