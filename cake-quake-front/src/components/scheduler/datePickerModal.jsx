
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function DatePickerModal({ isOpen, onClose, onSelectDate, selectedDate }) {
    if (!isOpen) return null; // 모달이 열려있지 않으면 아무것도 렌더링하지 않음

    const handleDateChange = (date) => {
        onSelectDate(date); // 선택된 날짜를 부모 컴포넌트로 전달
        // onClose(); // 날짜 선택 후 모달을 자동으로 닫으려면 이 라인을 활성화
    };

    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <div style={modalHeaderStyle}>
                    <h3>픽업 날짜 선택</h3>
                    <button onClick={onClose} style={closeButtonStyle}>✖</button>
                </div>
                <div style={modalBodyStyle}>
                    <Calendar
                        onChange={handleDateChange}
                        value={selectedDate}
                        locale="ko-KR" // 한국어 로케일 설정
                        minDate={new Date()} // 오늘 날짜 이전은 선택 불가
                        next2Label={null} // 다음 2년 버튼 제거
                        prev2Label={null} // 이전 2년 버튼 제거
                    />
                </div>
            </div>
        </div>
    );
}

// 모달 스타일 (재사용성을 위해 별도로 정의)
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

export default DatePickerModal;