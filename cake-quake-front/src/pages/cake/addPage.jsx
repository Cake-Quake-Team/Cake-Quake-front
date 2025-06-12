import {useEffect, useState} from "react";
import SellerHeader from "../../components/common/sellerHeader";
import CakeBasicInfoForm from "../../components/cake/addCakeComponent/cakeBasicInfoForm.jsx";
import CakeImageUploadForm from "../../components/cake/addCakeComponent/cakeImageForm.jsx";
import CakeOptionForm from "../../components/cake/addCakeComponent/cakeOptionForm.jsx";
import {getOptionTypes, getOptionItems, addCake} from "../../api/cakeApi.jsx";

function CakeAddPage() {
    const [addCakeDTO, setAddCakeDTO] = useState({
        cname: "",
        price: "",
        description: "",
        category: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddCakeDTO((prev) => ({ ...prev, [name]: value }));
    };

    // 이미지 추가
    const [cakeImage, setCakeImage] = useState([]);

    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        const newFiles = selectedFiles.map(file => ({
            file,
            isThumbnail: false,
        }));

        setCakeImage((prev) => [...prev, ...newFiles]);

        e.target.value = null;
    };

    // 썸네일 지정 함수
    const handleThumbnailSelect = (index) => {
        setCakeImage(prev =>
            prev.map((img, i) => ({
                ...img,
                isThumbnail: i === index,
            }))
        );
    };

    // 이미지 삭제
    const handleImageRemove = (indexToRemove) => {
        setCakeImage(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    // 옵션 상태 및 API 호출
    const [optionTypes, setOptionTypes] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({});
    const shopId = 3;   // 실제 shopId로 바꿔야 함.

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                // 모든 옵션 타입 가져오기
                const fetchedOptionTypes = await getOptionTypes(shopId); // 변수명 충돌 피하기 위해 변경
                // 모든 옵션 값 가져오기
                const fetchedOptionItems = await getOptionItems(shopId);

                // 타입과 아이템 매핑
                const mergedOptionTypes = fetchedOptionTypes.map(type => { // 변경된 변수명 사용
                    const relevantItems = fetchedOptionItems.filter(item => // 변경된 변수명 사용
                        item.optionTypeId === type.optionTypeId
                    );

                    return {
                        optionTypeId: type.optionTypeId,
                        name: type.optionType,
                        optionValues: relevantItems.map(item => ({
                            optionValueId: item.optionItemId,
                            name: item.optionName,
                            price: item.price
                        }))
                    }
                })
                setOptionTypes(mergedOptionTypes); // 병합된 데이터를 상태에 저장
            } catch (err) {
                console.error("옵션 데이터 불러오기 실패", err);
            }
        };

        fetchOptions();
    }, [shopId]);

    const handleSubmit = async () => {
        try {
            const thumbnailImage = cakeImage.find(img => img.isThumbnail);
            const optionItemIds = Object.values(selectedOptions).flat();

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
                cakeImage.forEach(img => {
                    if (img.file instanceof File) {
                        formData.append("cakeImages", img.file);
                        console.log(`[프론트] FormData에 파일 추가: ${img.file.name}, 크기: ${img.file.size} bytes`);
                    } else {
                        console.warn("[프론트] images 배열에 File 객체가 아닌 요소 발견:", img);
                    }
                });
            } else {
                console.log("[프론트] 선택된 이미지가 없어 'cakeImages' 파트를 전송하지 않습니다.");
            }

            // 여기서 API 호출
            const result = await addCake(shopId, formData);
            console.log("저장 성공!", result);
            alert("상품이 성공적으로 등록되었습니다!");
        } catch (error) {
            console.error("상품 등록 실패", error);
            alert("등록 중 오류 발생");
        }
    };

    return (
        <div>
            <SellerHeader/>
            <div className="container mx-auto px-6 py-10">
                <h1 className="text-2xl font-semibold mb-6 text-center">새 상품 등록</h1>
                <hr/>
                <CakeImageUploadForm
                    images={cakeImage}
                    onImageChange={handleImageChange}
                    onImageRemove={handleImageRemove}
                    onThumbnailSelect={handleThumbnailSelect}
                />
                <CakeBasicInfoForm formData={addCakeDTO} onChange={handleChange}/>
                <CakeOptionForm optionTypes={optionTypes} selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions}/>
            <button
                onClick={handleSubmit}
                className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                저장하기
            </button>
            </div>
        </div>
    );
}

export default CakeAddPage;