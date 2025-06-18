import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import {getRequestDetail} from "../../api/procurementApi.jsx";
import {ProcurementDetailComponent} from "../../components/procurement/procurementDetail.jsx";


export default function ShopProcurementDetailPage() {
    const { shopId, procurementId } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        getRequestDetail(shopId, procurementId).then(setData);
    }, []);

    return (
        <div className="container mx-auto p-4">
            {data ? <ProcurementDetailComponent data={data} /> : <p>로딩 중...</p>}
        </div>
    );
}
