const ShopSelectionModal = ({ isOpen, onClose, shops, onSelectShop }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="예약 가능한 매장 선택"
            style={{
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    maxWidth: '500px',
                    maxHeight: '80%',
                    overflowY: 'auto',
                },
            }}
        >
            <h2>예약 가능한 매장 선택</h2>
            {shops.length > 0 ? (
                <ul>
                    {shops.map((shop) => (
                        <li key={shop.shopId} style={{ marginBottom: '10px', border: '1px solid #eee', padding: '10px', cursor: 'pointer' }} onClick={() => onSelectShop(shop)}>
                            <strong>{shop.shopName}</strong>
                            <p>{shop.address}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>선택하신 시간대에 예약 가능한 매장이 없습니다.</p>
            )}
            <button onClick={onClose} style={{ marginTop: '20px' }}>닫기</button>
        </Modal>
    );
};

export default ShopSelectionModal;