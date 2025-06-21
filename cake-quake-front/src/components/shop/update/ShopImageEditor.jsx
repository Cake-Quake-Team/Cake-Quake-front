import React, {useState, useEffect, useRef} from 'react';
import { Upload } from 'lucide-react';
import ConfirmationModal from '../ConfirmationModal.jsx'; // 확인 모달 컴포넌트 임포트

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

    // 새 파일 추가 또는 기존 파일 변경 시 호출 (CakeImageUploadForm의 handleChange와 유사)
    const handleFileAddOrChange = (e, targetIndex = null) => {
        const files = Array.from(e.target.files);

        if (files.length === 0) return;

        const newImagesToProcess = files.map(file => ({
            shopImageId: null, // 새로운 파일이므로 ID 없음
            shopImageUrl: '', // 초기 URL 비워두고 FileReader로 채움
            isThumbnail: false,
            isNew: true, // 새로운 파일임을 표시
            file: file, // 실제 File 객체
        }));

        // Promise.all을 사용하여 모든 파일의 Data URL 읽기가 완료될 때까지 기다림
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
                    updatedImages = [...prevImages];
                    updatedImages[targetIndex] = {
                        ...updatedImages[targetIndex],
                        ...processedNewImages[0], // 첫 번째 파일로 교체 (handleFileChange와 유사하게 동작)
                    };
                } else { // 새 이미지 추가
                    updatedImages = [...prevImages, ...processedNewImages];
                }

                // 만약 썸네일이 없고, 추가/교체된 이미지가 첫 번째 이미지라면 썸네일로 설정
                if (thumbnailIndex === null && updatedImages.length > 0) {
                    const currentThumbnail = updatedImages.find(img => img.isThumbnail);
                    if (!currentThumbnail) {
                        updatedImages[0].isThumbnail = true;
                        setThumbnailIndex(0);
                    }
                }
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
    };

    // 이미지 삭제 클릭 처리 (모달 사용)
    const handleDeleteClick = (index) => {
        setDeleteTargetIndex(index);
        setIsConfirmOpen(true);
    };

    // 이미지 삭제 확인 처리
    const handleConfirmDelete = () => {
        const updatedImages = images.filter((_, i) => i !== deleteTargetIndex);

        // 썸네일 인덱스 조정 로직
        let newThumbnailIndex = thumbnailIndex;
        if (thumbnailIndex !== null) {
            if (deleteTargetIndex < thumbnailIndex) {
                newThumbnailIndex = thumbnailIndex - 1;
            } else if (deleteTargetIndex === thumbnailIndex) {
                newThumbnailIndex = null; // 썸네일이 삭제되면 썸네일 없음
                // 만약 삭제 후 이미지가 남아있다면 첫 번째 이미지를 새 썸네일로 설정
                if (updatedImages.length > 0) {
                    newThumbnailIndex = 0;
                    updatedImages[0].isThumbnail = true;
                }
            }
        }
        setThumbnailIndex(newThumbnailIndex);
        setImages(updatedImages.map((img, i) => ({
            ...img,
            isThumbnail: i === newThumbnailIndex // 새 썸네일 인덱스에 따라 isThumbnail 업데이트
        })));


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
        <div className="bg-white mt-6 rounded-xl p-6"> {/* 기존 ShopImageEditor의 p-6 패딩을 여기에 통합 */}
            <h3 className="text-xl font-bold mb-4">매장 사진 편집</h3>

            {images.length === 0 && <p className="text-gray-500 mb-4">현재 등록된 이미지가 없습니다.</p>}

            <div
                ref={scrollRef}
                className="flex gap-5 overflow-x-auto max-w-full pb-2 custom-scrollbar" /* custom-scrollbar 클래스 유지 */
                style={{ height: "140px", overflowY: "hidden" }} /* 높이 조정 */
            >
                {images.map((img, i) => {
                    // 기존 이미지인 경우 img.shopImageUrl을 직접 사용하고, 새 파일인 경우 URL.createObjectURL 사용
                    const src = img.isNew && img.file ? URL.createObjectURL(img.file) : img.shopImageUrl;
                    return (
                        <div key={img.shopImageId || `new-${i}`} className="relative w-32 h-32 flex-shrink-0"> {/* 크기 조정 */}
                            <img
                                src={src}
                                alt={`Shop Image ${i + 1}`}
                                className={`w-full h-24 object-cover rounded-lg border-2 ${
                                    img.isThumbnail ? "border-blue-500" : "border-transparent"
                                }`}
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

                <div className="flex-shrink-0 flex items-center justify-center w-32 h-32"> {/* 크기 조정 */}
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
                        <Upload size={24} className="mr-2" /> {/* 아이콘 크기 조정 */}
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
