import React from 'react';
import ShopCard from './ShopCard';


//무한스크롤 + 리스트 출력
const ShopList=({shopList,lastShopElementRef,loading,hasMore})=>{
    return(
        <div>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap', // 공간이 부족하면 다음 줄로 넘어가도록 설정
                gap: '20px', // 카드 사이의 간격
                padding: '20px',
                justifyContent: 'flex-start'
            }}>
                {shopList.map((shop, index) => (
                    <div
                        key={shop.shopId}
                        ref={index === shopList.length - 1 ? lastShopElementRef : null}
                        style={{
                            flex: '1 1 calc(33.333% - 40px/3)',
                            minWidth: '300px',
                            maxWidth: 'calc(33.333% - 40px/3)',
                            boxSizing: 'border-box'
                        }}
                    >
                        <ShopCard shop={shop} />
                    </div>
                ))}
            </div>
            {loading && <p style={{ textAlign: 'center' }}>가게를 불러오는 중...</p>}
            {!hasMore && !loading && shopList.length > 0 && (
                <p style={{ textAlign: 'center' }}>더 이상 데이터가 없습니다.</p>
            )}
            {!loading && shopList.length === 0 && !hasMore && (
                <p style={{ textAlign: 'center' }}>검색 결과가 없습니다.</p>
            )}
        </div>
    );
};

export default ShopList;
