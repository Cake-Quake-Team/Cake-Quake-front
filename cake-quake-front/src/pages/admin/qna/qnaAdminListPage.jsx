// src/pages/admin/QnAAdminListPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router'; // react-router → react-router-dom
import {
    listAllQnA,
    listQnAByAuthorRole,
    listQnAByStatus,
    listQnAByType
} from '../../../api/qnaApi.jsx';
import {QnAAdminList} from "../../../components/qna/qnaAdminList.jsx";


// 한글 라벨 맵핑 (필터 버튼/드롭다운에 사용)
const statusOptions = [
    { value: '',           label: '전체'       },
    { value: 'OPEN',       label: '접수됨'     },
    { value: 'CLOSED',     label: '완료'       }
];
const typeOptions = [
    { value: '', label: '전체 유형' },
    { value: 'STORE_REPORT',         label: '매장 신고' },
    { value: 'FEATURE_REQUEST',      label: '기능 개선 요청' },
    { value: 'GENERAL_INQUIRY',      label: '일반 문의' },
    { value: 'NEW_MATERIAL_REQUEST', label: '재료 추가 요청' }
];
const roleOptions = [
    { value: '', label: '전체 역할' },
    { value: 'BUYER',  label: '구매자' },
    { value: 'SELLER', label: '판매자' }
];

export default function QnAAdminListPage() {
    const { status = '', type = '', role = '' } = useParams();
    const [items, setItems]     = useState([]);
    const [page, setPage]       = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const navigate = useNavigate();
    const size = 10;

    // 데이터 호출
    const fetch = async (p = 1) => {
        let payload;
        if (type)       payload = await listQnAByType(type,       { page: p, size });
        else if (status)payload = await listQnAByStatus(status,   { page: p, size });
        else if (role)  payload = await listQnAByAuthorRole(role, { page: p, size });
        else            payload = await listAllQnA({ page: p, size });
        console.log('QnA payload:', payload);
        setItems(p === 1
            ? payload.content
            : prev => [...prev, ...payload.content]
        );
        setHasNext(payload.hasNext);
        setPage(p);
    };

    // 상태/유형/역할 바뀔 때 새로 로드
    useEffect(() => { fetch(1); }, [status, type, role]);

    // 필터 핸들러
    const onFilterChange = ({ status, type, role }) => {
        // 우선 page 초기화, URL 변경
        navigate(
            `/admin/qna${status ? `/status/${status}` : ''}` +
            `${type   ? `/type/${type}`     : ''}` +
            `${role   ? `/role/${role}`     : ''}`
        );
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">문의 관리</h1>

            {/* ─── 필터 바 ────────────────────────── */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                {/* 상태 버튼 */}
                {statusOptions.map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => onFilterChange({ status: opt.value, type: '', role: '' })}
                        className={`px-3 py-1 rounded ${
                            status === opt.value
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        } transition`}
                    >
                        {opt.label}
                    </button>
                ))}

                {/* 유형 드롭다운 */}
                <select
                    value={type}
                    onChange={e => onFilterChange({ status: '', type: e.target.value, role: '' })}
                    className="px-3 py-1 border border-gray-300 rounded focus:outline-none"
                >
                    {typeOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                {/* 역할 드롭다운 */}
                <select
                    value={role}
                    onChange={e => onFilterChange({ status: '', type: '', role: e.target.value })}
                    className="px-3 py-1 border border-gray-300 rounded focus:outline-none"
                >
                    {roleOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* ─── 리스트 ────────────────────────── */}
            <QnAAdminList items={items} onRespond={id => navigate(`/admin/qna/${id}/respond`)} />

            {/* ─── 페이징 ────────────────────────── */}
            {hasNext && (
                <div className="text-center mt-6">
                    <button
                        onClick={() => fetch(page + 1)}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                        더 보기
                    </button>
                </div>
            )}
        </div>
    );
}
