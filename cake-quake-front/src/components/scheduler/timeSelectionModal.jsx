import {useEffect, useState} from "react";
import {getAvailableTimes} from "../../api/scheduleApi.jsx";

function TimeSelectionModal({ isOpen, onClose, onSelectTime, shopId, date, selectedTime }) {
    const [availableTimes, setAvailableTimes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTimes = async () => {
            if (!shopId || !date) {
                // shopId나 date가 없으면 시간을 불러올 수 없음
                setAvailableTimes([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);
            // 백엔드 날짜 형식 (YYYY-MM-DD)에 맞춰 변환
            const dateString = date.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });

            try {
                const times = await getAvailableTimes(shopId, dateString);
                // 백엔드에서 HH:MM:SS 형식으로 올 수 있으므로, 항상 HH:MM:SS 형태로 저장하여 비교에 용이하게 함
                const formattedTimes = times.map(t => {
                    if (t.length === 5) { // HH:MM 형태라면 HH:MM:00으로 변환
                        return t + ':00';
                    }
                    return t; // 이미 HH:MM:SS 형태라면 그대로 사용
                });
                setAvailableTimes(formattedTimes);
            } catch (err) {
                console.error('예약 가능한 시간 조회 실패:', err);
                setError('예약 가능한 시간을 불러오는 데 실패했습니다.');
                setAvailableTimes([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen) { // 모달이 열렸을 때만 시간을 불러오도록 조건 추가
            fetchTimes();
        }
    }, [shopId, date, isOpen]); // shopId, date, isOpen이 변경될 때마다 실행

    const handleTimeClick = (time) => {
        onSelectTime(time);
        // onClose(); // 시간 선택 후 모달을 자동으로 닫으려면 이 라인을 활성화
    };

    if (!isOpen) return null;

    // 현재 시간과 비교하여 이전 시간 비활성화 로직
    const now = new Date();
    // 비교를 위해 날짜 문자열도 YYYY-MM-DD로 통일
    const selectedDateString = date.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const todayString = now.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });


    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <div style={modalHeaderStyle}>
                    <h3>픽업 시간 선택</h3>
                    <button onClick={onClose} style={closeButtonStyle}>✖</button>
                </div>
                <div style={modalBodyStyle}>
                    {isLoading ? (
                        <p style={{ textAlign: 'center', color: '#555' }}>시간 목록을 불러오는 중...</p>
                    ) : error ? (
                        <p style={{ textAlign: 'center', color: 'red' }}>오류: {error}</p>
                    ) : availableTimes.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}>
                            {availableTimes.map((time) => {
                                // 현재 날짜인 경우, 현재 시간보다 이전인 시간은 비활성화
                                const dateTimeString = `${selectedDateString} ${time}`;
                                const fullDateTime = new Date(dateTimeString); // YYYY-MM-DD HH:MM:SS 형식의 문자열로 Date 객체 생성

                                const isDisabled = selectedDateString === todayString && fullDateTime < now;

                                return (
                                    <button
                                        key={time}
                                        onClick={() => handleTimeClick(time)}
                                        disabled={isDisabled}
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
                                        {time.substring(0, 5)} {/* HH:MM만 표시 */}
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
            </div>
        </div>
    );
}

// 모달 스타일은 DatePickerModal과 동일하게 사용 (TimeSelectionModal 외부에 정의되어야 합니다)
const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 1000
};

const modalContentStyle = {
    backgroundColor: 'white', padding: '25px', borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    maxWidth: '400px', width: '90%', position: 'relative',
    display: 'flex', flexDirection: 'column', alignItems: 'center'
};

const modalHeaderStyle = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    width: '100%', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #eee'
};

const closeButtonStyle = {
    backgroundColor: 'transparent', border: 'none', fontSize: '1.5em',
    cursor: 'pointer', color: '#666'
};

const modalBodyStyle = {
    width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column'
};

export default TimeSelectionModal;