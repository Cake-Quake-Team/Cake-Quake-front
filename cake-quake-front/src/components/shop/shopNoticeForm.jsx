import {useNavigate} from "react-router";
import {useEffect, useState} from "react";
import {createShopNotice, updateShopNotice} from "../../api/shopApi.jsx";

const ShopNoticeForm = ({ shopId, noticeId, initialData }) => {
    const navigate = useNavigate();
    // 폼 필드의 상태를 관리, initialData가 있으면 해당 값으로 초기화
    const [title, setTitle] = useState(initialData?.title || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 에러 메시지

    // initialData가 변경될 때마다 폼 필드를 업데이트 -> 수정모드에서 데이터 처음 호출 시 폼 채우는데 유용
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setContent(initialData.content || '');
        }
    }, [initialData]);

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault(); // 폼 기본 제출 동작 방지
        setIsLoading(true);
        setError(null);

        const noticeData = { title, content };

        try {
            if (noticeId) {
                // noticeId가 존재하면 수정 모드
                await updateShopNotice(shopId, noticeId, noticeData);
                alert("공지사항이 성공적으로 수정되었습니다.");
            } else {
                // noticeId가 없으면 생성 모드
                const createdNoticeId = await createShopNotice(shopId, noticeData);
                alert("공지사항이 성공적으로 생성되었습니다.");
                // 생성 후 상세 페이지나 목록 페이지로 이동할 수 있습니다.
                navigate(`/shop/read/${shopId}/notices/${createdNoticeId}`);
                return; // 생성 후에는 바로 이동하므로 여기서 함수 종료
            }
            // 수정 후에는 상세 페이지로 돌아가거나, 필요에 따라 목록 페이지로 이동
            navigate(`/shop/read/${shopId}/notices/${noticeId}`);
        } catch (err) {
            console.error("공지사항 처리 실패:", err);
            setError("공지사항 저장/수정 중 오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    // 로딩 중이거나 에러 발생 시 UI
    if (isLoading) {
        return (
            <div className="p-4 max-w-2xl mx-auto text-center text-gray-500">
                <p>공지사항을 저장 중입니다...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 max-w-2xl mx-auto text-center text-red-700 bg-red-100 rounded-lg">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <main className="flex-grow max-w-3xl w-full mx-auto px-4 py-8 md:px-0">
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-6 text-gray-900 border-b pb-4">
                    {noticeId ? '공지사항 수정' : '새 공지사항 작성'}
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">
                            제목
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
                            placeholder="공지사항 제목을 입력하세요."
                        />
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-lg font-medium text-gray-700 mb-2">
                            내용
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="10"
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
                            placeholder="공지사항 내용을 입력하세요."
                        ></textarea>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)} // 이전 페이지로 돌아가기
                            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-lg"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg disabled:opacity-50"
                        >
                            {isLoading ? '저장 중...' : (noticeId ? '수정 완료' : '작성 완료')}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default ShopNoticeForm;