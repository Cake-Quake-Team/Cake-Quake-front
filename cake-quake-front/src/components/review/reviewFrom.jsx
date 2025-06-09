import React from 'react';



export default function ReviewForm({
                                       values,
                                       onChange,
                                       submitting,
                                       onSubmit,
                                       submitLabel
                                   }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        // 숫자 필드는 number로 변환
        onChange(name, name === 'rating' ? parseInt(value, 10) : value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* 별점 */}
            <div>
                <label className="block text-sm font-medium mb-1">별점 (0~5)</label>
                <input
                    type="number"
                    name="rating"
                    min="0"
                    max="5"
                    value={values.rating}
                    onChange={handleChange}
                    className="border rounded p-2 w-20"
                    disabled={submitting}
                />
            </div>

            {/* 내용 */}
            <div>
                <label className="block text-sm font-medium mb-1">리뷰 내용</label>
                <textarea
                    name="content"
                    value={values.content}
                    onChange={handleChange}
                    rows="4"
                    className="border rounded p-2 w-full"
                    disabled={submitting}
                />
            </div>

            {/* 이미지 URL */}
            <div>
                <label className="block text-sm font-medium mb-1">이미지 URL</label>
                <input
                    type="text"
                    name="reviewPictureUrl"
                    value={values.reviewPictureUrl}
                    onChange={handleChange}
                    className="border rounded p-2 w-full"
                    disabled={submitting}
                />
            </div>

            {/* 제출 버튼 */}
            <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {submitLabel}
            </button>
        </form>
    );
}