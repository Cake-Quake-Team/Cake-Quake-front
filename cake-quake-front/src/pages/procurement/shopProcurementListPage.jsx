import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getStoreRequests } from '../../api/procurementApi.jsx';
import { ProcurementListComponent } from '../../components/procurement/procurementList.jsx';

export default function ShopProcurementListPage() {
    const { shopId } = useParams();
    const navigate   = useNavigate();

    const [requests, setRequests] = useState([]);
    const [page, setPage]         = useState(1);
    const [hasNext, setHasNext]   = useState(false);

    // 1) 최초 마운트 시에는 항상 page=1만 fetch
    useEffect(() => {
        (async () => {
            try {
                const { content, hasNext } = await getStoreRequests(shopId, { page: 1, size: 10 });
                setRequests(content);      // 덮어쓰기
                setHasNext(hasNext);
                setPage(2);                // 다음 호출부터 page=2
            } catch (err) {
                console.error('발주 목록 로딩 실패', err);
            }
        })();
    }, [shopId]);

    // 2) 더 보기 클릭 시, page 상태에 따라 append
    const handleLoadMore = async () => {
        try {
            const { content, hasNext } = await getStoreRequests(shopId, { page, size: 10 });
            setRequests(prev => [...prev, ...content]);
            setHasNext(hasNext);
            setPage(prev => prev + 1);
        } catch (err) {
            console.error('더 보기 실패', err);
        }
    };

    const handleClickItem = id => {
        navigate(`/seller/${shopId}/procurements/${id}`);
    };

    // 발주 생성 버튼 클릭 핸들러
    const handleCreate = () => {
        navigate(`/seller/${shopId}/procurements/create`);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl mb-4">발주 목록</h1>
            <ProcurementListComponent
                requests={requests}
                hasNext={hasNext}
                onLoadMore={handleLoadMore}
                onClickItem={handleClickItem}
                onCreate={handleCreate}
            />
        </div>
    );
}
