// src/pages/admin/IngredientFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
    createIngredient,
    getIngredientById,
    updateIngredient,
} from '../../api/ingredientApi.jsx';
import IngredientForm from '../../components/ingredients/ingredientForm.jsx';

export default function IngredientFormPage() {
    const { ingredientId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // description, pricePerUnit, stockQuantity 모두 포함한 단일 useState
    const [form, setForm] = useState({
        name:          '',
        unit:          '',
        pricePerUnit:  null,
        stockQuantity: null,
        description:   '',
    });

    // 수정 모드: 한 번만 API 에서 가져와서 초기화
    useEffect(() => {
        if (!ingredientId) return;
        setLoading(true);
        getIngredientById(+ingredientId)
            .then(data => {
                setForm({
                    name:           data.name          ?? '',
                    unit:           data.unit          ?? '',
                    pricePerUnit:   data.pricePerUnit  ?? null,
                    stockQuantity:  data.stockQuantity ?? null,
                    description:    data.description   ?? '',
                });
            })
            .finally(() => setLoading(false));
    }, [ingredientId]);

    // 모든 필드를 커버: 숫자 필드는 parseInt, 나머진 raw string
    const handleChange = field => e => {
        const raw = e.target.value;
        setForm(prev => ({
            ...prev,
            [field]:
                field === 'pricePerUnit' || field === 'stockQuantity'
                    ? (raw === '' ? null : parseInt(raw.replace(/,/g, ''), 10))
                    : raw
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (ingredientId) {
            await updateIngredient(+ingredientId, form);
        } else {
            await createIngredient(form);
        }
        navigate('/admin/ingredients');
    };

    if (loading) return <p className="p-4 text-center">로딩 중…</p>;

    return (
        <div className="container mx-auto p-4 max-w-md">
            <h1 className="text-xl mb-4">
                {ingredientId ? '재료 정보 수정' : '신규 재료 등록'}
            </h1>
            <IngredientForm
                form={form}
                onChangeName={handleChange('name')}
                onChangeUnit={handleChange('unit')}
                onChangePricePerUnit={handleChange('pricePerUnit')}
                onChangeStockQuantity={handleChange('stockQuantity')}
                onChangeDescription={handleChange('description')}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
