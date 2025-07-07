import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import useCart from '../../hooks/useCart';
import CartList from '../../components/cart/CartList';
import CartPrice from '../../components/cart/CartPrice';
import CartActions from "../../components/cart/cartActions.jsx";
import DeleteModal from '../../components/cart/DeleteModal';
import SelectDeleteModal from '../../components/cart/SelectDeleteModal';

const SuccessMessageModal = ({ message, onClose }) => { // onConfirm 대신 onClose로 변경
    const navigate = useNavigate(); // useNavigate 훅 사용

    const handleGoToCart = () => {
        onClose(); // 모달 먼저 닫고
        navigate("/buyer/cart"); // 장바구니 페이지로 이동 (자기 자신 페이지이므로, reload 효과가 있을 수 있습니다.)
    };

    const handleContinueShopping = () => {
        onClose(); // 모달 닫기만 함
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center min-w-[300px]">
                <p className="text-lg font-semibold mb-6">{message}</p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <button
                        onClick={handleGoToCart}
                        className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 w-full sm:w-auto"
                    >
                        장바구니 확인하기
                    </button>
                    <button
                        onClick={handleContinueShopping}
                        className="bg-gray-300 text-gray-700 px-5 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200 w-full sm:w-auto"
                    >
                        쇼핑 계속하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function CartPage() {
    const navigate = useNavigate();
    const { items, cartTotalPrice, updateItem, removeItem, clearAllItems, fetchCart } = useCart();
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [modal, setModal] = useState({ type: null, id: null, message: '' });

    const cartItems = Array.isArray(items) ? items : [];

    const isAllSelected = cartItems.length > 0 && selectedIds.size === cartItems.length;

    useEffect(() => {
        const currentItemIds = new Set(cartItems.map(item => item.cartItemId));
        const newSelectedIds = new Set();
        selectedIds.forEach(id => {
            if (currentItemIds.has(id)) {
                newSelectedIds.add(id);
            }
        });
        setSelectedIds(newSelectedIds);
    }, [cartItems]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const toggleSelect = (id) => {
        setSelectedIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const toggleAllItems = () => {
        if (isAllSelected) {
            setSelectedIds(new Set());
        } else {
            const allItemIds = new Set(cartItems.map(item => item.cartItemId));
            setSelectedIds(allItemIds);
        }
    };

    const handleQuantityChange = async (id, newQty) => {
        try {
            await updateItem(id, newQty);
        } catch (e) {
            console.error('수량 변경 실패:', e);
            alert('수량 변경에 실패했습니다.');
            fetchCart();
        }
    };

    const handleRemoveSingleItem = async (id) => {
        try {
            await removeItem(id);
            openModal('success', null, '상품이 장바구니에서 삭제되었습니다.');
        } catch (e) {
            console.error('단일 상품 삭제 실패:', e);
            alert('상품 삭제에 실패했습니다.');
        } finally {
            closeModal();
        }
    };

    const deleteSelected = async () => {
        try {
            await Promise.all(Array.from(selectedIds).map(id => removeItem(id)));
            setSelectedIds(new Set());
            openModal('success', null, '선택된 상품들이 장바구니에서 삭제되었습니다.');
        } catch (e) {
            console.error('선택 상품 삭제 실패:', e);
            alert('선택된 상품 삭제에 실패했습니다.');
        } finally {
            closeModal();
        }
    };

    const handleOpenClearAllModal = () => {
        if (!isAllSelected) {
            alert("전체 선택을 해야만 장바구니를 비울 수 있습니다.");
            return;
        }
        if (cartItems.length === 0) {
            alert("장바구니가 이미 비어있습니다.");
            return;
        }
        openModal('all');
    };

    const handleConfirmClearAll = async () => {
        try {
            await clearAllItems();
            setSelectedIds(new Set());
            openModal('success', null, '장바구니가 모두 비워졌습니다.');
        } catch (e) {
            console.error('장바구니 전체 비우기 실패:', e);
            alert('장바구니를 비우는 데 실패했습니다.');
        } finally {
            closeModal();
        }
    };

    const openModal = (type, id = null, message = '') => setModal({ type, id, message });
    const closeModal = () => setModal({ type: null, id: null, message: '' });

    const handleOrderSelected = () => {
        const selectedItems = cartItems.filter(item => selectedIds.has(item.cartItemId));
        if (selectedItems.length === 0) {
            alert("주문할 상품을 1개 이상 선택해주세요.");
            return;
        }
        navigate('/buyer/orders/create', { state: { selectedItems } });
    };

    // ⭐ [추가] 전체 주문 핸들러 ⭐
    const handleOrderAll = () => {
        if (cartItems.length === 0) {
            alert("장바구니가 비어있습니다. 상품을 담아주세요.");
            return;
        }
        // 모든 장바구니 아이템을 CreateOrder 페이지로 전달
        navigate('/buyer/orders/create', { state: { selectedItems: cartItems } });
    };

    const isCartEmpty = cartItems.length === 0;

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6 text-center">CART</h1>

            {isCartEmpty ? (
                <p className="text-center text-gray-500 mt-8">
                    장바구니가 비어 있습니다.
                </p>
            ) : (
                <>
                    <div className="flex items-center justify-between border-b pb-3 mb-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={isAllSelected}
                                onChange={toggleAllItems}
                                className="mr-2 w-5 h-5 accent-blue-600"
                                aria-label="전체 상품 선택"
                            />
                            <span className="font-medium text-gray-700">
                                전체 선택 ({selectedIds.size}/{cartItems.length}개)
                            </span>
                        </div>
                    </div>

                    <CartList
                        title=""
                        items={cartItems}
                        selectedIds={Array.from(selectedIds)}
                        onToggleSelect={toggleSelect}
                        onQuantityChange={handleQuantityChange}
                        onRemoveClick={(id) => openModal('single', id)}
                    />
                </>
            )}
            <CartPrice
                items={cartItems}
                selectedIds={Array.from(selectedIds)}
                cartTotalPrice={cartTotalPrice}
            />

            <CartActions
                selectedCount={selectedIds.size}
                onClearSelected={() => {
                    if (selectedIds.size === 0) {
                        alert("선택된 상품이 없습니다.");
                        return;
                    }
                    openModal('multiple');
                }}
                onClearAll={handleOpenClearAllModal}
                onContinueShopping={() => navigate('/buyer')}
                onOrderSelected={handleOrderSelected}
                onOrderAll={handleOrderAll} // [추가] onOrderAll prop으로 핸들러 연결
                isAllSelected={isAllSelected}
            />

            {/* 단일 삭제 확인 모달 */}
            {modal.type === 'single' && (
                <DeleteModal
                    message="이 상품을 삭제하시겠어요?"
                    onConfirm={() => handleRemoveSingleItem(modal.id)}
                    onCancel={closeModal}
                />
            )}

            {/* 선택 삭제 확인 모달 */}
            {modal.type === 'multiple' && (
                <SelectDeleteModal
                    message="선택한 상품들을 삭제하시겠어요?"
                    onConfirm={deleteSelected}
                    onCancel={closeModal}
                />
            )}

            {/* 전체 비우기 확인 모달 */}
            {modal.type === 'all' && (
                <DeleteModal
                    message="장바구니를 모두 비우시겠어요?"
                    onConfirm={handleConfirmClearAll}
                    onCancel={closeModal}
                />
            )}

            {/* 삭제 성공 메시지 모달 */}
            {modal.type === 'success' && (
                <SuccessMessageModal
                    message={modal.message}
                    onConfirm={closeModal}
                />
            )}
        </div>
    );
}