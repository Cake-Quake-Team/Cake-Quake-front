import {useEffect, useRef} from "react";

const ShopSelectionModal = ({ isOpen, onClose, shops, onSelectShop, selectedDate }) => { // selectedDate prop 추가
    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    // 모달 제목에 선택된 날짜를 표시 (YYYY년 M월 D일 형식)
    const formattedDate = selectedDate ?
        new Date(selectedDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) :
        '';

    return (
        <div style={{ /* ... (기존 오버레이 스타일) ... */ }}>
            <div ref={modalRef} style={{ /* ... (기존 모달 콘텐츠 스타일) ... */ }}>
                <h2 style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                    {formattedDate ? `${formattedDate} 예약 가능한 매장` : '예약 가능한 매장 선택'}
                </h2>
                {shops.length > 0 ? (
                    <ul style={{ /* ... (기존 ul 스타일) ... */ }}>
                        {shops.map((shop) => (
                            <li key={shop.shopId}
                                style={{ /* ... (기존 li 스타일) ... */ }}
                                onClick={() => onSelectShop(shop)}
                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#eef'}
                                onMouseOut={e => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                            >
                                <strong style={{ fontSize: '1.1em', color: '#333' }}>{shop.shopName}</strong>
                                <p style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>{shop.address}</p>
                                <p style={{ fontSize: '0.8em', color: '#999' }}>
                                    영업 시간: {shop.openTime?.substring(0, 5)} ~ {shop.closeTime?.substring(0, 5)}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{ textAlign: 'center', color: '#888', fontStyle: 'italic' }}>
                        선택하신 날짜에 예약 가능한 매장이 없습니다.
                    </p>
                )}
                <button onClick={onClose} style={{ /* ... (기존 버튼 스타일) ... */ }}>
                    닫기
                </button>
            </div>
        </div>
    );
};

export default ShopSelectionModal;