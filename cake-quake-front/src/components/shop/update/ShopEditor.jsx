import React, { useState, useEffect } from 'react';
import ShopInfoForm from './ShopInfoForm';
import ShopImageEditor from './ShopImageEditor';
import { getShopDetail, updateShop } from '../../../api/shopApi.jsx';

const ShopEditor = ({ shopId }) => {
    // 매장 기본 정보 및 기존 이미지 URL을 관리하는 상태
    const [form, setForm] = useState({
        address: '',
        phone: '',
        content: '',
        openTime: '',
        closeTime: '',
        closeDays: '',
        websiteUrl: '',
        instagramUrl: '',
        status: '',
        thumbnailImageUrl: '', // DTO의 썸네일 URL (새 파일 업로드 시에는 필요 없을 수 있음)
        imageUrls: [], // ShopImageDTO 리스트 (기존 이미지에 대한 정보)
    });

    // ShopImageEditor에서 사용할 이미지 상태 (새로운 파일 및 기존 이미지 관리)
    // images 배열의 각 항목은 { shopImageId, shopImageUrl, isThumbnail, file (새 파일인 경우), isNew }
    const [editorImages, setEditorImages] = useState([]);
    const [editorThumbnailIndex, setEditorThumbnailIndex] = useState(null); // ShopImageEditor에서 썸네일 선택을 위한 인덱스

    const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);

    // 컴포넌트 마운트 시 또는 shopId 변경 시 매장 정보 불러오기
    useEffect(() => {
        const fetchShop = async () => {
            try {
                const data = await getShopDetail(shopId);
                setForm({
                    ...data,
                    // DTO의 imageUrls는 ShopImageDTO 리스트이므로 그대로 사용
                    imageUrls: data.imageUrls || [],
                });
                // ShopImageEditor에서 사용할 이미지 상태도 초기화
                setEditorImages(data.imageUrls || []);
                // 초기 썸네일 인덱스 설정
                const initialThumbnail = (data.imageUrls || []).findIndex(img => img.isThumbnail);
                setEditorThumbnailIndex(initialThumbnail !== -1 ? initialThumbnail : null);

            } catch (error) {
                console.error("매장 상세 정보를 불러오는 데 실패했습니다:", error);
                alert("매장 정보를 불러오는 중 오류가 발생했습니다.");
            }
        };
        if (shopId) {
            fetchShop();
        }
    }, [shopId]);

    // ShopInfoForm에서 입력 값이 변경될 때 호출되는 핸들러
    const handleFormChange = (newFormData) => {
        setForm(prevForm => ({
            ...newFormData,
            // ShopInfoForm은 이미지를 직접 수정하지 않으므로,
            // 기존 form의 imageUrls는 유지하거나, 여기서는 제거해도 됨 (editorImages에서 관리되므로)
            // 하지만 백엔드 DTO에 imageUrls가 있다면 남겨두는 것이 안전합니다.
            imageUrls: prevForm.imageUrls // ShopImageEditor가 관리하므로 이 값은 변동 없음
        }));
    };

    const handleSubmit = async () => {
    // 1. DTO 데이터를 준비 (form 상태에서 가져옴)
    // 기존 이미지와 새로 추가된 이미지를 모두 포함하여 백엔드로 보낼 imageUrls 배열을 구성합니다.
    const dtoImageUrls = editorImages
        .map((img) => {
            // 새로 추가된 파일인 경우 shopImageId는 null, shopImageUrl은 임시 URL이거나 비어있음
            // 하지만 isThumbnail 정보는 필요합니다.
            return {
                shopImageId: img.shopImageId || null, // 새로 추가된 경우 null
                shopImageUrl: img.shopImageUrl, // 기존 이미지 URL 또는 새로 추가된 이미지의 임시 URL (백엔드에서는 무시)
                isThumbnail: img.isThumbnail, // 가장 중요한 정보!
            };
        });

    // 새로 추가된 파일들만 추출
    const filesToUpload = editorImages
        .filter(img => img.isNew && img.file)
        .map(img => img.file);

    // ShopUpdateDTO 최종 구성
    const shopUpdateDTO = {
        ...form, // ShopInfoForm에서 관리되는 모든 필드 포함
        imageUrls: dtoImageUrls, // 기존/신규 이미지 DTO 정보 모두 포함
    };

    try {
        // updateShop 함수 호출. dto와 files를 함께 전달
        await updateShop(shopId, {
            dto: shopUpdateDTO,
            files: filesToUpload,
        });

        alert('매장 정보가 성공적으로 수정되었습니다.');

        // ... (성공 후 상태 갱신 로직)
        const updatedData = await getShopDetail(shopId);
        setForm({
            ...updatedData,
            imageUrls: updatedData.imageUrls || []
        });
        setEditorImages(updatedData.imageUrls || []);
        const updatedThumbnail = (updatedData.imageUrls || []).findIndex(img => img.isThumbnail);
        setEditorThumbnailIndex(updatedThumbnail !== -1 ? updatedThumbnail : null);

    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            alert(`매장 정보 수정 중 오류가 발생했습니다: ${error.response.data.message}`);
        } else {
            alert('매장 정보 수정 중 알 수 없는 오류가 발생했습니다.');
        }
        console.error("매장 정보 저장 오류:", error);
    }
};

    return (
        <div className="p-6 max-w-3xl mx-auto">
            {/* 매장 기본 정보 입력 폼 */}
            <ShopInfoForm form={form} onChange={handleFormChange} />

            <div className="mt-6 flex justify-center gap-4">
                {/* 매장 사진 수정 버튼: 클릭 시 이미지 편집 모달 열기 */}
                <button
                    onClick={() => {
                        setIsImageEditorOpen(true);
                    }}
                    className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition duration-200"
                >
                    매장 사진 수정
                </button>

                {/* 매장 정보 저장 버튼 */}
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                >
                    매장 정보 저장
                </button>
            </div>

            {/* 이미지 편집 모달 */}
            {isImageEditorOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-xl w-full relative">
                        <button
                            onClick={() => {
                                setIsImageEditorOpen(false);
                            }}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl font-bold"
                        >
                            ✕
                        </button>
                        <h3 className="text-xl font-bold mb-4">매장 사진 편집</h3>
                        <ShopImageEditor
                            shopId={shopId}
                            images={editorImages} // 이미지 상태 전달
                            setImages={setEditorImages} // 이미지 상태 변경 함수 전달
                            thumbnailIndex={editorThumbnailIndex} // 썸네일 인덱스 전달
                            setThumbnailIndex={setEditorThumbnailIndex} // 썸네일 인덱스 변경 함수 전달
                            onClose={async () => {
                                setIsImageEditorOpen(false); // 모달 닫기
                                // 모달 닫을 때만 상태를 동기화하고, 저장 로직은 handleSubmit에서만 발생하도록 함
                            }}
                            // ShopImageEditor에서 직접 저장 버튼을 제거하고,
                            // 데이터를 부모로 올린 후 부모의 handleSubmit에서 통합 저장하도록 유도합니다.
                            // 따라서 ShopImageEditor 내부의 handleSubmit은 이제 필요 없습니다.
                            // 또는 ShopImageEditor 내부에 저장 버튼이 있다면, 그 저장 버튼은
                            // images와 thumbnailIndex 상태를 변경하는 역할만 하고,
                            // 실제 API 호출은 부모의 handleSubmit에서 이루어지도록 해야 합니다.
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopEditor;
