import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { createRequest } from '../../api/procurementApi.jsx';
import { getAllIngredients } from '../../api/ingredientApi.jsx';
import { ProcurementCreateComponent } from '../../components/procurement/procurementCreate.jsx';

export default function ShopProcurementCreatePage() {
    const { shopId } = useParams();
    const navigate   = useNavigate();

    const [note,        setNote]        = useState('');
    const [items,       setItems]       = useState([{ ingredientId: '', quantity: '' }]);
    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        (async () => {
            const resp = await getAllIngredients({ page: 1, size: 1000 });
            const list = Array.isArray(resp.content) ? resp.content : resp;
            setIngredients(list);
        })();
    }, [shopId]);

    const handleAddItem = () =>
        setItems(prev => [...prev, { ingredientId: '', quantity: '' }]);

    const handleRemoveItem = idx =>
        setItems(prev => prev.filter((_, i) => i !== idx));

    const handleChangeItem = (idx, field, value) =>
        setItems(prev => {
            const next = [...prev];
            next[idx][field] = value;
            return next;
        });

    const handleSubmit = async () => {
        const payload = {
            note,
            items: items.map(it => ({
                ingredientId: parseInt(it.ingredientId, 10),
                quantity:     parseInt(it.quantity,     10),
            })),
        };
        await createRequest(shopId, payload);
        navigate(`/seller/${shopId}/procurements`);
    };

    // ▶ useMemo로 totalPrice 계산
    const totalPrice = useMemo(() => {
        return items.reduce((sum, it) => {
            const ing = ingredients.find(x => x.ingredientId === Number(it.ingredientId));
            const unitPrice = ing?.pricePerUnit || 0;
            const qty       = Number(it.quantity) || 0;
            return sum + unitPrice * qty;
        }, 0);
    }, [items, ingredients]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl mb-4">새 발주 요청</h1>
            <ProcurementCreateComponent
                note={note}
                items={items}
                ingredients={ingredients}
                onChangeNote={setNote}
                onChangeItem={handleChangeItem}
                onAddItem={handleAddItem}
                onRemoveItem={handleRemoveItem}
                onSubmit={handleSubmit}
                totalPrice={totalPrice}          // 전달
            />
        </div>
    );
}
