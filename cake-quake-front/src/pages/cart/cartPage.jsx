import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import CartList from '../../components/cart/CartList';
import CartPrice from '../../components/cart/CartPrice';
import DeleteModal from '../../components/cart/DeleteModal';
import SelectDeleteModal from '../../components/cart/SelectDeleteModal';
import { getCartItems } from '../../api/cartApi';

export default function CartPage() {
    const navigate = useNavigate();
    const { items, updateItem, removeItem, clearAllItems } = useCart();
    const [selectedIds, setSelectedIds] = useState([]);
    const [modal, setModal] = useState({ type: null, id: null });

    useEffect(() => {
        getCartItems()
            .then(res => {
                console.log("✅ 장바구니 응답:", res);
            })
            .catch(err => {
                console.error("❌ 장바구니 에러:", err);
            });
    }, []);

    const safeItems = Array.isArray(items) ? items : [];

    const toggleSelect = (id) =>
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );

    const handleQuantityChange = (id, delta) => {
        const item = safeItems.find((i) => i.cartItemId === id);
        if (!item) return;
        const newQty = Math.max(1, item.productCnt + delta);
        updateItem(item.cartItemId, newQty);
    };

    const deleteSelected = async () => {
        await Promise.all(selectedIds.map(removeItem));
        setSelectedIds([]);
        closeModal();
    };

    const openModal = (type, id = null) => setModal({ type, id });
    const closeModal = () => setModal({ type: null, id: null });

    const cartItems = Array.isArray(items) ? items : [];

    const totalPrice = cartItems.reduce((sum, i) => {
        const price = Number(i?.price ?? 0);
        const qty = Number(i?.productCnt ?? 0);
        return sum + price * qty;
    }, 0);

    // ✅ 선택한 항목만 주문 페이지로 이동
    const handleOrderSelected = () => {
        const selectedItems = cartItems.filter(item => selectedIds.includes(item.cartItemId));
        navigate('/buyer/orders/create', { state: { selectedItems } });
    };

    // ✅ 전체 항목 주문 페이지로 이동
    const handleOrderAll = () => {
        navigate('/buyer/orders/create', { state: { selectedItems: cartItems } });
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6 text-center">CART</h1>

            {cartItems.length > 0 ? (
                <CartList
                    title=""
                    items={cartItems}
                    selectedIds={selectedIds}
                    onToggleSelect={toggleSelect}
                    onQuantityChange={handleQuantityChange}
                    onRemoveClick={(id) => openModal('single', id)}
                />
            ) : (
                <p className="text-center text-gray-500 mt-8">장바구니가 비어 있습니다.</p>
            )}

            <CartPrice
                totalPrice={totalPrice}
                selectedCount={selectedIds.length}
                onClearSelected={() => openModal('multiple')}
                onClearAll={() => openModal('all')}
                onContinueShopping={() => console.log('쇼핑 계속하기 클릭')}
                onOrderSelected={handleOrderSelected}  // ✅ 선택 주문
                onOrderAll={handleOrderAll}            // ✅ 전체 주문
            />

            {modal.type === 'single' && (
                <DeleteModal
                    message="이 상품을 삭제하시겠어요?"
                    onConfirm={() => {
                        removeItem(modal.id);
                        closeModal();
                    }}
                    onCancel={closeModal}
                />
            )}

            {modal.type === 'multiple' && (
                <SelectDeleteModal
                    onConfirm={deleteSelected}
                    onCancel={closeModal}
                />
            )}

            {modal.type === 'all' && (
                <DeleteModal
                    message="장바구니를 모두 비우시겠어요?"
                    onConfirm={() => {
                        clearAllItems();
                        closeModal();
                    }}
                    onCancel={closeModal}
                />
            )}
        </div>
    );
}
