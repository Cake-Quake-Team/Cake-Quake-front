import React from 'react';

const DEFAULT_IMAGE = '/cakeImage/default-cake.png';

function CakeDetailComponent({ cake, optionTypes, selectedOptions, setSelectedOptions, OptionComponent }) {
    if (!cake || !cake.cakeDetailDTO) {
        return <div className="text-center py-8 text-gray-500">상품 정보가 없습니다.</div>;
    }

    const {
        cname,
        price,
        thumbnailImageUrl,
        description,
        imageUrls
    } = cake.cakeDetailDTO;

    const thumbnailImgSrc = thumbnailImageUrl ? thumbnailImageUrl : DEFAULT_IMAGE;
    const detailImgSrc = imageUrls.filter(imgObj => !imgObj.isThumbnail);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
                {/* 왼쪽: 상품 메인 이미지 영역 */}
                <div className="md:w-1/2 flex flex-col items-center justify-center flex-shrink-0">
                    <img
                        src={thumbnailImgSrc}
                        alt={cname || '상품 이미지'}
                        className="w-80 h-80 object-cover rounded-xl shadow-lg"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = DEFAULT_IMAGE;
                        }}
                    />
                </div>

                {/* 오른쪽: 상품 정보 및 옵션 영역 */}
                <div className="md:w-1/2 flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{cname}</h2>
                        <p className="text-2xl text-gray-900 mb-6">{price.toLocaleString()}원</p>

                        {OptionComponent && (
                            <OptionComponent
                                optionTypes={optionTypes}
                                selectedOptions={selectedOptions}
                                setSelectedOptions={setSelectedOptions}
                            />
                        )}
                    </div>
                </div>
            </div>
            <hr className="mt-15"/>

            {/* 추가 이미지 표시 영역 */}
            {detailImgSrc.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8 mt-15">
                    {detailImgSrc.map((imageObject, index) => (
                        <img
                            key={index}
                            src={imageObject.imageUrl}
                            alt={`${cname || '상품 이미지'} ${index + 1}`}
                            className="w-60 h-60 object-cover rounded-xl shadow-lg"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = DEFAULT_IMAGE;
                            }}
                        />
                    ))}
                </div>
            )}
            {imageUrls.length === 0 && thumbnailImageUrl && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8 mt-15">
                    <img
                        src={thumbnailImgSrc}
                        alt={cname || '상품 이미지'}
                        className="w-60 h-60 object-cover rounded-xl shadow-lg"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = DEFAULT_IMAGE;
                        }}
                    />
                </div>
            )}

            {/* 상품 설명 */}
            {description && (
                <div className="mb-6 text-gray-700 leading-relaxed mt-15 text-center">
                    <h3 className="text-xl font-semibold mb-2 mt-15">{cname}</h3>
                    <hr className="mt-6"/>
                    <p className="whitespace-pre-wrap mt-15">{description}</p>
                </div>
            )}
        </div>
    );
}

export default CakeDetailComponent;