import { useRef, useEffect } from "react";

function CakeImageUploadForm({ images, onImageChange, onImageRemove, onThumbnailSelect  }) {
    const inputRef = useRef(null);
    const scrollRef = useRef(null);
    const s3BaseUrl=import.meta.env.VITE_S3_BASE_URL;

    const handleChange = (e) => {
        onImageChange(e);
        if (inputRef.current) inputRef.current.value = null;
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    }, [images]);

    return (
        <div className="bg-white mt-6 rounded-xl">
            <h2 className="font-medium mb-4">이미지 업로드</h2>

            <div
                ref={scrollRef}
                className="flex gap-5 overflow-x-auto max-w-full scrollbar-hide"
                style={{ height: "120px", overflowY: "hidden" }}
            >
                {images.map((img, index) => {
                    return (
                        <div key={index} className="relative w-30 h-30 flex-shrink-0">
                            <img
                                src={img.file ? img.src : `${s3BaseUrl}${img.src}`}
                                alt="미리보기"
                                onClick={() => onThumbnailSelect(index)}
                                className={`w-full h-24 object-cover rounded-lg border-2 ${
                                    img.isThumbnail ? "border-blue-500" : "border-transparent"
                                }`}
                            />
                            <div className="text-center mt-1">
                                <input
                                    type="radio"
                                    name="thumbnail"
                                    checked={img.isThumbnail}
                                    onChange={() => onThumbnailSelect(index)}
                                    readOnly
                                />
                            </div>
                            <button
                                onClick={() => onImageRemove(index)}
                                type="button"
                                className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-opacity-80"
                                title="삭제"
                            >
                                ×
                            </button>
                        </div>
                    );
                })}

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