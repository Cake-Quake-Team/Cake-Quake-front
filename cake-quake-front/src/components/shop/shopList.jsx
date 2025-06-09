import React from 'react';
import ShopCard from './ShopCard';


//무한스크롤 + 리스트 출력
const ShopList=({shopList,lastShopElementRef,loading,hasMore})=>{
    return(
        <div>
            {shopList.map((shop,index)=>(
                <div
                    key={shop.shopId}
                    ref={index===shopList.length-1?lastShopElementRef:null}
                >
                    <ShopCard shop={shop} />
                </div>
            ))}
            {loading &&<p style={{textAlign:'center'}}>가게를 불러오는 중...</p>}
            {!hasMore&&!loading&&shopList.length > 0 &&(
                <p style={{textAlign:'center'}}>더 이상 데이터가 없습니다.</p>
            )}
            {!loading&&shopList.length===0&&!hasMore&&(
                <p style={{textAlign:'center'}}>검색 결과가 없습니다.</p>
            )}
        </div>
    );
};

export default ShopList;
