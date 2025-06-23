// src/pages/admin/AdminProcurementConfirmPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
    getAdminRequestDetail,
    confirmRequest,
    cancelRequestByAdmin
} from '../../api/procurementApi.jsx';
import { AdminProcurementConfirmComponent } from '../../components/procurement/procurementConfirmComponent.jsx';
import { CancelProcurementComponent }    from '../../components/procurement/CancelProcurementComponent.jsx';

export default function AdminProcurementConfirmPage() {
    const { procurementId } = useParams();
    const navigate = useNavigate();
    const [data,    setData]    = useState(null);
    const [loading,setLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);

    // 취소 폼 토글
    const [showCancelForm, setShowCancelForm] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await getAdminRequestDetail(procurementId);
                setData(res);
            } catch (err) {
                console.error('발주 상세 조회 실패', err);
                alert('상세 조회에 실패했습니다.');
                navigate('/admin/procurements');
            } finally {
                setLoading(false);
            }
        })();
    }, [procurementId, navigate]);

    const handleConfirm = async (date) => {
        setBtnLoading(true);
        try {
            await confirmRequest(procurementId, { scheduledDate: date });
            alert('일정이 지정되었습니다.');
            navigate('/admin/procurements');
        } catch (err) {
            console.error('일정 지정 실패', err);
            alert('일정 지정에 실패했습니다.');
        } finally {
            setBtnLoading(false);
        }
    };

    const handleCancel = async (reason) => {
        setBtnLoading(true);
        try {
            await cancelRequestByAdmin(procurementId, { reason });
            alert('발주가 취소되었습니다.');
            navigate('/admin/procurements');
        } catch (err) {
            console.error('발주 취소 실패', err);
            alert('발주 취소에 실패했습니다.');
        } finally {
            setBtnLoading(false);
        }
    };

    if (loading) return <p>로딩 중...</p>;
    if (!data)  return <p>데이터를 불러올 수 없습니다.</p>;

    return (
        <div className="container mx-auto p-4 space-y-6">
            {/* 일정 지정 영역 */}
            <AdminProcurementConfirmComponent
                data={data}
                onConfirm={handleConfirm}
                disabled={btnLoading}
            />

            {/* "취소하기" 토글 버튼 */}
            {!showCancelForm && (
                <div>
                    <button
                        onClick={() => setShowCancelForm(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        발주 취소하기
                    </button>
                </div>
            )}

            {/* 취소 폼 (토글된 경우에만) */}
            {showCancelForm && (
                <CancelProcurementComponent
                    onCancel={handleCancel}
                    loading={btnLoading}
                />
            )}
        </div>
    );
}
