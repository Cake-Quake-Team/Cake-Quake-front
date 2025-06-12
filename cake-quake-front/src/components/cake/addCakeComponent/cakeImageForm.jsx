import { useRef, useEffect } from "react";

function CakeImageUploadForm({ images, onImageChange, onImageRemove, onThumbnailSelect }) {
    const inputRef = useRef(null);
    const scrollRef = useRef(null);

    const handleChange = (e) => {
        onImageChange(e);
        // input 초기화
        if (inputRef.current) {
            inputRef.current.value = null;
        }
    };

    // 이미지 변경될 때마다 오른쪽으로 자동 스크롤
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    }, [images]);

    return (
        <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">이미지 업로드</h2>

            <div
                ref={scrollRef}
                className="flex gap-5 overflow-x-auto max-w-full scrollbar-hide"
                style={{ height: '120px', overflowY: 'hidden' }}
            >
                {images.map((img, index) => (
                    <div key={index} className="relative w-30 h-30 flex-shrink-0">
                        <img
                            src={URL.createObjectURL(img.file)}
                            alt={`미리보기 ${index + 1}`}
                            className={`w-full h-24 object-cover rounded-lg border-2 ${img.isThumbnail ? "border-blue-500" : "border-transparent"}`}
                        />
                        <div className="text-center mt-1">
                            <input
                                type="radio"
                                name="thumbnail"
                                checked={img.isThumbnail}
                                onChange={() => onThumbnailSelect(index)}
                            />
                        </div>
                        <button
                            onClick={() => onImageRemove(index)}
                            className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-opacity-80"
                            title="삭제"
                        >
                            ×
                        </button>
                    </div>
                ))}

                {/* 업로드 버튼 */}
                <div className="flex-shrink-0">
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleChange}
                        className="hidden"
                        id="imageUploadInput"
                        ref={inputRef}
                    />
                    <label
                        htmlFor="imageUploadInput"
                        className="cursor-pointer bg-gray-100 px-6 py-12 rounded-md text-sm text-gray-600 hover:bg-gray-200 transition text-center whitespace-nowrap block"
                    >
                        이미지 추가
                    </label>
                </div>
            </div>
        </div>
    );
}

export default CakeImageUploadForm;