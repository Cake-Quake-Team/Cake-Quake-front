import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import {deleteShopNotice, getShopNoticeDetail} from "../../api/shopApi.jsx";
import ConfirmationModal from "../../components/shop/confirmationModal.jsx";
//판매자용
const ShopNoticeDetailPage = () => {
    // URL에서 매장 ID (cid)와 공지사항 ID (nid)를 가져와 바로 shopId와 noticeId로 할당
    const {cid: shopId, nid: noticeId} = useParams();
    const navigate = useNavigate();
    const [noticeDetail, setNoticeDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //삭제 모달

    useEffect(() => {
        const fetchNoticeDetail = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getShopNoticeDetail(shopId, noticeId);
                setNoticeDetail(data);
            } catch (err) {
                console.error('공지사항 상세 불러오기 실패:', err);
                setError("공지사항 상세 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.");
            } finally {
                setIsLoading(false);
            }
        };

        // shopId와 noticeId가 모두 유효할 때만 로드
        if (shopId && noticeId) {
            fetchNoticeDetail();
        } else {
            // URL 파라미터가 유효하지 않은 경우
            setError("유효하지 않은 공지사항 정보입니다.");
            setIsLoading(false);
        }
    }, [shopId, noticeId]); // shopId 또는 noticeId가 변경될 때마다 재실행

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleteModalOpen(false);
        await deleteShopNotice(shopId, noticeId);
        alert("공지사항이 성공적으로 삭제되었습니다.");
        navigate(`/shops/read/${shopId}/notices`);
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
    }

    // --- 로딩, 에러, 데이터 없음 상태 처리 ---
    if (isLoading) {
        return (
            <div className="p-4 max-w-3xl mx-auto text-center text-gray-500">
                <p>공지사항 상세 정보를 불러오는 중입니다...</p>
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
                    {noticeDetail.title}
                </h1>
                <p className="text-base text-gray-500 mb-8 border-b pb-4 border-gray-100">
                    등록일: {noticeDetail.regDate ? new Date(noticeDetail.regDate).toLocaleString('ko-KR') : '-'}
                </p>
                <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed break-words"
                     style={{whiteSpace: 'pre-wrap'}}> {/* Larger prose font, allow word breaks for long words */}
                    <p>{noticeDetail.content}</p>
                </div>

                <div className="mt-12 flex flex-wrap justify-center gap-4 sm:justify-end">
                    <button
                        onClick={() => navigate(`/shops/read/${shopId}/notices`)}
                        className="px-7 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all duration-300 ease-in-out text-lg font-medium shadow-sm hover:shadow-md"
                    >
                        목록으로 돌아가기
                    </button>
                    <button
                        onClick={() => navigate(`/shops/read/${shopId}/notices/${noticeId}/update`)}
                        className="px-7 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 ease-in-out text-lg font-medium shadow-md hover:shadow-lg"
                    >
                        공지사항 수정
                    </button>
                    <button
                        onClick={handleDeleteClick}
                        className="px-7 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 ease-in-out text-lg font-medium shadow-md hover:shadow-lg"
                    >
                        공지사항 삭제
                    </button>
                </div>
            </div>
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                message="이 공지사항을 삭제하시겠습니까?"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </main>
    );
};

export default ShopNoticeDetailPage;
