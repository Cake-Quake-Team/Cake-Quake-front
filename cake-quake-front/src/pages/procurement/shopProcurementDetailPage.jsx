// src/pages/shop/ShopProcurementDetailPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getRequestDetail, cancelRequestBySeller } from '../../api/procurementApi.jsx';
import { getAllIngredients } from '../../api/ingredientApi.jsx';
import { ProcurementDetailComponent } from '../../components/procurement/procurementDetail.jsx';
import { CancelProcurementComponent } from '../../components/procurement/CancelProcurementComponent.jsx';
import AlertModal from '../../components/common/AlertModal';
import ConfirmModal from '../../components/common/ConfirmModal';

export default function ShopProcurementDetailPage() {
    const { shopId, procurementId } = useParams();
    const navigate = useNavigate();

    const [ingredients, setIngredients]     = useState([]);
    const [data,        setData]            = useState(null);
    const [loading,     setLoading]         = useState(true);
    const [error,       setError]           = useState(null);
    const [cancelLoading, setCancelLoading] = useState(false);

    // AlertModal state
    const [alertProps, setAlertProps] = useState({
        show: false,
        message: '',
        type: 'success'
    });
    const showAlert = (message, type = 'success') => {
        setAlertProps({ show: true, message, type });
        setTimeout(() => setAlertProps(a => ({ ...a, show: false })), 3000);
    };

    // confirm modal for cancellation
    const [confirmProps, setConfirmProps] = useState({
        show: false,
        reason: null
    });

    // 취소 폼 토글
    const [showCancelForm, setShowCancelForm] = useState(false);

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                const ingResp = await getAllIngredients({ page: 1, size: 1000 });
                const ingList = Array.isArray(ingResp.content) ? ingResp.content : ingResp;
                if (!isMounted) return;
                setIngredients(ingList);

                const res = await getRequestDetail(shopId, procurementId);
                const enrichedItems = (res.items || []).map(item => {
                    const found = ingList.find(x => x.ingredientId === item.ingredientId);
                    return { ...item, pricePerUnit: found?.pricePerUnit ?? 0 };
                });
                if (!isMounted) return;
                setData({ ...res, items: enrichedItems });
            } catch (err) {
                if (isMounted) setError(err);
            } finally {
                if (isMounted) setLoading(false);
            }
        })();
        return () => { isMounted = false; };
    }, [shopId, procurementId]);

    const totalPrice = useMemo(() => {
        if (!data?.items) return 0;
        return data.items.reduce(
            (sum, it) => sum + (it.pricePerUnit ?? 0) * (it.quantity ?? 0),
            0
        );
    }, [data]);

    // invoked by CancelProcurementComponent
    const handleCancelRequest = reason => {
        setConfirmProps({ show: true, reason });
    };

    // when user confirms in ConfirmModal
    const handleConfirmCancel = async () => {
        const reason = confirmProps.reason;
        setConfirmProps({ show: false, reason: null });
        setCancelLoading(true);
        try {
            await cancelRequestBySeller(shopId, procurementId, { reason });
            showAlert('발주가 취소되었습니다.', 'success');
            navigate(`/seller/${shopId}/procurements`);
        } catch (err) {
            console.error('취소 실패', err);
            showAlert('발주 취소에 실패했습니다.', 'error');
        } finally {
            setCancelLoading(false);
        }
    };

    const handleCancelAbort = () => {
        setConfirmProps({ show: false, reason: null });
    };

    if (loading) {
        return <p className="p-4 text-center">로딩 중...</p>;
    }
    if (error) {
        return (
            <div className="p-4 text-center text-red-600">
                <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
                <button
                    onClick={() => {
                        setLoading(true);
                        setError(null);
                        getRequestDetail(shopId, procurementId)
                            .then(res => setData(res))
                            .catch(err => setError(err))
                            .finally(() => setLoading(false));
                    }}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    다시 시도
                </button>
            </div>
        );
    }

    return (
        <>
            <AlertModal {...alertProps} />

            <ConfirmModal
                show={confirmProps.show}
                message="정말 이 발주를 취소하시겠습니까?"
                onConfirm={handleConfirmCancel}
                onCancel={handleCancelAbort}
            />

            <div className="container mx-auto p-4 space-y-6">
                <button
                    onClick={() => navigate(-1)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                    ← 뒤로
                </button>

                <ProcurementDetailComponent
                    data={data}
                    totalPrice={totalPrice}
                />

                {!showCancelForm && (
                    <button
                        onClick={() => setShowCancelForm(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        발주 취소하기
                    </button>
                )}

                {showCancelForm && (
                    <CancelProcurementComponent
                        onCancel={handleCancelRequest}
                        loading={cancelLoading}
                    />
                )}
            </div>
        </>
    );
}
