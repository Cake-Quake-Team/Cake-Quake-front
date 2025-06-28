// src/pages/admin/AdminProcurementConfirmPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate }   from 'react-router';
import {
    getAdminRequestDetail,
    confirmRequest,
    cancelRequestByAdmin
} from '../../api/procurementApi.jsx';
import { getAllIngredients }        from '../../api/ingredientApi.jsx';


import { CancelProcurementComponent }
    from '../../components/procurement/CancelProcurementComponent.jsx';
import {AdminProcurementConfirmComponent} from "../../components/procurement/procurementConfirmComponent.jsx";

export default function AdminProcurementConfirmPage() {
    const { procurementId } = useParams();
    const navigate          = useNavigate();

    const [ingredients,    setIngredients]    = useState([]);
    const [data,           setData]           = useState(null);
    const [loading,        setLoading]        = useState(true);
    const [btnLoading,     setBtnLoading]     = useState(false);
    const [showCancelForm, setShowCancelForm] = useState(false);
    const [error,          setError]          = useState(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                // 1) 전체 재료 단가 목록
                const ingResp = await getAllIngredients({ page: 1, size: 1000 });
                const ingList = Array.isArray(ingResp.content) ? ingResp.content : ingResp;
                if (!mounted) return;
                setIngredients(ingList);

                // 2) 발주 상세
                const res = await getAdminRequestDetail(procurementId);
                if (!mounted) return;

                // 3) 각 아이템에 단가 매핑
                const enrichedItems = (res.items || []).map(item => {
                    const found = ingList.find(x => x.ingredientId === item.ingredientId);
                    return {
                        ...item,
                        pricePerUnit: found?.pricePerUnit ?? 0
                    };
                });

                // totalPrice 는 백엔드에서 내려주므로 data.totalPrice 유지
                setData({ ...res, items: enrichedItems });
            } catch (err) {
                console.error(err);
                setError(err);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [procurementId]);

    const handleConfirm = async date => {
        setBtnLoading(true);
        try {
            await confirmRequest(procurementId, { scheduledDate: date });
            alert('일정이 지정되었습니다.');
            navigate('/admin/procurements');
        } catch {
            alert('일정 지정에 실패했습니다.');
        } finally {
            setBtnLoading(false);
        }
    };

    const handleCancel = async reason => {
        setBtnLoading(true);
        try {
            await cancelRequestByAdmin(procurementId, { reason });
            alert('발주가 취소되었습니다.');
            navigate('/admin/procurements');
        } catch {
            alert('발주 취소에 실패했습니다.');
        } finally {
            setBtnLoading(false);
        }
    };

    if (loading) {
        return <p className="p-6 text-center">로딩 중…</p>;
    }
    if (error || !data) {
        return (
            <div className="p-6 text-center text-red-600">
                데이터 로딩에 실패했습니다.
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/** 항상 렌더링 **/}
            <AdminProcurementConfirmComponent
                data={data}
                onConfirm={handleConfirm}
                disabled={btnLoading}
            />

            {/** 취소 버튼은 REQUESTED 상태일 때만 **/}
            {data.status === 'REQUESTED' && (
                <div className="bg-white shadow rounded-lg border border-red-200 p-4">
                    {!showCancelForm ? (
                        <button
                            onClick={() => setShowCancelForm(true)}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            발주 취소하기
                        </button>
                    ) : (
                        <CancelProcurementComponent
                            onCancel={handleCancel}
                            loading={btnLoading}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
