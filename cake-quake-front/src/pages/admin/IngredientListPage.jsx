// src/pages/admin/IngredientListPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { deleteIngredient, getAllIngredients } from "../../api/ingredientApi.jsx";
import IngredientList from "../../components/ingredients/ingredientList.jsx";
import AlertModal from "../../components/common/AlertModal";
import ConfirmModal from "../../components/common/ConfirmModal";

export default function IngredientListPage() {
    const [ingredients, setIngredients] = useState([]);
    const [page, setPage]         = useState(1);
    const [hasNext, setHasNext]   = useState(false);

    // 알림용
    const [alertProps, setAlertProps] = useState({
        show: false, message: '', type: 'success'
    });
    const showAlert = (message, type = 'success') => {
        setAlertProps({ show: true, message, type });
        setTimeout(() => setAlertProps(a => ({ ...a, show: false })), 3000);
    };

    // 삭제 확정 모달용
    const [confirmProps, setConfirmProps] = useState({ show: false, id: null });

    const navigate = useNavigate();
    const mountedRef = useRef(false);

    useEffect(() => {
        if (mountedRef.current) return;
        mountedRef.current = true;
        fetchIngredients();
    }, []);

    const fetchIngredients = async () => {
        try {
            const { content, hasNext: next } = await getAllIngredients({ page, size: 20 });
            if (!Array.isArray(content)) return console.error('Invalid payload.content:', content);
            setIngredients(prev => [...prev, ...content]);
            setHasNext(next);
            setPage(prev => prev + 1);
        } catch (err) {
            console.error('Failed to fetch ingredients', err);
            showAlert('재료 목록을 불러오는 데 실패했습니다.', 'error');
        }
    };

    const handleEdit = (id) => navigate(`/admin/ingredients/${id}/edit`);

    // '삭제' 버튼 클릭 → 모달 열기
    const handleDeleteClick = (id) => {
        setConfirmProps({ show: true, id });
    };

    // 모달에서 '확인' 클릭
    const handleConfirmDelete = async () => {
        const id = confirmProps.id;
        setConfirmProps({ show: false, id: null });
        // Optimistic UI
        setIngredients(prev => prev.filter(item => item.ingredientId !== id));

        try {
            await deleteIngredient(id);
            showAlert('재료가 성공적으로 삭제되었습니다.', 'success');
        } catch (err) {
            console.error('삭제 실패', err);
            showAlert('삭제에 실패했습니다. 목록을 다시 불러옵니다.', 'error');
            setIngredients([]);
            setPage(1);
            fetchIngredients();
        }
    };

    // 모달에서 '취소' 클릭
    const handleCancelDelete = () => {
        setConfirmProps({ show: false, id: null });
    };

    return (
        <>
            {/* 알림 모달 */}
            <AlertModal {...alertProps} />

            {/* 삭제 확인 모달 */}
            <ConfirmModal
                show={confirmProps.show}
                message="정말 삭제하시겠습니까?"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />

            <div className="container mx-auto p-4">
                <h1 className="text-2xl mb-4">발주 재료 관리</h1>
                <button
                    onClick={() => navigate('/admin/ingredients/new')}
                    className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
                >
                    신규 등록
                </button>
                <IngredientList
                    items={ingredients}
                    hasNext={hasNext}
                    onLoadMore={fetchIngredients}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}  // 여기서 클릭만 처리
                />
            </div>
        </>
    );
}
