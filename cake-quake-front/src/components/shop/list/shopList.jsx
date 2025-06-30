import React, {useCallback, useEffect, useRef, useState} from 'react';
import ShopCard from './shopCard.jsx';
import{Link} from "react-router";
import {getShopListInfinity} from "../../../api/shopApi.jsx";


//무한스크롤 + 리스트 출력
const ShopList = ({ filter, sort, keyword }) => { // props로 filter, sort, keyword를 받음
    const [shopList, setShopList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0); // 페이지는 ShopList 내부에서 관리 (0부터 시작)

    // 이전 필터/정렬/키워드 값을 추적하여 변경될 때마다 shopList를 초기화하기 위함
    // 이 값들이 변경되면 새로운 검색을 시작해야 하므로 목록을 리셋
    const prevFilter = useRef(filter);
    const prevSort = useRef(sort);
    const prevKeyword = useRef(keyword);

    const lastShopElementRef = useRef();

    // 매장 데이터를 가져오는 함수
    const fetchShops = useCallback(async () => {
        // 이미 로딩 중이거나 더 이상 가져올 데이터가 없으면 함수 실행 중단
        if (loading || !hasMore) {
            console.log("로딩 중이거나 더 이상 데이터가 없습니다. 요청 스킵.");
            return;
        }

        setLoading(true); // 로딩 시작
        console.log(`[ShopList] 페이지 ${page} 데이터 가져오는 중...`);
        console.log(`[ShopList] 현재 필터: ${filter}, 정렬: ${sort}, 키워드: ${keyword}`);

        try {
            // API 호출 시 props로 받은 filter, sort, keyword 및 내부 page 상태 사용
            const responseData = await getShopListInfinity({ page, size: 8, keyword, filter, sort });
            console.log("[ShopList] API 응답 데이터:", responseData);

            const fetchedContent = responseData.content || [];
            const newHasNext = responseData.hasNext; // 백엔드 응답에서 hasNext 필드 사용

            // 받아온 데이터를 기존 목록에 추가합니다.
            // 데이터의 고유성을 보장하기 위해 필터링하는 로직을 추가합니다.
            setShopList(prevList => {
                const combinedList = [...prevList, ...fetchedContent];
                // shopId가 각 가게를 고유하게 식별한다고 가정하여 중복 제거
                const uniqueList = Array.from(new Map(combinedList.map(item => [item.shopId, item])).values());
                return uniqueList;
            });

            setHasMore(newHasNext); // hasMore 상태 업데이트
            setPage(prevPage => prevPage + 1); // 다음 페이지 번호 증가

        } catch (error) {
            console.error("가게 목록을 불러오는 데 실패했습니다:", error);
            setHasMore(false); // 오류 발생 시 더 이상 로드하지 않도록 설정
        } finally {
            setLoading(false); // 로딩 종료
        }
    }, [page, loading, hasMore, keyword, filter, sort]); // 의존성 배열에 filter, sort, keyword 추가

    // 필터/정렬/키워드가 변경되면 shopList를 초기화하고 첫 페이지부터 다시 로드
    useEffect(() => {
        // 현재 props의 값과 이전 useRef에 저장된 값을 비교
        if (prevFilter.current !== filter || prevSort.current !== sort || prevKeyword.current !== keyword) {
            console.log("필터/정렬/키워드 변경 감지. 매장 목록 초기화 및 재로드 시작.");
            setShopList([]);       // 매장 목록 초기화
            setPage(0);            // 페이지 초기화
            setHasMore(true);      // 더 불러올 데이터 있음으로 설정
            setLoading(false);     // 로딩 상태 초기화
            // fetchShops()를 직접 호출하지 않고, 아래의 useEffect가 처리하도록 유도
            // (page가 0으로 리셋되었으므로 아래 useEffect의 조건에 부합하여 첫 데이터 로드가 진행)
        }
        // 현재 props 값을 useRef에 저장하여 다음 렌더링 시 이전 값으로 사용
        prevFilter.current = filter;
        prevSort.current = sort;
        prevKeyword.current = keyword;
    }, [filter, sort, keyword]); // filter, sort, keyword props가 변경될 때마다 실행

    // Intersection Observer 설정 (컴포넌트 마운트 및 ref 변경 시)
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            // 마지막 요소가 뷰포트에 들어왔고, 더 불러올 데이터가 있으며, 현재 로딩 중이 아닐 때
            if (entries[0].isIntersecting && hasMore && !loading) {
                console.log("[ShopList] 마지막 요소 감지. fetchShops 호출.");
                fetchShops(); // 데이터 가져오기 함수 호출
            }
        }, {
            threshold: 0.5 // 대상 요소가 뷰포트에 50% 이상 보일 때 콜백 실행
        });

        // Ref가 현재 요소를 가리키고 있다면 Observer를 시작
        if (lastShopElementRef.current) {
            observer.observe(lastShopElementRef.current);
        }

        // 컴포넌트 언마운트 시 Observer 해제 (메모리 누수 방지)
        return () => {
            if (lastShopElementRef.current) {
                observer.unobserve(lastShopElementRef.current);
            }
        };
    }, [loading, hasMore, fetchShops]); // 의존성 배열에 fetchShops 추가

    // 컴포넌트가 처음 마운트되거나 필터/정렬/키워드가 변경되어 page가 0으로 리셋될 때 초기 데이터 로드
    useEffect(() => {
        // shopList가 비어있고, 로딩 중이 아니며, 더 가져올 데이터가 남아있고, 페이지가 0일 때 (새로운 검색의 시작)
        if (shopList.length === 0 && !loading && hasMore && page === 0) {
            console.log("[ShopList] 초기 데이터 또는 새로운 검색 데이터 로드 시작.");
            fetchShops();
        }
    }, [shopList.length, loading, hasMore, page, fetchShops]); // shopList.length, page도 의존성에 추가

    return (
        <div>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                padding: '20px',
                justifyContent: 'flex-start'
            }}>
                {/* shopList가 항상 배열임을 보장하므로 map 사용 */}
                {shopList.map((shop, index) => (
                    <Link
                        to={`/buyer/shops/${shop.shopId}`} // `/shops/read/` 경로가 올바른지 다시 확인하세요.
                        key={shop.shopId} // React 리스트 렌더링을 위한 고유 key
                        // 목록의 마지막 요소에만 ref 할당하여 Intersection Observer가 감지하도록 함
                        ref={index === shopList.length - 1 ? lastShopElementRef : null}
                        style={{
                            flex: '1 1 calc(33.333% - 40px/3)',
                            minWidth: '300px',
                            maxWidth: 'calc(33.333% - 40px/3)',
                            boxSizing: 'border-box',
                            textDecoration: 'none',
                            color: 'inherit',
                            transition: 'transform 0.2s ease-in-out,0.2s ease-in-out',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <ShopCard shop={shop} />
                    </Link>
                ))}
            </div>

            {/* 로딩 중 메시지 */}
            {loading && <p style={{ textAlign: 'center', padding: '20px' }}>가게를 불러오는 중...</p>}

            {/* 더 이상 데이터가 없을 때 메시지 (로딩 중이 아니고, 데이터가 하나라도 있을 때) */}
            {!hasMore && !loading && shopList.length > 0 && (
                <p style={{ textAlign: 'center', padding: '20px' }}>더 이상 데이터가 없습니다.</p>
            )}

            {/* 검색 결과가 없을 때 메시지 (로딩 중이 아니고, 데이터가 없고, 더 가져올 데이터도 없을 때) */}
            {!loading && shopList.length === 0 && !hasMore && (
                <p style={{ textAlign: 'center', padding: '20px' }}>검색 결과가 없습니다.</p>
            )}
        </div>
    );
};

export default ShopList;
