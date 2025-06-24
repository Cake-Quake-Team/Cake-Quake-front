import {useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {getShopNoticeDetail} from "../../../api/shopApi.jsx";

const BuyerNoticeDetailPage = () => {
    const {shopId, noticeId} = useParams();
    const navigate = useNavigate();
    const [noticeDetail, setNoticeDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNoticeDetail = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getShopNoticeDetail(shopId, noticeId);
                // API에서 데이터가 null로 오는 경우를 대비하여 명확하게 처리
                if (data === null || Object.keys(data).length === 0) { // data가 null이거나 빈 객체일 경우
                    setError("공지사항을 찾을 수 없습니다.");
                    setNoticeDetail(null); // 혹시 모를 상황 대비
                } else {
                    setNoticeDetail(data);
                }
            } catch (err) {
                console.error('공지사항 상세 불러오기 실패:', err);
                setError("공지사항 상세 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.");
            } finally {
                setIsLoading(false);
            }
        };

        if (shopId && noticeId) {
            fetchNoticeDetail();
        } else {
            setError("유효하지 않은 공지사항 정보입니다.");
            setIsLoading(false);
        }
    }, [shopId, noticeId]);


    // --- 로딩, 에러, 데이터 없음 상태 처리 ---
    if (isLoading) {
        return (
            <div className="p-4 max-w-3xl mx-auto text-center text-gray-500">
                <p>공지사항 상세 정보를 불러오는 중입니다...</p>
            </div>
        );
    }

    // isLoading이 false가 된 후 error가 있거나 noticeDetail이 없는 경우
    if (error) { // 에러 메시지를 표시
        return (
            <div className="p-4 max-w-3xl mx-auto text-center text-red-500">
                <p>{error}</p>
                <button
                    onClick={() => navigate(`/buyer/shops/${shopId}/notices`)}
                    className="mt-4 px-7 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all duration-300 ease-in-out text-lg font-medium shadow-sm hover:shadow-md"
                >
                    목록으로 돌아가기
                </button>
            </div>
        );
    }

    if (!noticeDetail) { // 에러는 아니지만 데이터가 없는 경우 (예: 404 Not Found)
        return (
            <div className="p-4 max-w-3xl mx-auto text-center text-gray-500">
                <p>요청하신 공지사항을 찾을 수 없습니다.</p>
                <button
                    onClick={() => navigate(`/buyer/shops/${shopId}/notices`)}
                    className="mt-4 px-7 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all duration-300 ease-in-out text-lg font-medium shadow-sm hover:shadow-md"
                >
                    목록으로 돌아가기
                </button>
            </div>
        );
    }


    // --- 공지사항 상세 정보 렌더링 ---
    return (
        <main
            className="flex-grow max-w-4xl w-full mx-auto px-4 py-12 md:px-0">
            <div
                className="p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
                <h1 className="text-4xl font-extrabold mb-4 text-gray-900 leading-tight">
                    {noticeDetail.title} {/* 이제 noticeDetail이 null이 아님을 보장 */}
                </h1>
                <p className="text-base text-gray-500 mb-8 border-b pb-4 border-gray-100">
                    등록일: {noticeDetail.regDate ? new Date(noticeDetail.regDate).toLocaleString('ko-KR') : '-'}
                </p>
                <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed break-words"
                     style={{whiteSpace: 'pre-wrap'}}>
                    <p>{noticeDetail.content}</p> {/* 이제 noticeDetail이 null이 아님을 보장 */}
                </div>

                <div className="mt-12 flex flex-wrap justify-center gap-4 sm:justify-end">
                    <button
                        onClick={() => navigate(`/buyer/shops/${shopId}/notices`)}
                        className="px-7 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all duration-300 ease-in-out text-lg font-medium shadow-sm hover:shadow-md"
                    >
                        목록으로 돌아가기
                    </button>

                </div>
            </div>
        </main>
    );
};


export default BuyerNoticeDetailPage;