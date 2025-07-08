import { useEffect, useState } from "react";
import CakeBasicInfoForm from "../../../components/cake/itemComponents/cakeBasicInfoForm.jsx";
import CakeImageUploadForm from "../../../components/cake/itemComponents/cakeImageForm.jsx";
import CakeOptionForm from "../../../components/cake/itemComponents/cakeOptionForm.jsx";
import { getOptionTypes, getOptionItems, addCake } from "../../../api/cakeApi.jsx";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../../store/AuthContext.jsx";
import AlertModal from "../../../components/common/AlertModal";

function CakeAddPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [addCakeDTO, setAddCakeDTO] = useState({
        cname: "",
        price: "",
        description: "",
        category: ""
    });

    const [cakeImage, setCakeImage] = useState([]);

    const [optionTypes, setOptionTypes] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const [formError, setFormError] = useState(null);
    const [showError, setShowError] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddCakeDTO((prev) => ({ ...prev, [name]: value }));
    };

    // 이미지 추가
    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const newFiles = selectedFiles.map((file) => ({
            file,
            src: URL.createObjectURL(file),
            isThumbnail: false,
        }));

        setCakeImage(prev => {
            const updated = [...prev, ...newFiles];
            const hasThumbnail = updated.some(img => img.isThumbnail);
            if (!hasThumbnail && updated.length > 0) {
                updated[0].isThumbnail = true;
            }
            return updated;
        });
    };

    // 썸네일 선택
    const handleThumbnailSelect = (indexToSelect) => {
        setCakeImage((prev) =>
            prev.map((img, index) => ({
                ...img,
                isThumbnail: index === indexToSelect,
            }))
        );
    };

    // 이미지 삭제
    const handleImageRemove = (indexToRemove) => {
        setCakeImage(prev => {
            const updated = prev.filter((img, idx) => {
                if (idx === indexToRemove && img.file) {
                    URL.revokeObjectURL(img.src);
                }
                return idx !== indexToRemove;
            });
            const hasThumbnail = updated.some(img => img.isThumbnail);
            if (!hasThumbnail && updated.length > 0) {
                updated[0].isThumbnail = true;
            }
            return updated;
        });
    };

    // 컴포넌트 언마운트 시 메모리 해제
    useEffect(() => {
        return () => {
            cakeImage.forEach(img => {
                if (img.file && img.src.startsWith('blob:')) {
                    URL.revokeObjectURL(img.src);
                }
            });
        };
    }, [cakeImage]);

    // 옵션 타입 & 아이템 불러오기
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const fetchedOptionTypes = await getOptionTypes(user.shopId);
                const fetchedOptionItems = await getOptionItems(user.shopId);

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
                console.error("옵션 데이터 불러오기 실패", err);
            }
        };

        fetchOptions();
    }, [user.shopId]);

    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => setShowError(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showError]);

    const handleSubmit = async () => {
        try {
            const thumbnailImage = cakeImage.find(img => img.isThumbnail);
            const optionItemIds = selectedOptions.map(option => option.optionItemId);

            if (!addCakeDTO.cname || !addCakeDTO.price) {
                setFormError({ message: "상품명과 가격은 필수 입력 사항입니다.", type: "error" });
                setShowError(true);
                return;
            }

            const addCakeDTOWithAll = {
                ...addCakeDTO,
                imageUrls: [],
                mappingRequestDTO: {
                    optionItemIds: optionItemIds
                },
                thumbnailImageUrl: thumbnailImage ? thumbnailImage.file.name : null
            };

            const formData = new FormData();
            formData.append(
                "addCakeDTO",
                new Blob([JSON.stringify(addCakeDTOWithAll)], { type: "application/json" })
            );

            if (cakeImage.length > 0) {
                cakeImage.forEach((img) => {
                    if (img.file instanceof File) {
                        formData.append("cakeImages", img.file);
                    }
                });
            }

            await addCake(formData);

            alert("상품이 성공적으로 등록되었습니다!");
            navigate(`/shops/${user.shopId}`);

        } catch (error) {
            console.error("상품 등록 실패", error);
            const errorMessage = error.response?.data?.message || error.message || "알 수 없는 오류";
            setFormError({ message: `등록 중 오류 발생: ${errorMessage}`, type: "error" });
            setShowError(true);
        }
    };

    return (
        <div>
            <div className="container mx-auto px-6 py-10">
                <h1 className="text-2xl font-semibold mb-6 text-center">새 상품 등록</h1>
                <hr />
                {showError && formError && (
                    <AlertModal
                        message={formError.message}
                        type={formError.type || "error"}
                        show={showError}
                    />
                )}
                <CakeImageUploadForm
                    images={cakeImage}
                    onImageChange={handleImageChange}
                    onImageRemove={handleImageRemove}
                    onThumbnailSelect={handleThumbnailSelect}
                />
                <CakeBasicInfoForm formData={addCakeDTO} onChange={handleChange} />
                <CakeOptionForm optionTypes={optionTypes} selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} />
                <div className="mt-6 flex justify-center">
                    <Link
                        to={`/shops/${user.shopId}`}
                        className="mt-6 border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
                    >
                        취소
                    </Link>
                    <button
                        onClick={handleSubmit}
                        className="mt-6 ml-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                        등록
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CakeAddPage;
