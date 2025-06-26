import React, { useEffect, useState, useRef, useCallback } from 'react';
import {useNavigate, useParams} from "react-router";
import {getShopNotices} from "../../api/shopApi.jsx";
import {Link} from 'react-router';
import {ArrowLeft} from "lucide-react";


const ShopNoticeListPage = () => {
    const { cid } = useParams(); // URL에서 매장 ID를 'cid'로 가져옵니다.
    const navigate =useNavigate();
    const [notices, setNotices] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(true); // 더 로드할 데이터가 있는지 여부
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const observerTarget = useRef(null);

    // 데이터를 비동기적으로 로드하는 함수
    const loadMore = useCallback(async () => {
        if (!hasNext || isLoading) { // <--- 더 이상 데이터가 없거나 이미 로딩 중이면 함수 종료
            return;
        }

        setIsLoading(true); // <--- 로딩 시작
        setError(null); // 에러 초기화

        try {

            const data = await getShopNotices(cid, { page: page , size: 10 });

            // <--- 중복 방지를 위한 Map 로직 강화 (이전 상태와 새 데이터를 합칠 때 사용)
            setNotices(prevNotices => {
                const newNoticesMap = new Map(prevNotices.map(n => [n.shopNoticeId, n])); // 기존 데이터를 Map에 담기
                (data.content || []).forEach(newNotice => {
                    newNoticesMap.set(newNotice.shopNoticeId, newNotice); // 새로 받은 데이터 추가 (중복 시 덮어쓰기)
                });
                return Array.from(newNoticesMap.values()); // Map의 값들을 배열로 변환하여 반환
            });

            setHasNext(data.hasNext); // 백엔드 응답의 hasNext 값으로 업데이트
            setPage(prev => prev + 1); // 다음 페이지 번호로 업데이트

        } catch (err) {
            console.error('공지사항 불러오기 실패:', err);
            setError("공지사항 목록을 불러오는 데 실패했습니다. 다시 시도해주세요.");
            setHasNext(false); // 오류 발생 시 더 이상 로드하지 않도록 설정
        } finally {
            setIsLoading(false); // <--- 로딩 종료
        }
    }, [cid, page, hasNext, isLoading]);

    // 컴포넌트가 처음 마운트되거나 cid가 변경될 때 첫 페이지를 로드
    useEffect(() => {
        setNotices([]); // 매장 ID 변경 시 기존 목록 초기화
        setPage(1);
        setHasNext(true);
        setError(null);
        setIsLoading(false);
    }, [cid]);

    // Intersection Observer 설정
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

    // 에러 발생 시
    if (error) {
        return (
            <div className="p-4 max-w-3xl mx-auto text-center text-red-600">
                <p className="font-semibold text-lg mb-2">데이터 로드 오류:</p>
                <p>{error}</p>
                <p className="text-sm mt-2">다시 시도해주세요.</p>
            </div>
        );
    }

    // 초기 로딩 중 (데이터가 아직 없으면서 로딩 중)
    if (notices.length === 0 && isLoading) {
        return (
            <div className="p-4 max-w-3xl mx-auto text-center text-gray-500">
                <p>공지사항을 불러오는 중입니다...</p>
            </div>
        );
    }

    // 공지사항이 없는 경우
    if (notices.length === 0 && !hasNext && !isLoading) {
        return (
            <div className="p-4 max-w-3xl mx-auto text-center text-gray-500">
                <p>등록된 공지사항이 없습니다.</p>
                <div className="mt-6">
                    <button
                        onClick={() => navigate(`/shops/read/${cid}/notices/new`)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors text-lg"
                    >
                        새 공지사항 작성
                    </button>
                </div>
            </div>
        );
    }

    // 정상적인 공지사항 목록 렌더링
    return (
        <div className="p-4 max-w-3xl mx-auto bg-gray-50 min-h-screen">

            <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-10 mt-6 pb-2 border-b border-gray-200">
                <span className="mr-3">📢</span> 매장 공지사항
            </h1>

           {/*공지사항 생성 버튼*/}
            <div className="flex justify-between items-center mb-8">
                <div className="flex justify-between items-center mb-8">
                <span
                    onClick={() => navigate(`/shops/${cid}`)}
                    className="flex items-center text-gray-500 hover:text-blue-600 cursor-pointer text-sm transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    목록으로 돌아가기
                </span>
                </div>
                <button
                    onClick={() => navigate(`/shops/read/${cid}/notices/new`)}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors text-md"
                >
                    새 공지사항 작성
                </button>
            </div>

            <ul className="space-y-6">
                {notices.map(notice => (
                    // ✨ 각 공지사항 li를 Link 컴포넌트로 감쌉니다.
                    <li key={notice.shopNoticeId}
                        className="border border-gray-200 p-6 rounded-xl shadow-sm bg-white hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer" >
                        <Link

                            to={`/shops/read/${cid}/notices/${notice.shopNoticeId}`}
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

            {/* 무한 스크롤 옵저버 타겟 및 로딩/완료 메시지 */}
            <div ref={observerTarget} className="py-10 flex items-center justify-center"> {/* 상하 패딩 증가 */}
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
export default ShopNoticeListPage;
