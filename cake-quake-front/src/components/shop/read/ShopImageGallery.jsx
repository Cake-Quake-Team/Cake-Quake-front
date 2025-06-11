import {useEffect, useState} from "react";

const ShopImageGallery=({images})=>{
    const [mainImage,setMainImage]=useState(null);

    useEffect(()=>{
        if(images&&images.length>0){
            const thumbnail=images.find(img=>img.isThumbnail);
            setMainImage(thumbnail?thumbnail.shopImageUrl:images[0].shopImageUrl);
        }else{
            setMainImage(null);
        }
    },[images]);

    if(!images||images.length===0){
        return <div className="text-center text-gray-500 py-10 text-lg">등록된 이미지가 없습니다.</div>;
    }
    return(
        <div className="mb-5">
            {mainImage && (
                <div className="w-full max-h-[450px] md:max-h-[500px] overflow-hidden mb-4 rounded-lg shadow-md bg-gray-200 flex items-center justify-center">
                    <img
                        src={mainImage}
                        alt="Main Shop View"
                        className="w-full h-full object-contain md:object-cover"
                    />
                </div>
            )}
            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {images.map((img, index) => (
                    <img
                        key={img.shopImageId || index}
                        src={img.shopImageUrl}
                        alt={`Shop Thumbnail ${index + 1}`}
                        onClick={() => setMainImage(img.shopImageUrl)}
                        className={`w-24 h-24 md:w-28 md:h-28 flex-shrink-0 object-cover rounded-lg cursor-pointer transition-all duration-200 ease-in-out
                            ${mainImage === img.shopImageUrl ? 'border-4 border-blue-500 scale-105 shadow-lg' : 'border border-gray-300 hover:border-gray-400'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ShopImageGallery;