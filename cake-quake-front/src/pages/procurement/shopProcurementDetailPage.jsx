// src/pages/shop/ShopProcurementDetailPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getRequestDetail } from '../../api/procurementApi.jsx';
import { getAllIngredients } from '../../api/ingredientApi.jsx';          // 재료 API
import { ProcurementDetailComponent } from '../../components/procurement/procurementDetail.jsx';

export default function ShopProcurementDetailPage() {
    const { shopId, procurementId } = useParams();
    const navigate = useNavigate();

    const [ingredients, setIngredients] = useState([]); // 재료 단가 리스트
    const [data,        setData]        = useState(null);
    const [loading,     setLoading]     = useState(true);
    const [error,       setError]       = useState(null);

    // 1) 마운트 시 재료+발주 상세 동시 로딩 및 병합
    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                // 1-1) 재료 전체 조회 (단가 포함)
                const ingResp = await getAllIngredients({ page: 1, size: 1000 });
                const ingList = Array.isArray(ingResp.content) ? ingResp.content : ingResp;
                if (!isMounted) return;
                setIngredients(ingList);

                // 1-2) 발주 상세 조회
                const res = await getRequestDetail(shopId, procurementId);

                // 1-3) items마다 단가(price_per_unit) 병합
                const enrichedItems = (res.items || []).map(item => {
                    const found = ingList.find(x => x.ingredientId === item.ingredientId);
                    return {
                        ...item,
                        pricePerUnit: found?.pricePerUnit ?? 0,
                    };
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

    // 2) useMemo로 총합 계산
    const totalPrice = useMemo(() => {
        if (!data?.items) return 0;
        return data.items.reduce(
            (sum, it) => sum + (it.pricePerUnit ?? 0) * (it.quantity ?? 0),
            0
        );
    }, [data]);

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
                        // 간단 재시도
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
        <div className="container mx-auto p-4">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
                ← 뒤로
            </button>
            {/* data와 totalPrice를 컴포넌트에 넘김 */}
            <ProcurementDetailComponent
                data={data}
                totalPrice={totalPrice}
            />
        </div>
    );
}
