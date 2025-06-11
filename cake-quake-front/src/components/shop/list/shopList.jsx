import React from 'react';
import ShopCard from './shopCard.jsx';
import{Link} from "react-router";


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
                    // ✨ ShopCard를 Link 컴포넌트로 감쌉니다.
                    <Link
                        to={`/shop/read/${shop.shopId}`} // 라우터 설정과 일치하도록 shop.shopId 사용
                        key={shop.shopId} // key는 Link에 붙여줍니다.
                        ref={index === shopList.length - 1 ? lastShopElementRef : null}
                        style={{
                            flex: '1 1 calc(33.333% - 40px/3)',
                            minWidth: '300px',
                            maxWidth: 'calc(33.333% - 40px/3)',
                            boxSizing: 'border-box',
                            textDecoration: 'none', // 링크 밑줄 제거
                            color: 'inherit', // 링크 색상 상속
                            // 여기에 카드 호버 효과 등 추가 스타일을 줄 수 있습니다.
                            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => { // 마우스 오버 시 효과
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={(e) => { // 마우스 나갈 시 효과
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        {/* ShopCard 컴포넌트를 Link 안에 렌더링합니다. */}
                        <ShopCard shop={shop} />
                    </Link>
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
