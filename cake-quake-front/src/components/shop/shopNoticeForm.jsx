import {useNavigate} from "react-router";
import {useEffect, useState} from "react";
import {createShopNotice, updateShopNotice} from "../../api/shopApi.jsx";

const ShopNoticeForm = ({ shopId, noticeId, initialData }) => {
    const navigate = useNavigate();
    // 폼 필드의 상태를 관리, initialData가 있으면 해당 값으로 초기화
    const [title, setTitle] = useState(initialData?.title || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태

    // initialData가 변경될 때마다 폼 필드를 업데이트 -> 수정모드에서 데이터 처음 호출 시 폼 채우는데 유용
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setContent(initialData.content || '');
        }
    }, [initialData]);

    //폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault(); // 폼의 기본 제출 동작 방지
        setIsLoading(true);

        const noticeData = {title, content};

        if (noticeId) {
            // noticeId가 존재하면 수정 모드
            await updateShopNotice(shopId, noticeId, noticeData);
            alert("공지사항이 성공적으로 수정되었습니다.");
        } else {
            // noticeId가 없으면 생성 모드
            const createdNoticeId = await createShopNotice(shopId, noticeData);
            alert("공지사항이 성공적으로 생성되었습니다.");
            navigate(`/shops/read/${shopId}/notices/${createdNoticeId}`);
            setIsLoading(false);
            return;
        }

        navigate(`/shops/read/${shopId}/notices/${noticeId}`);
        setIsLoading(false);
    };

    // 로딩 중이거나 에러 발생 시 UI
    if (isLoading) {
        return (
            <div className="p-4 max-w-2xl mx-auto text-center text-gray-500">
                <p>공지사항을 저장 중입니다...</p>
            </div>
        );
    }


    return (
        <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-12 md:px-0">
            <div
                className="p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
                <h1 className="text-4xl font-extrabold mb-8 text-gray-900 border-b-2 pb-6 border-blue-100 text-center">
                    {noticeId ? '공지사항 수정' : '새 공지사항 작성'}
                </h1>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label htmlFor="title"
                               className="block text-xl font-semibold text-gray-800 mb-3">
                            제목
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="mt-1 block w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg placeholder-gray-400 transition duration-200 ease-in-out transform hover:scale-[1.01]" /* 패딩 키우고, 둥근 정도, 호버 효과 추가 */
                            placeholder="공지사항 제목을 입력해주세요."
                        />
                    </div>
                    <div>
                        <label htmlFor="content"
                               className="block text-xl font-semibold text-gray-800 mb-3">
                            내용
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="12"
                            required
                            className="mt-1 block w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg placeholder-gray-400 transition duration-200 ease-in-out transform hover:scale-[1.01]" /* 패딩 키우고, 둥근 정도, 호버 효과 추가 */
                            placeholder="공지사항 내용을 입력해주세요."
                        ></textarea>
                    </div>
                    <div className="flex justify-end gap-5 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)} 
                            className="px-8 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all duration-300 ease-in-out text-xl font-medium shadow-md hover:shadow-lg" /* 패딩 키우고, 둥근 정도, 전환 효과 및 그림자 강화 */
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 ease-in-out text-xl font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" /* 패딩 키우고, 둥근 정도, 전환 효과 및 그림자 강화, 비활성화 스타일 명확화 */
                        >
                            {isLoading ? '저장 중...' : (noticeId ? '수정 완료' : '작성 완료')}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default ShopNoticeForm;