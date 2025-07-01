import {useEffect, useState} from "react";
import CakeBasicInfoForm from "../../../components/cake/itemComponents/cakeBasicInfoForm.jsx";
import CakeImageUploadForm from "../../../components/cake/itemComponents/cakeImageForm.jsx";
import CakeOptionForm from "../../../components/cake/itemComponents/cakeOptionForm.jsx";
import {getOptionTypes, getOptionItems, addCake} from "../../../api/cakeApi.jsx";
import {Link, useNavigate} from "react-router";
import {useAuth} from "../../../store/AuthContext.jsx";

function CakeAddPage() {

    const {user} = useAuth()
    const navigate = useNavigate();

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
        const newFiles = selectedFiles.map((file) => ({
            file,
            isThumbnail: false,
        }));

        setCakeImage(prev => {
            const updated = [...prev, ...newFiles];

            // 썸네일 지정이 없다면 첫 번째 이미지 자동 지정
            const hasThumbnail = updated.some(img => img.isThumbnail);
            if (!hasThumbnail && updated.length > 0) {
                updated[0].isThumbnail = true;
            }

            return updated;
        });

        e.target.value = null; // input 초기화
    };

    // 썸네일 선택 핸들러 추가
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
            const updated = prev.filter((_, idx) => idx !== indexToRemove);

            // 삭제 후 썸네일이 하나도 없다면 첫 번째 걸 썸네일로 지정
            const hasThumbnail = updated.some(img => img.isThumbnail);
            if (!hasThumbnail && updated.length > 0) {
                updated[0].isThumbnail = true;
            }

            return updated;
        });
    };


    // 옵션 상태 및 API 호출
    const [optionTypes, setOptionTypes] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                // 모든 옵션 타입 가져오기
                const fetchedOptionTypes = await getOptionTypes(user.shopId); // 변수명 충돌 피하기 위해 변경
                // 모든 옵션 값 가져오기
                const fetchedOptionItems = await getOptionItems(user.shopId);

                // 타입과 아이템 매핑
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
                    }
                })
                setOptionTypes(mergedOptionTypes); // 병합된 데이터를 상태에 저장
            } catch (err) {
                console.error("옵션 데이터 불러오기 실패", err);
            }
        };

        fetchOptions();
    }, [user.shopId]);

    const handleSubmit = async () => {
        try {
            const thumbnailImage = cakeImage.find(img => img.isThumbnail);
            const optionItemIds = selectedOptions.map(option => option.optionItemId);

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
                        console.log(`[프론트] FormData에 파일 추가: ${img.file.name}, 크기: ${img.file.size} bytes`);
                    } else {
                        console.warn("[프론트] images 배열에 File 객체가 아닌 요소 발견:", img);
                    }
                });
            } else {
                console.log("[프론트] 선택된 이미지가 없어 'cakeImages' 파트를 전송하지 않습니다.");
            }

            // 여기서 API 호출
            const result = await addCake(formData);
            console.log("저장 성공!", result);
            alert("상품이 성공적으로 등록되었습니다!");
        } catch (error) {
            console.error("상품 등록 실패", error);
            alert("등록 중 오류 발생");
        }
        navigate(`/shops/${user.shopId}`);
    };

    return (
        <div>
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