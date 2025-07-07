
function ShopSelectionModal({ isOpen, onClose, onSelectShop, selectedShop, availableShops, loading, error }) {
    if (!isOpen) return null;

    const handleShopClick = (shop) => {
        onSelectShop(shop);
        // onClose(); // 매장 선택 후 모달을 자동으로 닫으려면 이 라인을 활성화
    };

    return (
        <div style={modalOverlayStyle}>
            <div style={{ ...modalContentStyle, maxWidth: '600px' }}> {/* 매장 목록이라 좀 더 넓게 */}
                <div style={modalHeaderStyle}>
                    <h3>매장 선택</h3>
                    <button onClick={onClose} style={closeButtonStyle}>✖</button>
                </div>
                <div style={modalBodyStyle}>
                    {loading ? (
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
                                            {/* 백엔드 LocalTime은 HH:MM:SS 형태로 올 수 있으므로, HH:MM만 표시하도록 수정 */}
                                            영업 시간: {shop.openTime?.substring(0, 5)} ~ {shop.closeTime?.substring(0, 5)}
                                        </p>
                                    </div>
                                    {selectedShop?.shopId === shop.shopId && (
                                        <span style={{ fontSize: '1.5em', color: '#007bff' }}>✔</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

// 모달 스타일은 DatePickerModal과 동일하게 사용 (ShopSelectionModal 외부에 정의되어야 합니다)
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