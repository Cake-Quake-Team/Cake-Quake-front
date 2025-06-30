import React from "react";
import CakeCategorySelector from "./categorySelectComponent.jsx";
import { detailCategories } from "../../../constants/cakeCategory";

// 숫자에 천단위 콤마 붙이는 함수
const formatNumberWithCommas = (value) => {
    if (value === '' || value === undefined || value === null) return '';
    const numericValue = value.toString().replace(/,/g, '');
    if (isNaN(numericValue)) return '';
    return Number(numericValue).toLocaleString('ko-KR');
};

function CakeBasicInfoForm({ formData, onChange }) {
    // 가격 input에 특화된 onChange 핸들러
    const handlePriceChange = (e) => {
        const rawValue = e.target.value.replace(/,/g, ''); // 콤마 제거
        // 숫자만 부모 onChange에 전달
        onChange({ target: { name: 'price', value: rawValue } });
    };

    return (
        <div className="space-y-4 mt-6">
            <div>
                <label className="block text-gray-700 font-medium">상품명</label>
                <input
                    type="text"
                    name="cname"
                    value={formData.cname || ''}
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
                    onSelect={(value) => onChange({ target: { name: "category", value } })}
                />
            </div>
            <div>
                <label className="block text-gray-700 font-medium">가격 (원)</label>
                <input
                    name="price"
                    value={formatNumberWithCommas(formData.price)} // 포맷된 값 보여주기
                    onChange={handlePriceChange} // 콤마 제거 후 숫자만 전달
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                    placeholder="예: 25,000"
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
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="isOnsale"
                    name="isOnsale"
                    checked={formData.isOnsale}
                    onChange={(e) => onChange({ target: { name: "isOnsale", value: e.target.checked } })}
                    className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="isOnsale" className="text-gray-700 font-medium">
                    품절여부
                </label>
            </div>
        </div>
    );
}

export default CakeBasicInfoForm;
