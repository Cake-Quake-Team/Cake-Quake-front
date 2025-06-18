


const ShopInfoForm = ({ form, onChange }) => {

    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange({ ...form, [name]: value });
        console.log(`ShopInfoForm - handleChange: Updating field '${name}' to '${value}'.`);
        console.log("ShopInfoForm - handleChange: New form state (to be passed up):", { ...form, [name]: value });
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto my-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">매장 정보 수정</h2>

            <div className="mb-4">
                <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
                    주소 <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    value={form.address} // 부모로부터 받은 form 사용
                    onChange={handleChange}
                    placeholder="매장 주소를 입력하세요"
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
                    전화번호
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="예: 02-1234-5678"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
                    소개글 <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="content"
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    placeholder="매장을 소개하는 글을 작성해주세요."
                    rows="5"
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label htmlFor="openTime" className="block text-gray-700 text-sm font-bold mb-2">
                        오픈 시간
                    </label>
                    <input
                        type="time"
                        id="openTime"
                        name="openTime"
                        value={form.openTime}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div>
                    <label htmlFor="closeTime" className="block text-gray-700 text-sm font-bold mb-2">
                        마감 시간
                    </label>
                    <input
                        type="time"
                        id="closeTime"
                        name="closeTime"
                        value={form.closeTime}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="closeDays" className="block text-gray-700 text-sm font-bold mb-2">
                    휴무일
                </label>
                <input
                    type="text"
                    id="closeDays"
                    name="closeDays"
                    value={form.closeDays}
                    onChange={handleChange}
                    placeholder="예: 매주 월요일, 공휴일"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="websiteUrl" className="block text-gray-700 text-sm font-bold mb-2">
                    웹사이트 URL
                </label>
                <input
                    type="url"
                    id="websiteUrl"
                    name="websiteUrl"
                    value={form.websiteUrl}
                    onChange={handleChange}
                    placeholder="매장 웹사이트 주소"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>


            <div className="mb-4">
                <label htmlFor="instagramUrl" className="block text-gray-700 text-sm font-bold mb-2">
                    인스타그램 URL
                </label>
                <input
                    type="url"
                    id="instagramUrl"
                    name="instagramUrl"
                    value={form.instagramUrl}
                    onChange={handleChange}
                    placeholder="매장 인스타그램 주소"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">
                    매장 상태
                </label>
                <select
                    id="status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="">상태 선택</option>
                    <option value="ACTIVE">영업 중</option>
                    <option value="INACTIVE">영업 종료</option>
                    <option value="CLOSED">오픈 준비 중</option>
                    {/* 필요에 따라 다른 상태 추가 */}
                </select>
            </div>

            {/* 썸네일 이미지 URL (파일 업로드 컴포넌트와 연동 필요) */}
            <div className="mb-4">
                <label htmlFor="thumbnailImageUrl" className="block text-gray-700 text-sm font-bold mb-2">
                    썸네일 이미지 URL (임시)
                </label>
                <input
                    type="text" // 실제로는 파일 업로드 컴포넌트 사용
                    id="thumbnailImageUrl"
                    name="thumbnailImageUrl"
                    value={form.thumbnailImageUrl}
                    onChange={handleChange}
                    placeholder="썸네일 이미지 URL을 입력하세요 (개발 중)"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <p className="text-sm text-gray-500 mt-1">
                    * 실제 서비스에서는 파일 업로드 UI가 필요합니다.
                </p>
            </div>

            {/*/!* 이미지 리스트 (별도 컴포넌트에서 관리 권장) *!/*/}
            {/*<div className="mb-6">*/}
            {/*    <label className="block text-gray-700 text-sm font-bold mb-2">*/}
            {/*        추가 이미지 (임시)*/}
            {/*    </label>*/}
            {/*    <div className="border border-dashed border-gray-300 p-4 rounded-md text-gray-500">*/}
            {/*        이미지 리스트를 관리하는 컴포넌트가 필요합니다.*/}
            {/*        (예: 이미지 추가, 삭제, 미리보기 등)*/}
            {/*    </div>*/}
            {/*</div>*/}


        </div>
    );
};

export default ShopInfoForm;