import {useEffect, useRef} from "react";


function ShopSelectionModal({ isOpen, onClose, onSelectShop, selectedShop, availableShops, loading, error, onLoadMore, hasMore }) { // ⭐ onLoadMore, hasMore prop 추가
    if (!isOpen) return null;

    const scrollRef = useRef(null); // ⭐ 스크롤 컨테이너를 참조할 useRef 훅

    // ⭐ 스크롤 이벤트 핸들러
    const handleScroll = () => {
        // scrollRef.current가 null일 경우, 즉 DOM 요소가 아직 마운트되지 않은 경우 함수 종료
        if (!scrollRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        // 스크롤이 거의 바닥에 도달했을 때 (예: 하단에서 100px 이내)
        // 그리고 아직 더 불러올 데이터가 있고 (hasMore), 현재 로딩 중이 아닐 때 (!loading)
        if (scrollHeight - scrollTop <= clientHeight + 100 && hasMore && !loading) {
            onLoadMore(); // 부모 컴포넌트로부터 전달받은 다음 페이지 로드 함수 호출
        }
    };

    // ⭐ useEffect를 이용하여 스크롤 이벤트 리스너 등록 및 해제
    useEffect(() => {
        const currentRef = scrollRef.current; // 클린업 함수에서 사용할 참조 변수
        if (currentRef) {
            currentRef.addEventListener('scroll', handleScroll);
        }
        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            if (currentRef) {
                currentRef.removeEventListener('scroll', handleScroll);
            }
        };
    }, [hasMore, loading]); // hasMore나 loading 상태가 변경될 때마다 이벤트 리스너 업데이트 (클로저 문제 방지)


    const handleShopClick = (shop) => {
        onSelectShop(shop);
        // onClose(); // 매장 선택 후 모달을 자동으로 닫으려면 이 라인을 활성화
    };

    return (
        <div style={modalOverlayStyle}>
            {/* ⭐ modalContentStyle에 maxHeight 추가하여 모달 자체의 최대 높이 설정 */}
            <div style={{ ...modalContentStyle, maxWidth: '600px', maxHeight: '80vh' }}>
                <div style={modalHeaderStyle}>
                    <h3>매장 선택</h3>
                    <button onClick={onClose} style={closeButtonStyle}>✖</button>
                </div>
                {/* ⭐ modalBodyStyle에 overflowY: 'auto' 추가 및 ref 연결 */}
                <div style={{ ...modalBodyStyle, overflowY: 'auto' }} ref={scrollRef}>
                    {/* ⭐ 초기 로딩 중일 때만 메시지 표시 (availableShops가 비어있을 때) */}
                    {loading && availableShops.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#555' }}>매장 목록을 불러오는 중...</p>
                    ) : error ? (
                        <p style={{ textAlign: 'center', color: 'red' }}>오류: {error}</p>
                    ) : availableShops.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#888', fontStyle: 'italic' }}>
                            선택하신 날짜에 예약 가능한 매장이 없습니다.
                        </p>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: 0, width: '100%' }}>
                            {availableShops.map((shop) => (
                                <li
                                    key={shop.shopId}
                                    onClick={() => handleShopClick(shop)}
                                    style={{
                                        marginBottom: '10px',
                                        border: `2px solid ${selectedShop?.shopId === shop.shopId ? '#007bff' : '#eee'}`,
                                        padding: '15px',
                                        cursor: 'pointer',
                                        borderRadius: '8px',
                                        backgroundColor: selectedShop?.shopId === shop.shopId ? '#eaf4ff' : '#f9f9f9',
                                        transition: 'background-color 0.2s, border-color 0.2s',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                    onMouseOver={e => e.currentTarget.style.backgroundColor = selectedShop?.shopId === shop.shopId ? '#eaf4ff' : '#eef'}
                                    onMouseOut={e => e.currentTarget.style.backgroundColor = selectedShop?.shopId === shop.shopId ? '#eaf4ff' : '#f9f9f9'}
                                >
                                    <div>
                                        <strong style={{ fontSize: '1.2em', color: '#333' }}>{shop.shopName}</strong>
                                        <p style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>{shop.address}</p>
                                        <p style={{ fontSize: '0.8em', color: '#999' }}>
                                            영업 시간: {shop.openTime?.substring(0, 5)} ~ {shop.closeTime?.substring(0, 5)}
                                        </p>
                                    </div>
                                    {selectedShop?.shopId === shop.shopId && (
                                        <span style={{ fontSize: '1.5em', color: '#007bff' }}>✔</span>
                                    )}
                                </li>
                            ))}
                            {/* ⭐ 추가 데이터 로딩 중임을 표시 */}
                            {loading && availableShops.length > 0 && (
                                <p style={{ textAlign: 'center', color: '#555', marginTop: '10px' }}>더 많은 매장을 불러오는 중...</p>
                            )}
                            {/* ⭐ 모든 데이터를 불러왔음을 표시 */}
                            {!hasMore && availableShops.length > 0 && (
                                <p style={{ textAlign: 'center', color: '#888', marginTop: '10px' }}>더 이상 매장이 없습니다.</p>
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

// 모달 스타일 (ShopSelectionModal 외부에 정의되어야 합니다)
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

export default ShopSelectionModal;