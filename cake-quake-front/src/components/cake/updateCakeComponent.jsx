import CakeBasicInfoForm from "../../components/cake/addCakeComponent/cakeBasicInfoForm";
import CakeImageUploadForm from "../../components/cake/addCakeComponent/cakeImageForm";
import CakeOptionForm from "../../components/cake/addCakeComponent/cakeOptionForm";

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
