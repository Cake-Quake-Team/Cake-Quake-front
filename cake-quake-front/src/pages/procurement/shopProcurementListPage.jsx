import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {getStoreRequests} from "../../api/procurementApi.jsx";
import {ProcurementListComponent} from "../../components/procurement/procurementList.jsx";


export default function ShopProcurementListPage() {
    const { shopId } = useParams();
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);

    useEffect(() => {
        fetchList();
    }, []);

    const fetchList = async () => {
        const res = await getStoreRequests(shopId, { page, size: 10 });
        setRequests(prev => [...prev, ...res.content]);
        setHasNext(res.hasNext);
        setPage(prev => prev + 1);
    };

    const handleClickItem = id => {
        navigate(`/shops/${shopId}/procurements/${id}`);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl mb-4">매장 {shopId} 발주 목록</h1>
            <ProcurementListComponent
                requests={requests}
                hasNext={hasNext}
                onLoadMore={fetchList}
                onClickItem={handleClickItem}
            />
        </div>
    );
}
