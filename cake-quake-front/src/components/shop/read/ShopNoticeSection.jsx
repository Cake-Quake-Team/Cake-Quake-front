import {Link} from "react-router";

const ShopNoticeSection = ({ noticePreview, shopId }) => {
    // 매장 공지사항 목록 페이지 URL은 항상 필요하므로 여기에 정의합니다.
    const allNoticesUrl = `/shops/read/${shopId}/notices`;

    // 공지사항 미리보기가 없는 경우 (noticePreview가 null/undefined이거나 title이 없는 경우)
    if (!noticePreview || !noticePreview.title) {
        return (
            <div className="border border-gray-200 p-5 rounded-xl mb-8 bg-white shadow-md">
                <h4 className="text-xl font-bold mb-3 text-gray-800">공지글</h4>
                <p className="text-base text-gray-600 leading-relaxed mb-4">
                    아직 등록된 공지사항이 없습니다.
                </p>
                <div className="text-right">
                    <Link
                        to={allNoticesUrl}
                        className="text-blue-600 hover:underline font-medium text-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                    >
                        공지사항 목록 &gt;
                    </Link>
                </div>
            </div>
        );
    }

    const displayedContent = noticePreview.previewContent && noticePreview.previewContent.length > 150
        ? noticePreview.previewContent.substring(0, 150) + '...'
        : noticePreview.previewContent;

    return (
        <div className="border border-gray-200 p-5 rounded-xl mb-8 bg-white shadow-md">
            <h4 className="text-xl font-bold mb-3 text-gray-800">공지글</h4>
            <p className="font-semibold mb-2 text-gray-700">1. {noticePreview.title}</p>
            <p className="text-base text-gray-600 leading-relaxed mb-4">
                {displayedContent}
            </p>
            <div className="text-right">
                <Link
                    to={allNoticesUrl}
                    className="text-blue-600 hover:underline font-medium text-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                >
                    상세 보기 &gt;
                </Link>
            </div>
        </div>
    );
};
export default ShopNoticeSection;

