// src/pages/admin/procurement/AdminProcurementDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate }     from 'react-router';
import { getAdminRequestDetail }      from '../../api/procurementApi.jsx';
import { ProcurementDetailComponent } from '../../components/procurement/procurementDetail.jsx';

export default function AdminProcurementDetailPage() {
    const { procurementId } = useParams();
    const navigate          = useNavigate();

    const [data,    setData]    = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                // 1) 발주 상세 조회 (스냅샷으로 저장된 ingredientName, unitPrice 포함)
                const res = await getAdminRequestDetail(procurementId);

                if (!mounted) return;
                // 2) API가 돌려준 그대로 세팅
                setData(res);
            } catch (err) {
                console.error('관리자 상세 조회 오류', err);
                if (mounted) setError(err);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => { mounted = false; };
    }, [procurementId]);

    if (loading) {
        return <p className="p-6 text-center">로딩 중…</p>;
    }
    if (error || !data) {
        return (
            <div className="p-6 text-center text-red-600">
                상세 정보를 불러올 수 없습니다.
                <br/>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    뒤로가기
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-3xl">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-sm text-indigo-600 hover:underline"
            >
                ← 목록으로 돌아가기
            </button>

            {/* 스냅샷된 이름 · 단가 · 수량을 그대로 보여줌 */}
            <ProcurementDetailComponent
                data={data}
                totalPrice={data.totalPrice}
            />
        </div>
    );
}
