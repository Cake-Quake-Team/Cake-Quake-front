import React, { useEffect, useState, useRef, useCallback } from 'react';
import {useNavigate, useParams} from "react-router";
import {Link} from 'react-router';
import {ArrowLeft} from "lucide-react";
import {getShopNotices} from "../../../api/shopApi.jsx";


const BuyerNoticeListPage = () => {
    const { shopId } = useParams();
    const navigate = useNavigate();
    const [notices, setNotices] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const observerTarget = useRef(null);

    const loadMore = useCallback(async () => {
        if (!hasNext || isLoading) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const data = await getShopNotices(shopId, { page: page, size: 10 });

            setNotices(prevNotices => {
                const newNoticesMap = new Map(prevNotices.map(n => [n.shopNoticeId, n]));
                (data.content || []).forEach(newNotice => {
                    newNoticesMap.set(newNotice.shopNoticeId, newNotice);
                });
                return Array.from(newNoticesMap.values());
            });

            setHasNext(data.hasNext);
            setPage(prev => prev + 1);

        } catch (err) {
            console.error('공지사항 불러오기 실패:', err);
            setError("공지사항 목록을 불러오는 데 실패했습니다. 다시 시도해주세요.");
            setHasNext(false);
        } finally {
            setIsLoading(false);
        }
    }, [shopId, page, hasNext, isLoading]);

    useEffect(() => {
        setNotices([]);
        setPage(1);
        setHasNext(true);
        setError(null);
        setIsLoading(false);
    }, [shopId]);

    useEffect(() => {
        if (!observerTarget.current || !hasNext || isLoading) {
            return;
        }

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            {
                rootMargin: '100px',
                threshold: 0.1,
            }
        );

        observer.observe(observerTarget.current);

        return () => {
            observer.disconnect();
        };
    }, [loadMore, hasNext, isLoading]);

    if (error) {
        return (
            <div className="p-4 max-w-3xl mx-auto text-center text-red-600">
                <p className="font-semibold text-lg mb-2">데이터 로드 오류:</p>
                <p>{error}</p>
                <p className="text-sm mt-2">다시 시도해주세요.</p>
            </div>
        );
    }

    if (notices.length === 0 && isLoading) {
        return (
            <div className="p-4 max-w-3xl mx-auto text-center text-gray-500">
                <p>공지사항을 불러오는 중입니다...</p>
            </div>
        );
    }

    if (notices.length === 0 && !hasNext && !isLoading) {
        return (
            <div className="p-4 max-w-3xl mx-auto text-center text-gray-500">
                <p>등록된 공지사항이 없습니다.</p>
                <div className="mt-6">
                    <button
                        onClick={() => navigate(`/buyer/shops/${shopId}`)}
                        className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        매장으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-3xl mx-auto bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-10 mt-6 pb-2 border-b border-gray-200">
                <span className="mr-3">📢</span> 매장 공지사항
            </h1>

            {/* Back to Shop Button */}
            <div className="flex justify-start mb-8"> {/* Changed to justify-start */}
                <button
                    onClick={() => navigate(`/buyer/shops/${shopId}`)}
                    className="flex items-center text-gray-500 hover:text-blue-600 cursor-pointer text-sm transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    매장으로 돌아가기
                </button>
            </div>


            <ul className="space-y-6">
                {notices.map(notice => (
                    <li key={notice.shopNoticeId}
                        className="border border-gray-200 p-6 rounded-xl shadow-sm bg-white hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer" >
                        <Link
                            to={`/buyer/shops/${shopId}/notices/${notice.shopNoticeId}`} // Added leading slash for absolute path
                            className="block"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <h2 className="text-xl font-bold text-gray-800 mb-2">{notice.title}</h2>
                            <p className="text-gray-700 text-base leading-relaxed mb-3 whitespace-pre-wrap line-clamp-3">{notice.content}</p>
                            <p className="text-sm text-gray-500">
                                등록일: {notice.regDate ? new Date(notice.regDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                            </p>
                        </Link>
                    </li>
                ))}
            </ul>

            <div ref={observerTarget} className="py-10 flex items-center justify-center">
                {isLoading && notices.length > 0 && (
                    <div className="flex items-center text-gray-500">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mr-2"></div>
                        <p>공지사항을 더 불러오는 중...</p>
                    </div>
                )}
                {!hasNext && notices.length > 0 && !isLoading && (
                    <p className="text-gray-500 text-md">--- 모든 공지사항을 불러왔습니다 ---</p>
                )}
            </div>
        </div>
    );
};
export default BuyerNoticeListPage;
