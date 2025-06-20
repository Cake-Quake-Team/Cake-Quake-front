// src/pages/admin/IngredientListPage.jsx
import React, {useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router';
import {deleteIngredient, getAllIngredients} from "../../api/ingredientApi.jsx";
import IngredientList from "../../components/ingredients/ingredientList.jsx";

export default function IngredientListPage() {
    const [ingredients, setIngredients] = useState([]);
    const [page, setPage]         = useState(1);
    const [hasNext, setHasNext]   = useState(false);
    const navigate = useNavigate();
    const mountedRef = useRef(false);

    useEffect(() => {
        if(mountedRef.current) return;
        mountedRef.current = true;
        fetchIngredients();
    }, []);

    const fetchIngredients = async () => {
        try {
            // ① 응답 구조분해
            const { content, hasNext: next } = await getAllIngredients({ page, size: 20 });

            // ② content 가 배열인지 확인
            if (!Array.isArray(content)) {
                console.error('Invalid payload.content:', content);
                return;
            }

            setIngredients(prev => [...prev, ...content]);
            setHasNext(next);
            setPage(prev => prev + 1);
        } catch (err) {
            console.error('Failed to fetch ingredients', err);
        }
    };

    const handleEdit = (id) => navigate(`/admin/ingredients/${id}/edit`);
    const handleDelete = async (id) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        // 1. Optimistic UI: 로컬 상태에서 즉시 제거
        setIngredients(prev => prev.filter(item => item.ingredientId !== id));

        try {
            // 2. 실제 API 호출
            await deleteIngredient(id);
            // 3. 성공 시: 따로 할 일 없음 (이미 화면에서 사라짐)
        } catch (err) {
            console.error('삭제 실패', err);
            alert('삭제에 실패했습니다. 목록을 다시 불러옵니다.');
            // 4. 실패 시: 전체 목록을 리셋 후 새로고침
            setIngredients([]);
            setPage(1);
            fetchIngredients();
        }
    };

    return (
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
                onDelete={handleDelete}
            />
        </div>
    );
}
