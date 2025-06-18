import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {createRequest} from "../../api/procurementApi.jsx";
import {ProcurementCreateComponent} from "../../components/procurement/procurementCreate.jsx";


export default function ShopProcurementCreatePage() {
    const { shopId } = useParams();
    const navigate = useNavigate();
    const [note, setNote] = useState('');
    const [items, setItems] = useState([{ ingredientId: '', quantity: '' }]);

    const handleAddItem = () => setItems([...items, { ingredientId: '', quantity: '' }]);
    const handleChangeItem = (idx, field, value) => {
        const copy = [...items];
        copy[idx][field] = value;
        setItems(copy);
    };
    const handleSubmit = async () => {
        await createRequest(shopId, { note, items });
        navigate(`/shops/${shopId}/procurements`);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl mb-4">새 발주 요청</h1>
            <ProcurementCreateComponent
                note={note}
                items={items}
                onChangeNote={setNote}
                onChangeItem={handleChangeItem}
                onAddItem={handleAddItem}
                onSubmit={handleSubmit}
            />
        </div>
    );
}