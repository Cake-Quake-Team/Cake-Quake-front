import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router";
import UpdateCake from "../../components/cake/updateCakeComponent";
import {getCakeDetail, updateCake, getOptionTypes, getOptionItems} from "../../api/cakeApi";

function CakeUpdatePage() {
    const {cakeId} = useParams();
    const navigate = useNavigate();

    // 케이크 기본 정보
    const [updateDTO, setUpdateDTO] = useState({
        cname: "",
        category: "",
        price: "",
        description: "",
        isOnSale: false
    });

    // 이미지 URL 배열 (string)
    const [images, setImages] = useState([]);

    // 옵션
    const [optionTypes, setOptionTypes] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const shopId = 3;

    // 초기 데이터 로딩
    useEffect(() => {
        const fetchData = async () => {
            try {
                const cake = await getCakeDetail(shopId, cakeId);

                const {
                    cname,
                    category,
                    price,
                    description,
                    isOnsale,
                    imageUrls,
                } = cake.cakeDetailDTO;

                setUpdateDTO({ cname, category, price, description, isOnSale: isOnsale });

                // **초기 이미지 상태 설정: 서버에서 받은 기존 이미지들만 로드**
                const loadedImages = imageUrls.map((img) => ({
                    id: img.imageId,
                    src: img.imageUrl,
                    file: null,
                    isThumbnail: img.isThumbnail,
                }));

                setImages(loadedImages); // 초기 이미지만 설정

                // 기존 선택된 옵션 아이템 설정
                setSelectedOptions(cake.options || []);
                console.log("초기 선택된 옵션 (setSelectedOptions 직전):", cake.options);

                // 3. 모든 옵션 타입과 모든 옵션 아이템 가져와서 매핑
                const fetchedOptionTypes = await getOptionTypes(shopId);
                const fetchedOptionItems = await getOptionItems(shopId);
                console.log("모든 옵션 타입 API 응답 (getOptionTypes):", fetchedOptionTypes); // <-- 이 로그 확인

                const mergedOptionTypes = fetchedOptionTypes.map(type => {
                    const relevantItems = fetchedOptionItems.filter(item =>
                        item.optionTypeId === type.optionTypeId
                    );

                    return {
                        optionTypeId: type.optionTypeId,
                        optionType: type.optionType,
                        optionItems: relevantItems.map(item => ({
                            optionItemId: item.optionItemId,
                            optionName: item.optionName,
                            price: item.price
                        }))
                    };
                });
                setOptionTypes(mergedOptionTypes);

            } catch (err) {
                console.error("데이터 불러오기 실패:", err);
                alert("케이크 정보를 불러오는데 실패했습니다.");
            }
        };

        fetchData();
    }, [shopId, cakeId]);

    // 기본 정보 입력 핸들러
    const handleChange = (e) => {
        const {name, value} = e.target;
        setUpdateDTO((prev) => ({...prev, [name]: value}));
    };

    // 이미지 파일 추가 핸들러
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const newImageObjects = files.map(file => ({
            id: null, // 새 이미지는 ID가 없음
            src: URL.createObjectURL(file), // 미리보기 URL 생성 (blob:URL)
            file: file, // File 객체 저장
            isThumbnail: false, // 기본적으로 썸네일 아님
        }));

        setImages((prev) => {
            // 새 이미지가 추가될 때, 기존 썸네일이 없으면 첫 번째 이미지를 썸네일로 설정
            const hasThumbnail = prev.some(img => img.isThumbnail);
            if (!hasThumbnail && newImageObjects.length > 0) {
                newImageObjects[0].isThumbnail = true;
            }
            return [...prev, ...newImageObjects];
        });
    };

    // 이미지 제거 핸들러
    const handleImageRemove = (indexToRemove) => {
        setImages((prevImages) => {
            const updatedImages = prevImages.filter((_, index) => index !== indexToRemove);

            // 삭제된 이미지가 썸네일이었다면, 새 썸네일 지정 (남아있는 첫 번째 이미지가 있다면)
            const removedImageWasThumbnail = prevImages[indexToRemove]?.isThumbnail;
            if (removedImageWasThumbnail && updatedImages.length > 0) {
                updatedImages[0].isThumbnail = true;
            } else if (removedImageWasThumbnail && updatedImages.length === 0) {
                // 모든 이미지가 삭제되면 썸네일도 없음
            }
            return updatedImages;
        });
    };

    // 썸네일 선택 핸들러
    const handleThumbnailSelect = (indexToSelect) => {
        setImages((prevImages) =>
            prevImages.map((img, index) => ({
                ...img,
                isThumbnail: index === indexToSelect,
            }))
        );
    };

    async function uploadImage(file) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/images/upload", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("이미지 업로드 실패");
        }

        return await response.json(); // { id, url }
    }


    // 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // 1. 새 이미지 파일만 업로드
            const uploadedImages = [];
            for (const img of images) {
                if (img.file) {
                    const result = await uploadImage(img.file); // 업로드
                    uploadedImages.push({
                        id: result.id,
                        src: result.url,
                        isThumbnail: img.isThumbnail,
                    });
                }
            }

            // 2. 기존 이미지 + 새로 업로드한 이미지 통합
            const allImages = [
                ...images.filter((img) => img.id !== null), // 기존 이미지
                ...uploadedImages,
            ];

            // 3. 썸네일 ID 찾기
            const thumbnailImage = allImages.find((img) => img.isThumbnail);
            const thumbnailImageId = thumbnailImage?.id || null;

            // 4. 최종 이미지 ID 목록
            const imageIds = allImages.map((img) => img.id);

            // 5. DTO 구성
            const updateDTOBlob = new Blob(
                [
                    JSON.stringify({
                        cname: updateDTO.cname,
                        category: updateDTO.category,
                        price: updateDTO.price,
                        description: updateDTO.description,
                        isOnsale: updateDTO.isOnsale,
                        imageIds: imageIds,
                        thumbnailImageId: thumbnailImageId,
                        optionItemIds: selectedOptions.map((opt) => opt.optionItemId),
                    }),
                ],
                { type: "application/json" }
            );

            // 6. FormData 구성
            const formData = new FormData();
            formData.append("updateCakeDTO", updateDTOBlob);

            // 7. 최종 요청
            await updateCake(shopId, cakeId, formData);
            alert("케이크 수정 완료!");
            navigate(`/seller/cakes/read/${cakeId}`);
        } catch (err) {
            console.error("수정 실패", err);
            alert("케이크 수정 중 오류가 발생했습니다.");
        }
    };


    return (
        <>
            <div className="container mx-auto px-6 py-10">
                <h1 className="text-2xl font-semibold mb-3 text-center">상품 수정</h1>
                <hr className="w-1/4 m-auto"/>
                <UpdateCake
                    formData={updateDTO}
                    onChange={handleChange}
                    images={images}
                    onImageChange={handleImageChange}
                    onImageRemove={handleImageRemove}
                    onThumbnailSelect={handleThumbnailSelect}
                    optionTypes={optionTypes}
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                />
                <div className="flex justify-center mt-6">
                <Link
                    to={`/cakes/seller/read/${cakeId}`}
                    className="mt-6 border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
                >
                    취소
                </Link>
                <button
                    onClick={handleSubmit}
                    className="mt-6 ml-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                    저장
                </button>
                </div>
            </div>
        </>
    );
}

export default CakeUpdatePage;
