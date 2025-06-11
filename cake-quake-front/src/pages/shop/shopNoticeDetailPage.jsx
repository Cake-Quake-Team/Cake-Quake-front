import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import {deleteShopNotice, getShopNoticeDetail} from "../../api/shopApi.jsx";
import ConfirmationModal from "../../components/shop/confirmationModal.jsx";

const ShopNoticeDetailPage = () => {
    // URL에서 매장 ID (cid)와 공지사항 ID (nid)를 가져와 바로 shopId와 noticeId로 할당
    const { cid: shopId, nid: noticeId } = useParams();
    const navigate = useNavigate();
    const [noticeDetail, setNoticeDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleteModalOpen,setIsDeleteModalOpen] = useState(false); //삭제 모달

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

    const handleDeleteClick=()=>{
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async ()=> {
        setIsDeleteModalOpen(false);
        try {
            await deleteShopNotice(shopId, noticeId);
            alert("공지사항이 성공적으로 삭제되었습니다.");
            navigate(`/shop/read/${shopId}/notices`);
        } catch (err) {
            console.error('공지사항 삭제 실패:', err);
            setError("공지사항 삭제에 실패했습니다. 다시 시도해주세요.");
        }
    };

    const handleCancelDelete=()=>{
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

    if (error) {
        return (
            <main className="flex-grow max-w-3xl w-full mx-auto px-4 py-8 md:px-0">
                <div className="text-center p-8 bg-red-100 text-red-700 rounded-lg shadow-md">
                    <p className="text-xl font-semibold mb-4">오류 발생</p>
                    <p>{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        이전 페이지로 돌아가기
                    </button>
                </div>
            </main>
        );
    }

    if (!noticeDetail) {
        return (
            <main className="flex-grow max-w-3xl w-full mx-auto px-4 py-8 md:px-0">
                <div className="text-center p-8 bg-gray-100 text-gray-700 rounded-lg shadow-md">
                    <p className="text-xl font-semibold mb-4">공지사항을 찾을 수 없습니다.</p>
                    <p>요청하신 공지사항 ID({noticeId})에 해당하는 정보가 존재하지 않습니다.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        이전 페이지로 돌아가기
                    </button>
                </div>
            </main>
        );
    }



    // --- 공지사항 상세 정보 렌더링 ---
    return (
        <main className="flex-grow max-w-3xl w-full mx-auto px-4 py-8 md:px-0">
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-4 text-gray-900 border-b pb-2">{noticeDetail.title}</h1>
                <p className="text-sm text-gray-500 mb-6">
                    등록일: {noticeDetail.regDate ? new Date(noticeDetail.regDate).toLocaleString('ko-KR') : '-'}
                </p>
                <div className="prose max-w-none text-gray-800 leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
                    <p>{noticeDetail.content}</p>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate(`/shop/read/${shopId}/notices`)}
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-lg"
                    >
                        목록으로 돌아가기
                    </button>
                    {/*수정 버튼*/}
                    <button
                        onClick={() => navigate(`/shop/read/${shopId}/notices/${noticeId}/update`)}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg"
                    >
                        공지사항 수정
                    </button>
                    {/*삭제 버튼*/}
                    <button
                        onClick={handleDeleteClick}
                        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-lg"
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