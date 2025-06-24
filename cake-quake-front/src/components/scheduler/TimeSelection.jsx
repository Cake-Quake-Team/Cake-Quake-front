import {useEffect, useState} from "react";
import {getAvailableTimes} from "../../api/scheduleApi.jsx";

const TimeSelection = ({ shopId, date, onSelectTime }) => {
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTimes = async () => {
            if (!shopId || !date) {
                setAvailableTimes([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);
            const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환

            try {
                const times = await getAvailableTimes(shopId, dateString);
                setAvailableTimes(times);
            } catch (err) {
                console.error('예약 가능한 시간 조회 실패:', err);
                setError('예약 가능한 시간을 불러오는 데 실패했습니다.');
                setAvailableTimes([]);
            } finally {
                setIsLoading(false);
            }
        };

        // 매장 또는 날짜가 변경될 때마다 시간 목록을 다시 불러옴
        fetchTimes();
        // 매장이나 날짜가 변경되면 이전에 선택된 시간도 초기화
        setSelectedTime(null);
    }, [shopId, date]); // shopId 또는 date가 변경될 때마다 실행

    const handleTimeClick = (time) => {
        setSelectedTime(time); // 선택된 시간 상태 업데이트
        onSelectTime(time); // 부모 컴포넌트로 선택된 시간 전달
    };

    if (isLoading) {
        return <div style={{ textAlign: 'center', padding: '20px', color: '#555' }}>시간 목록을 불러오는 중...</div>;
    }

    if (error) {
        return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>오류: {error}</div>;
    }

    // 현재 시간보다 이전 시간은 비활성화
    const now = new Date();
    // 현재 날짜를 YYYY-MM-DD 형식으로 가져옴 (UTC 기준이 아닌 로컬 시간 기준으로)
    const today = new Date().toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });

    return (
        <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <h2>3. 픽업 시간을 선택해주세요</h2>
            {availableTimes.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}>
                    {availableTimes.map((time) => {
                        // 'YYYY-MM-DDTHH:mm:ss' 형식으로 조합하여 Date 객체 생성
                        const fullDateTime = new Date(`${date.toISOString().split('T')[0]}T${time}`);

                        // 날짜가 오늘이고, 시간이 현재 시간보다 이전이면 비활성화
                        const isDisabled = date.toISOString().split('T')[0] === today && fullDateTime < now;

                        return (
                            <button
                                key={time}
                                onClick={() => handleTimeClick(time)}
                                disabled={isDisabled} // 비활성화 조건
                                style={{
                                    padding: '12px 8px',
                                    backgroundColor: selectedTime === time ? '#007bff' : (isDisabled ? '#e0e0e0' : '#f0f0f0'),
                                    color: selectedTime === time ? 'white' : (isDisabled ? '#888' : '#333'),
                                    border: '1px solid ' + (selectedTime === time ? '#007bff' : (isDisabled ? '#ccc' : '#ccc')),
                                    borderRadius: '5px',
                                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                                    fontSize: '1em',
                                    fontWeight: 'bold',
                                    transition: 'background-color 0.2s, border-color 0.2s',
                                    opacity: isDisabled ? 0.7 : 1,
                                }}
                            >
                                {time.substring(0, 5)} {/* HH:MM 형식으로 표시 */}
                            </button>
                        );
                    })}
                </div>
            ) : (
                <p style={{ textAlign: 'center', color: '#888', fontStyle: 'italic', padding: '20px', border: '1px dashed #ccc', borderRadius: '8px' }}>
                    선택하신 날짜와 매장에 예약 가능한 시간이 없습니다.
                </p>
            )}
        </div>
    );
};