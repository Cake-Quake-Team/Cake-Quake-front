import CakeCategorySelector from "../../cake/categorySelectComponent";
import { detailCategories } from "../../../constants/cakeCategory";

function CakeBasicInfoForm({ formData, onChange }) {
    return (
        <div className="space-y-4 mt-6">
            <div>
                <label className="block text-gray-700 font-medium">상품명</label>
                <input
                    type="text"
                    name="cname"
                    value={formData.cname  || ''}
                    onChange={onChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                    placeholder="예: 레터링 케이크"
                />
            </div>
            <div>
                <label className="block text-gray-700 font-medium mb-1">카테고리 선택</label>
                <CakeCategorySelector
                    categories={detailCategories}
                    selectedKeyword={formData.category}
                    onSelect={(value) =>
                        onChange({ target: { name: "category", value } })
                    }
                />
            </div>
            <div>
                <label className="block text-gray-700 font-medium">가격 (원)</label>
                <input
                    name="price"
                    value={formData.price}
                    onChange={onChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                    placeholder="예: 25000"
                />
            </div>
            <div>
                <label className="block text-gray-700 font-medium">설명</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={onChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                    placeholder="간단한 상품 설명을 입력하세요."
                />
            </div>


        </div>
    );
}

export default CakeBasicInfoForm;
