// src/pages/admin/AdminProcurementConfirmPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
    getAdminRequestDetail,
    confirmRequest
} from '../../api/procurementApi.jsx';
import {AdminProcurementConfirmComponent} from "../../components/procurement/procurementConfirmComponent.jsx";

export default function AdminProcurementConfirmPage() {
    const { procurementId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await getAdminRequestDetail(procurementId);
                setData(res);
            } catch (err) {
                console.error('발주 상세 조회 실패', err);
            } finally {
                setLoading(false);
            }
        })();
    }, [procurementId]);

    const handleConfirm = async (date) => {
        try {
            await confirmRequest(procurementId, { scheduledDate: date });
            alert('일정이 지정되었습니다.');
            navigate('/admin/procurements');
        } catch (err) {
            console.error('일정 지정 실패', err);
            alert('일정 지정에 실패했습니다.');
        }
    };

    if (loading) return <p>로딩 중...</p>;
    if (!data) return <p>데이터를 불러올 수 없습니다.</p>;

    return (
        <div className="container mx-auto p-4">
            <AdminProcurementConfirmComponent
                data={data}
                onConfirm={handleConfirm}
            />
        </div>
    );
}
