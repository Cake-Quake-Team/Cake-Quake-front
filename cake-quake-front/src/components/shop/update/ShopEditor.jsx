import React, { useState, useEffect } from 'react';
import ShopInfoForm from './ShopInfoForm';
import ShopImageEditor from './ShopImageEditor';
import { getShopDetail, updateShop } from '../../../api/shopApi.jsx';
import ShopImageGallery from "../read/ShopImageGallery.jsx";
import AlertModal from "../../common/AlertModal.jsx";

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
        thumbnailImageUrl: '',
        imageUrls: [], // ShopImageDTO 리스트 (기존 이미지에 대한 정보)
    });

    // ShopImageEditor와 공유할 이미지 상태 (ShopEditor가 관리)
    // images 배열의 각 항목은 { shopImageId, shopImageUrl, isThumbnail, file (새 파일인 경우), isNew }
    const [editorImages, setEditorImages] = useState([]);
    const [editorThumbnailIndex, setEditorThumbnailIndex] = useState(null);

    const [formError, setFormError] = useState(null);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => setShowError(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showError]);


    useEffect(() => {
        const fetchShop = async () => {
            try {
                const data = await getShopDetail(shopId);

                const initialImages = data.images || []; // data.images가 undefined일 경우 빈 배열 사용
                setForm({
                    ...data,
                    imageUrls: initialImages, // images 필드 사용
                });

                setEditorImages(initialImages); // images 필드 사용

                const initialThumbnail = (initialImages).findIndex(img => img.isThumbnail);
                setEditorThumbnailIndex(initialThumbnail !== -1 ? initialThumbnail : null);

            } catch (error) {
                console.error("🚨 ShopEditor: 매장 상세 정보를 불러오는 데 실패했습니다:", error);
                setFormError({message: "매장 정보를 불러오는 중 오류가 발생했습니다.", type: "error"});
                setShowError(true);
            }
        };
        if (shopId) {
            fetchShop();
        }
    }, [shopId]);


    // ShopInfoForm에서 입력 값이 변경될 때 호출되는 핸들러
    const handleFormChange = (newFormData) => {
        setForm(prevForm => {
            return {
                ...prevForm,
                ...newFormData,
            };
        });
    };

    const handleSubmit = async () => {
        // 1. DTO 데이터를 준비 (form 상태와 editorImages 상태에서 가져옴)
        const dtoImageUrls = editorImages
            .map((img) => {
                return {
                    shopImageId: img.shopImageId || null, // 새로 추가된 경우 null
                    // 새로운 파일의 경우 img.shopImageUrl은 임시 URL(base64)이므로, 백엔드에서는 무시
                    // 기존 이미지의 경우 유효한 URL
                    shopImageUrl: img.shopImageUrl,
                    isThumbnail: img.isThumbnail, // 가장 중요한 정보!
                };
            });

        // 새로 추가된 파일들만 추출 (isNew 플래그가 true이고 file 객체가 있는 경우)
        const filesToUpload = editorImages
            .filter(img => img.isNew && img.file)
            .map(img => img.file);

        // ShopUpdateDTO 최종 구성
        const shopUpdateDTO = {
            ...form, // ShopInfoForm에서 관리되는 모든 필드 포함
            imageUrls: dtoImageUrls, // 기존/신규 이미지 DTO 정보 모두 포함
        };

        try {
            await updateShop(shopId, {
                dto: shopUpdateDTO,
                files: filesToUpload,
            });

            setFormError({message: '매장 정보가 성공적으로 수정되었습니다.', type: "success"});
            setShowError(true);
            // 성공 후 상태 갱신 로직: 서버에서 최신 데이터를 다시 불러와 UI를 업데이트
            // 이렇게 하면 새로 업로드된 이미지의 실제 서버 URL이 반영됩니다.
            const updatedData = await getShopDetail(shopId);
            setForm({
                ...updatedData,
                imageUrls: updatedData.imageUrls || []
            });
            setEditorImages(updatedData.images || []);
            const updatedThumbnail = (updatedData.imageUrls || []).findIndex(img => img.isThumbnail);
            setEditorThumbnailIndex(updatedThumbnail !== -1 ? updatedThumbnail : null);

        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setFormError({message: `매장 정보 수정 중 오류가 발생했습니다: ${error.response.data.message}`, type: 'error'});
                setShowError(true);
            } else {
                setFormError({message: '매장 정보 수정 중 알 수 없는 오류가 발생했습니다.', type: 'error'});
                setShowError(true);
            }
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            {showError && formError && (
                <AlertModal
                    message={formError.message}
                    type={formError.type || "error"}
                    show={showError}
                />
            )}
            {/* 매장 기본 정보 입력 폼 */}
            <ShopInfoForm form={form} onChange={handleFormChange} />

            {/* --- */}
            <hr className="my-6 border-gray-300" />

            {/* 매장 사진 편집 컴포넌트: 이제 이 컴포넌트가 모든 이미지 관리를 담당 */}
            <h2 className="text-2xl font-bold mb-4">매장 사진 편집</h2>
            <ShopImageEditor
                images={editorImages}
                setImages={setEditorImages}
                thumbnailIndex={editorThumbnailIndex}
                setThumbnailIndex={setEditorThumbnailIndex}
            />
            {/* --- */}
            <hr className="my-6 border-gray-300" />

            <div className="flex justify-center mt-6">
                {/* 매장 정보 저장 버튼 */}
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                >
                    매장 정보 저장
                </button>
            </div>
        </div>
    );
};

export default ShopEditor;
