import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import useCart from '../../hooks/useCart';
import CartList from '../../components/cart/CartList';
import CartPrice from '../../components/cart/CartPrice';
import CartActions from "../../components/cart/cartActions.jsx";
import DeleteModal from '../../components/cart/DeleteModal';
import SelectDeleteModal from '../../components/cart/SelectDeleteModal';
// import { getCartItems } from '../../api/cartApi'; // useCart 내부에서 처리

// ⭐ 성공 메시지를 위한 새로운 모달 타입 컴포넌트 (DeleteModal을 재활용) ⭐
// 필요하다면 SuccessModal.jsx 파일을 따로 만들 수도 있습니다.
const SuccessMessageModal = ({ message, onConfirm }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold mb-4">{message}</p>
            <button
                onClick={onConfirm}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                확인
            </button>
        </div>
    </div>
);


export default function CartPage() {
    const navigate = useNavigate();
    // useCart 훅에서 fetchCart도 받아옴
    const { items, cartTotalPrice, updateItem, removeItem } = useCart();
    const [selectedIds, setSelectedIds] = useState([]);
    // modal 상태에 'success' 타입을 추가
    const [modal, setModal] = useState({ type: null, id: null, message: '' });


    const cartItems = Array.isArray(items) ? items : [];

    const toggleSelect = (id) =>
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );

    const handleQuantityChange = async (id, newQty) => {
        try {
            await updateItem(id, newQty);
            // alert('수량이 성공적으로 변경되었습니다.'); // 기존 alert 제거
        } catch (e) {
            // useCart 훅에서 이미 alert 처리하고 있다면 중복될 수 있음
        }
    };

    // ⭐ 단일 아이템 삭제 핸들러 (모달 연동) ⭐
    const handleRemoveSingleItem = async (id) => {
        try {
            await removeItem(id);
            openModal('success', null, '상품이 장바구니에서 삭제되었습니다.'); // 성공 모달 띄우기
        } catch (e) {
            // useCart 훅에서 이미 alert 처리하고 있다면 중복될 수 있음
        } finally {
            closeModal(); // 삭제 확인 모달 닫기
        }
    };

    // ⭐ 선택된 아이템 삭제 핸들러 (모달 연동) ⭐
    const deleteSelected = async () => {
        try {
            // Promise.all로 여러 아이템을 삭제 시도 (useCart.removeItem이 각자 API 호출)
            await Promise.all(selectedIds.map(id => removeItem(id)));
            setSelectedIds([]); // 삭제 성공 시 선택된 ID 초기화
            openModal('success', null, '선택된 상품들이 장바구니에서 삭제되었습니다.'); // 성공 모달 띄우기
        } catch (e) {
            // useCart 훅에서 이미 alert 처리하고 있다면 중복될 수 있음
        } finally {
            closeModal(); // 선택 삭제 확인 모달 닫기
        }
    };

    // ⭐ 전체 비우기 핸들러 (모달 연동) ⭐
    // const handleClearAll = async () => {
    //     try {
    //         await clearAllItems();
    //         openModal('success', null, '장바구니가 모두 비워졌습니다.'); // 성공 모달 띄우기
    //     } catch (e) {
    //         // useCart 훅에서 이미 alert 처리하고 있다면 중복될 수 있음
    //     } finally {
    //         closeModal(); // 전체 비우기 확인 모달 닫기
    //     }
    // };


    const openModal = (type, id = null, message = '') => setModal({ type, id, message });
    const closeModal = () => setModal({ type: null, id: null, message: '' });


    const handleOrderSelected = () => {
        const selectedItems = cartItems.filter(item => selectedIds.includes(item.cartItemId));
        if (selectedItems.length === 0) {
            alert("선택된 상품이 없습니다.");
            return;
        }
        navigate('/buyer/orders/create', { state: { selectedItems } });
    };

    const handleOrderAll = () => {
        if (cartItems.length === 0) {
            alert("장바구니가 비어있습니다.");
            return;
        }
        navigate('/buyer/orders/create', { state: { selectedItems: cartItems } });
    };

    const isCartEmpty = cartItems.length === 0;

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6 text-center">CART</h1>

            {isCartEmpty ? (
                <p className="text-center text-gray-500 mt-8">장바구니가 비어 있습니다.</p>
            ) : (
                <CartList
                    title=""
                    items={cartItems}
                    selectedIds={selectedIds}
                    onToggleSelect={toggleSelect}
                    onQuantityChange={handleQuantityChange}
                    // 단일 삭제 시 handleDeleteSingleItem 호출
                    onRemoveClick={(id) => openModal('single', id)} // 기존 onRemoveClick 그대로 사용
                />
            )}
            <CartPrice
                items={cartItems}
                selectedIds={selectedIds}
                cartTotalPrice={cartTotalPrice}
            />

            <CartActions
                onClearSelected={() => {
                    if (selectedIds.length === 0) {
                        alert("선택된 상품이 없습니다.");
                        return;
                    }
                    openModal('multiple');
                }}
                onClearAll={() => {
                    if (cartItems.length === 0) {
                        alert("장바구니가 이미 비어있습니다.");
                        return;
                    }
                    openModal('all');
                }}
                onContinueShopping={() => navigate('/buyer')}
                onOrderSelected={handleOrderSelected}
                onOrderAll={handleOrderAll}
            />

            {/* 단일 삭제 확인 모달 */}
            {modal.type === 'single' && (
                <DeleteModal
                    message="이 상품을 삭제하시겠어요?"
                    onConfirm={() => handleRemoveSingleItem(modal.id)} // ⭐ handleRemoveSingleItem 호출 ⭐
                    onCancel={closeModal}
                />
            )}

            {/* 선택 삭제 확인 모달 */}
            {modal.type === 'multiple' && (
                <SelectDeleteModal
                    message="선택한 상품들을 삭제하시겠어요?"
                    onConfirm={deleteSelected} // deleteSelected 함수 실행
                    onCancel={closeModal}
                />
            )}

            {/* 전체 비우기 확인 모달 */}
            {/*{modal.type === 'all' && (*/}
            {/*    <DeleteModal*/}
            {/*        message="장바구니를 모두 비우시겠어요?"*/}
            {/*        onConfirm={handleClearAll} // ⭐ handleClearAll 호출 ⭐*/}
            {/*        onCancel={closeModal}*/}
            {/*    />*/}
            {/*)}*/}

            {/* ⭐ 삭제 성공 메시지 모달 ⭐ */}
            {modal.type === 'success' && (
                <SuccessMessageModal
                    message={modal.message}
                    onConfirm={closeModal} // '확인' 버튼 누르면 모달 닫기 (이후 화면은 이미 업데이트됨)
                />
            )}
        </div>
    );
}