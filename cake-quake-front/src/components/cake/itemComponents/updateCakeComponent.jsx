import CakeBasicInfoForm from "./cakeBasicInfoForm.jsx";
import CakeImageUploadForm from "./cakeImageForm.jsx";
import CakeOptionForm from "./cakeOptionForm.jsx";

function UpdateCake({
                          formData,
                          onChange,
                          images,
                          onImageChange,
                          onImageRemove,
                          onThumbnailSelect,
                          optionTypes,
                          selectedOptions,
                          setSelectedOptions
                      }) {
    return (
        <form
            id="update-cake-form"
            className="max-w-4xl mx-auto bg-white p-8 rounded-xl"
        >
            {/* 이미지 업로드 */}
            <CakeImageUploadForm
                images={images}
                onImageChange={onImageChange}
                onImageRemove={onImageRemove}
                onThumbnailSelect={onThumbnailSelect}
            />

            {/* 기본 정보 입력 */}
            <CakeBasicInfoForm formData={formData} onChange={onChange} />

            {/* 옵션 선택 */}
            <CakeOptionForm
                optionTypes={optionTypes}
                selectedOptions={selectedOptions}
                setSelectedOptions={setSelectedOptions}
            />
        </form>
    );
}

export default UpdateCake;
