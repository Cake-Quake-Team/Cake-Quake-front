import {useEffect, useRef} from "react";

const ShopSelectionModal = ({ isOpen, onClose, shops, onSelectShop }) => {
    const modalRef = useRef(); // 모달 DOM 엘리먼트에 접근하기 위한 ref

    // 모달 외부 클릭 감지 (모달 닫기)
    useEffect(() => {
        const handleClickOutside = (event) => {
            // 모달이 열려 있고, 클릭된 요소가 모달 내부가 아니라면
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose(); // 모달 닫기 함수 호출
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]); // isOpen이나 onClose가 변경될 때마다 이벤트 리스너를 다시 등록/해제

    // isOpen이 false일 경우 아무것도 렌더링하지 않음 (모달 숨김)
    if (!isOpen) {
        return null;
    }

    // 모달이 열려 있을 경우 렌더링
    return (
        // 오버레이 (모달 배경)
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)', // 반투명 검은색 배경
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000, // 다른 콘텐츠 위에 오도록 z-index 설정
        }}>
            {/* 모달 콘텐츠 박스 */}
            <div ref={modalRef} // ref 연결
                 style={{
                     backgroundColor: 'white',
                     padding: '20px',
                     borderRadius: '8px',
                     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                     width: '80%',
                     maxWidth: '500px',
                     maxHeight: '80%',
                     overflowY: 'auto', // 내용이 많을 경우 스크롤
                     position: 'relative', // 닫기 버튼 등의 위치 지정을 위해
                 }}>
                <h2 style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>예약 가능한 매장 선택</h2>
                {shops.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {shops.map((shop) => (
                            <li key={shop.shopId}
                                style={{
                                    marginBottom: '10px',
                                    border: '1px solid #eee',
                                    padding: '10px',
                                    cursor: 'pointer',
                                    borderRadius: '5px',
                                    backgroundColor: '#f9f9f9',
                                    transition: 'background-color 0.2s',
                                }}
                                onClick={() => onSelectShop(shop)}
                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#eef'}
                                onMouseOut={e => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                            >
                                <strong style={{ fontSize: '1.1em', color: '#333' }}>{shop.shopName}</strong>
                                <p style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>{shop.address}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{ textAlign: 'center', color: '#888', fontStyle: 'italic' }}>선택하신 시간대에 예약 가능한 매장이 없습니다.</p>
                )}
                <button
                    onClick={onClose}
                    style={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        float: 'right', // 버튼을 오른쪽으로 정렬
                        transition: 'background-color 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = '#0056b3'}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = '#007bff'}
                >
                    닫기
                </button>
            </div>
        </div>
    );
};

export default ShopSelectionModal;