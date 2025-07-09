import React, {useState, useEffect, useRef} from 'react';
import { Upload } from 'lucide-react';
import ConfirmationModal from '../ConfirmationModal.jsx'; // 확인 모달 컴포넌트 임포트

const BASE_URL = import.meta.env.VITE_S3_BASE_URL;

const ShopImageEditor = ({
                             images, // 부모로부터 받은 이미지 배열
                             setImages, // 이미지 배열을 업데이트하는 함수
                             thumbnailIndex, // 부모로부터 받은 썸네일 인덱스
                             setThumbnailIndex, // 썸네일 인덱스를 업데이트하는 함수
                         }) => {
    const inputRef = useRef(null); // 파일 입력 참조
    const scrollRef = useRef(null); // 이미지 갤러리 스크롤 참조

    // 사용자에게 보여줄 이미지 삭제 확인 모달 관련 상태
    const [deleteTargetIndex, setDeleteTargetIndex] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    // 메인 이미지 상태 추가: ShopImageEditor 내부에서 관리
    const [mainImage, setMainImage] = useState(null);

    // images나 thumbnailIndex가 변경될 때 메인 이미지 업데이트
    useEffect(() => {
        if (images && images.length > 0) {
            const thumbnail = images.find(img => img.isThumbnail);
            // 썸네일이 있으면 썸네일 URL, 없으면 첫 번째 이미지 URL을 메인 이미지로 설정
            const selectedMainImageUrl = thumbnail ? `${BASE_URL}${thumbnail.shopImageUrl}` : `${BASE_URL}${images[0].shopImageUrl}`;
            setMainImage(selectedMainImageUrl);
        } else {
            setMainImage(null);
        }
    }, [images, thumbnailIndex]); // images와 thumbnailIndex 변경을 모두 감지

    // 메인 이미지를 클릭하면 그 이미지를 메인으로 설정
    const handleMainImageClick = (imageUrl) => {
        setMainImage(`${BASE_URL}${imageUrl}`);
    };

    // 새 파일 추가 또는 기존 파일 변경 시 호출 (CakeImageUploadForm의 handleChange와 유사)
    const handleFileAddOrChange = (e, targetIndex = null) => {
        const files = Array.from(e.target.files);

        if (files.length === 0) {
            return;
        }


        const newImagesToProcess = files.map(file => ({
            shopImageId: null, // 새로운 파일이므로 ID 없음
            shopImageUrl: '', // 초기 URL 비워두고 FileReader로 채움
            isThumbnail: false,
            isNew: true, // 새로운 파일임을 표시
            file: file, // 실제 File 객체
        }));

        Promise.all(
            newImagesToProcess.map(img => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve({
                            ...img,
                            shopImageUrl: reader.result, // 미리보기 URL (base64)
                        });
                    };
                    reader.readAsDataURL(img.file);
                });
            })
        ).then(processedNewImages => {
            setImages(prevImages => {
                let updatedImages;
                if (targetIndex !== null) { // 기존 이미지 교체
                    // ... (기존 로직)
                } else { // 새 이미지 추가
                    updatedImages = [...prevImages, ...processedNewImages];
                }

                // ... (이후 썸네일 로직)
                return updatedImages;
            });
        });

        // 파일 입력 초기화
        if (inputRef.current) {
            inputRef.current.value = null;
        }
    };

    // 이미지 추가 버튼 클릭 시 호출 (실제 파일 입력 클릭)
    const handleAddImageClick = () => {
        inputRef.current.click(); // 숨겨진 파일 입력 필드 클릭
    };

    // 썸네일 라디오 버튼 변경을 처리하는 함수
    const handleThumbnailChange = (index) => {
        setThumbnailIndex(index);
        setImages((prev) =>
            prev.map((img, i) => ({
                ...img,
                isThumbnail: i === index,
            }))
        );
        if (images[index]) {
            const imageUrl = images[index].isNew && images[index].file
                ? URL.createObjectURL(images[index].file)
                : images[index].shopImageUrl;
            setMainImage(`${BASE_URL}${imageUrl}`);
        }
    };

    // 이미지 삭제 클릭 처리 (모달 사용)
    const handleDeleteClick = (index) => {
        setDeleteTargetIndex(index);
        setIsConfirmOpen(true);
    };

    // 이미지 삭제 확인 처리
    const handleConfirmDelete = () => {
        const updatedImages = images.filter((_, i) => i !== deleteTargetIndex);

        let newThumbnailIndex = null;
        if (thumbnailIndex !== null) {
            if (deleteTargetIndex < thumbnailIndex) {
                newThumbnailIndex = thumbnailIndex - 1;
            } else if (deleteTargetIndex === thumbnailIndex) {
                if (updatedImages.length > 0) {
                    newThumbnailIndex = 0; // 썸네일이 삭제되면 첫 번째 이미지를 새 썸네일로
                } else {
                    newThumbnailIndex = null; // 이미지가 없으면 썸네일 없음
                }
            } else { // deleteTargetIndex > thumbnailIndex
                newThumbnailIndex = thumbnailIndex;
            }
        } else if (updatedImages.length > 0) {
            newThumbnailIndex = 0; // 썸네일이 없었지만, 이미지가 남아있으면 첫 번째 이미지를 썸네일로
        }

        setThumbnailIndex(newThumbnailIndex);

        const finalImages = updatedImages.map((img, i) => ({
            ...img,
            isThumbnail: i === newThumbnailIndex // 새 썸네일 인덱스에 따라 isThumbnail 업데이트
        }));
        setImages(finalImages);


        // 메인 이미지 조정
        if (finalImages.length === 0) {
            setMainImage(null);
        } else if (deleteTargetIndex === thumbnailIndex || mainImage === `${BASE_URL}${images[deleteTargetIndex]?.shopImageUrl}`) {
            // 삭제된 이미지가 메인 이미지였거나 썸네일이었다면, 새로운 썸네일 또는 첫 번째 이미지를 메인으로 설정
            const newMainImageObj = finalImages[newThumbnailIndex !== null ? newThumbnailIndex : 0];
            const src = newMainImageObj?.isNew && newMainImageObj?.file
                ? URL.createObjectURL(newMainImageObj.file)
                : newMainImageObj?.shopImageUrl;
            setMainImage(`${BASE_URL}${src}`);
        }

        setDeleteTargetIndex(null);
        setIsConfirmOpen(false);
    };

    // 이미지 삭제 취소 처리
    const handleCancelDelete = () => {
        setDeleteTargetIndex(null);
        setIsConfirmOpen(false);
    };

    // 이미지가 변경될 때마다 스크롤을 가장 오른쪽으로 이동
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    }, [images]);

    return (
        <div className="bg-white mt-6 rounded-xl p-6">
            {/* 메인 이미지 표시 영역 */}
            {mainImage && (
                <div className="w-full max-h-[450px] md:max-h-[500px] overflow-hidden mb-4 rounded-lg shadow-md bg-gray-200 flex items-center justify-center">
                    <img
                        src={mainImage}
                        alt="Main Shop View"
                        className="w-full h-full object-contain md:object-cover"
                    />
                </div>
            )}
            {!mainImage && images.length === 0 && (
                <div className="text-center text-gray-500 py-10 text-lg">등록된 이미지가 없습니다.</div>
            )}


            <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar"
                style={{ height: "140px", overflowY: "hidden" }}
            >
                {images.map((img, i) => {
                    // 기존 이미지인 경우 img.shopImageUrl을 직접 사용하고, 새 파일인 경우 URL.createObjectURL 사용
                    const src = img.isNew && img.file ? URL.createObjectURL(img.file) : img.shopImageUrl;
                    const fullUrl = `${BASE_URL}${src}`; // BASE_URL을 여기에 적용

                    return (
                        <div key={img.shopImageId || `new-${i}`} className="relative w-28 h-28 flex-shrink-0">
                            <img
                                src={fullUrl} // BASE_URL이 적용된 URL 사용
                                alt={`Shop Image ${i + 1}`}
                                onClick={() => handleMainImageClick(src)} // 클릭 시 메인 이미지 변경
                                className={`w-full h-24 object-cover rounded-lg border-2 cursor-pointer transition-all duration-200 ease-in-out
                                    ${mainImage === fullUrl ? "border-blue-500 scale-105 shadow-lg" : "border-gray-300 hover:border-gray-400"}`}
                            />
                            <div className="text-center mt-1">
                                <input
                                    type="radio"
                                    name="thumbnail"
                                    checked={i === thumbnailIndex}
                                    onChange={() => handleThumbnailChange(i)}
                                    className="form-radio text-blue-600"
                                />
                                <span className="ml-1 text-sm text-gray-700">썸네일</span>
                            </div>
                            <button
                                onClick={() => handleDeleteClick(i)}
                                className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-opacity-80"
                                title="삭제"
                            >
                                ×
                            </button>
                            {/* 기존 파일 입력 필드를 각 이미지에 연결 (이미지 교체 기능) */}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileAddOrChange(e, i)} // 특정 이미지 인덱스를 전달하여 교체
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                title="이미지 교체"
                            />
                        </div>
                    );
                })}

                <div className="flex-shrink-0 flex items-center justify-center w-28 h-28">
                    <input
                        type="file"
                        accept="image/*"
                        multiple // 여러 파일 선택 가능
                        onChange={handleFileAddOrChange} // 새 파일 추가 로직
                        className="hidden"
                        id="imageUploadInput"
                        ref={inputRef}
                    />
                    <label
                        htmlFor="imageUploadInput"
                        className="cursor-pointer bg-gray-100 px-6 py-12 rounded-md text-sm text-gray-600 hover:bg-gray-200 transition text-center whitespace-nowrap block w-full h-full flex items-center justify-center"
                        onClick={handleAddImageClick} // 레이블 클릭 시 input 클릭
                    >
                        <Upload size={24} className="mr-2" />
                        이미지 추가
                    </label>
                </div>
            </div>

            {/* 확인 모달 */}
            <ConfirmationModal
                isOpen={isConfirmOpen}
                message="정말 이 이미지를 삭제하시겠습니까? 저장하기 전까지는 반영되지 않습니다."
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
};


export default ShopImageEditor;
