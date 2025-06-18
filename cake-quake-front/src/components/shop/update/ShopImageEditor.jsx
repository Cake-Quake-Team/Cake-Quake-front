import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { getShopDetail, updateShop } from '../../../api/shopApi.jsx'; // API 호출 함수 임포트
import ConfirmationModal from '../ConfirmationModal.jsx'; // 확인 모달 컴포넌트 임포트

const ShopImageEditor = ({ shopId, onClose }) => {
    // 이미지를 관리하는 상태. 기존 이미지는 URL을, 새로 추가된 이미지는 File 객체와 임시 URL을 가집니다.
    const [images, setImages] = useState([]);
    // 사용자에게 보여줄 이미지 삭제 확인 모달 관련 상태
    const [deleteTargetIndex, setDeleteTargetIndex] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    // 썸네일로 선택된 이미지의 인덱스를 추적하는 상태
    const [thumbnailIndex, setThumbnailIndex] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const data = await getShopDetail(shopId);
                // 기존 이미지를 불러와 상태에 설정합니다.
                setImages(data.imageUrls || []);
                // 불러온 이미지 중 썸네일이 있으면 해당 인덱스를 설정합니다.
                const initialThumbnail = (data.imageUrls || []).findIndex(img => img.isThumbnail);
                setThumbnailIndex(initialThumbnail !== -1 ? initialThumbnail : null);
            } catch (error) {
                console.error("매장 상세 정보를 불러오는 데 실패했습니다:", error);
            }
        };

        if (shopId) fetchImages();
    }, [shopId]);

    // 파일 입력 변경을 처리하는 함수
    const handleFileChange = (e, index) => {
        const file = e.target.files[0]; // 선택된 파일
        if (file) {
            // 파일을 읽어서 미리보기 URL을 생성합니다.
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedImages = [...images];
                // 기존 이미지를 업데이트하거나, 새 이미지에 File 객체와 미리보기 URL을 추가합니다.
                updatedImages[index] = {
                    ...updatedImages[index],
                    shopImageUrl: reader.result, // 미리보기 URL (base64)
                    file: file, // 실제 File 객체
                    isNew: true, // 새로운 파일임을 표시
                };
                setImages(updatedImages);

                // 만약 이 위치가 썸네일로 설정되어 있지 않았다면, 새로운 파일이므로
                // 썸네일 상태를 갱신할 필요가 없습니다. (썸네일은 radio 버튼으로 별도 선택)
            };
            reader.readAsDataURL(file); // 파일을 Data URL로 읽습니다.
        }
    };

    // 이미지 추가 버튼 클릭 시 호출
    const handleAddImage = () => {
        // 새로운 이미지 객체를 추가합니다. isNew: true는 이 이미지가 새로 추가되었음을 나타냅니다.
        setImages((prev) => [...prev, { shopImageId: null, shopImageUrl: '', isThumbnail: false, isNew: true }]);
    };

    // 썸네일 라디오 버튼 변경을 처리하는 함수
    const handleThumbnailChange = (index) => {
        setThumbnailIndex(index); // 선택된 썸네일의 인덱스 업데이트
        setImages((prev) =>
            prev.map((img, i) => ({
                ...img,
                isThumbnail: i === index, // 선택된 인덱스만 썸네일로 설정
            }))
        );
    };

    // 이미지 삭제 클릭 처리
    const handleDeleteClick = (index) => {
        setDeleteTargetIndex(index);
        setIsConfirmOpen(true);
    };

    // 이미지 삭제 확인 처리
    const handleConfirmDelete = () => {
        const updatedImages = images.filter((_, i) => i !== deleteTargetIndex);
        setImages(updatedImages);

        // 썸네일 인덱스 조정: 삭제된 항목이 썸네일이었거나, 삭제된 항목 앞에 있었을 경우
        if (thumbnailIndex !== null && deleteTargetIndex < thumbnailIndex) {
            setThumbnailIndex(prev => prev - 1);
        } else if (thumbnailIndex === deleteTargetIndex) {
            setThumbnailIndex(null); // 썸네일이 삭제된 경우
        }

        setDeleteTargetIndex(null);
        setIsConfirmOpen(false);
    };

    // 이미지 삭제 취소 처리
    const handleCancelDelete = () => {
        setDeleteTargetIndex(null);
        setIsConfirmOpen(false);
    };

    // 매장 정보 수정 제출 처리
    const handleSubmit = async () => {
        // 백엔드로 보낼 이미지 데이터 필터링 및 준비
        const dtoImageUrls = images
            .filter(img => img.shopImageId && !img.isNew) // 기존 이미지 중 수정되지 않은 것
            .map((img) => ({
                shopImageId: img.shopImageId,
                shopImageUrl: img.shopImageUrl, // 기존 이미지의 URL
                isThumbnail: img.isThumbnail,
            }));

        // 새로 추가된 파일들만 추출
        const filesToUpload = images
            .filter(img => img.isNew && img.file) // 새로 추가되고 실제 파일이 있는 경우
            .map(img => img.file);


        const shopUpdateDTO = {
            imageUrls: dtoImageUrls,
        };

        try {
            await updateShop(shopId, {
                dto: shopUpdateDTO,
                files: filesToUpload,
            });
            alert('매장 이미지가 성공적으로 수정되었습니다.');
            onClose(); // 수정 완료 후 모달 닫기
        } catch (err) {
            alert('이미지 수정 중 오류가 발생했습니다.');
            console.error(err);
        }
    };

    return (
        <div>
            {images.length === 0 && <p className="text-gray-500 mb-4">현재 등록된 이미지가 없습니다.</p>}

            {images.map((img, i) => (
                <div key={img.shopImageId || `new-${i}`} className="mb-4 flex flex-col sm:flex-row items-center gap-2 border p-3 rounded-md shadow-sm">
                    {/* 이미지 미리보기 */}
                    {img.shopImageUrl && (
                        <img
                            src={img.shopImageUrl}
                            alt={`Shop Image ${i + 1}`}
                            className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                        />
                    )}

                    {/* 파일 입력 필드 */}
                    <input
                        type="file"
                        accept="image/*" // 이미지 파일만 허용
                        onChange={(e) => handleFileChange(e, i)}
                        className="flex-grow border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    {/* 썸네일 라디오 버튼 */}
                    <label className="flex items-center gap-1 text-gray-700 flex-shrink-0">
                        <input
                            type="radio"
                            checked={i === thumbnailIndex} // 현재 인덱스와 썸네일 인덱스가 같으면 체크
                            onChange={() => handleThumbnailChange(i)}
                            className="form-radio text-blue-600"
                        />
                        <span className="text-sm">썸네일</span>
                    </label>

                    {/* 삭제 버튼 */}
                    <button
                        onClick={() => handleDeleteClick(i)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 flex-shrink-0"
                    >
                        삭제
                    </button>
                </div>
            ))}

            <div className="flex justify-between mt-4">
                {/* 이미지 추가 버튼 */}
                <button
                    onClick={handleAddImage}
                    className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md flex items-center gap-2 text-sm text-gray-700"
                >
                    <Upload size={16} />
                    이미지 추가
                </button>

                {/* 사진 수정 완료 버튼 */}
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                >
                    사진 수정 완료
                </button>
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
