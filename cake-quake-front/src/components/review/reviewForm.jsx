import React, {useEffect, useState} from 'react';

// 별점 SVG 아이콘 컴포넌트
const Star = ({ filled = false }) => (
    <svg
        className={`w-8 h-8 ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
        viewBox="0 0 20 20"
        fill="currentColor"
    >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.158c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.955c.3.921-.755 1.688-1.538 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.783.57-1.838-.197-1.538-1.118l1.286-3.955a1 1 0 00-.364-1.118L2.07 9.382c-.783-.57-.38-1.81.588-1.81h4.158a1 1 0 00.95-.69l1.286-3.955z" />
    </svg>
);

export default function ReviewForm({ product, points,  temperatureIncrement, values, onChange, submitting, onSubmit, submitLabel }) {
    const handleFile = e => onChange('reviewPictureUrl', e.target.files?.[0] || null);
    const handleRating = i => onChange('rating', i);
    const handleContent = e => onChange('content', e.target.value);

    // 1) previewSrc: null로 시작
    const [previewSrc, setPreviewSrc] = useState(null);

    // 2) values.reviewPictureUrl 변할 때마다
    useEffect(() => {
        const v = values.reviewPictureUrl;
        // File이면 blob URL
        if (v instanceof File) {
            const blob = URL.createObjectURL(v);
            setPreviewSrc(blob);
            return () => URL.revokeObjectURL(blob);
        }
        // 문자열(URL)이면 그대로
        if (typeof v === 'string' && v) {
            setPreviewSrc(`http://localhost${v}`);
        }
        // null 또는 빈값인 경우
        if (!v) {
            setPreviewSrc(null);
        }
    }, [values.reviewPictureUrl]);

        return (
            <form onSubmit={e => {
                e.preventDefault();
                onSubmit();
            }} className="max-w-md mx-auto bg-white rounded-lg shadow p-6 space-y-6">


                {/* 상품 카드 */}
                <div className="border border-gray-200 rounded-lg p-4 space-y-2">
                    <div className="flex items-center space-x-4">
                        <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded object-cover"/>
                        <div className="flex-1">
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.store}</p>
                            <p className="text-xs text-gray-400">{product.date}</p>
                        </div>
                    </div>
                </div>

                {/* 포인트 & 온도 증가량 */}
                <div className="flex justify-between items-center text-sm border-t border-b border-gray-200 py-3">
        <span>
          적립 예상 포인트 <strong className="text-orange-500">{points}P</strong>
        </span>
                    <span>
          상승 예상 온도 <strong className="text-orange-500">+{temperatureIncrement}℃</strong>
        </span>
                </div>

                {/* 사진 첨부 */}
                <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-600 mb-2">제품 사진 첨부</p>
                    <label
                        className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden">
                        {previewSrc
                            ? <img
                                key={previewSrc}
                                //src={`http://localhost${previewSrc}`}
                                src={previewSrc}
                                alt="preview"
                                className="w-full h-full object-cover rounded-lg"
                            />
                            : <span className="text-3xl text-gray-300">+</span>
                        }
                        <input
                            type="file"
                            accept="image/*"
                            disabled={submitting}
                            onChange={handleFile}
                            className="hidden"/>
                    </label>
                </div>

                {/* 별점 */}
                <div className="text-center">
                    <p className="text-sm text-gray-700 mb-1">상품은 어땠나요?</p>
                    <div className="flex justify-center space-x-2">
                        {[1, 2, 3, 4, 5].map(i => (
                            <button key={i} type="button" onClick={() => handleRating(i)} disabled={submitting}
                                    className="focus:outline-none">
                                <Star filled={values.rating >= i}/>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 리뷰 내용 */}
                <div>
        <textarea
            rows="5"
            value={values.content}
            onChange={handleContent}
            disabled={submitting}
            placeholder="최소 10자 이상 작성해 주세요"
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
                </div>

                {/* 제출 버튼 */}
                <button
                    type="submit"
                    disabled={submitting || values.rating === 0 || values.content.length < 10}
                    className="w-full py-3 bg-black text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitLabel}
                </button>
            </form>
        );
}