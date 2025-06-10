import {useCallback, useEffect, useRef, useState} from "react";
import ShopFilterBar from "../../components/shop/shopFilterBar.jsx";
import ShopList from "../../components/shop/shopList.jsx";
import {getShopListInfinity} from "../../api/shopApi.jsx";

const MainPage = () => {
    //필터, 정렬, 키워드 상태 관리
    const [filter, setFilter] = useState('');
    const [sort, setSort] = useState('shopId');
    const [keyword, setKeyword] = useState('');
    const [debounceKeyword,setDebouceKeyword]=useState(keyword);

    //가게 목록 데이터 및 페이지네이션 관련 상태 관리
    const [shopList,setShopList]=useState([]); //현재까지 불러온 가게 목록
    const [page,setPage]=useState(1); //현재 페이지 번호
    const [loading,setLoading] = useState(false); //데이터가 로딩 중인지 여부
    const [hasMore,setHasMore] =useState(true); // 더 불러올 데이터 있는지 여부

    //무한 스크롤 위한 Intersection Observer 설정
    const observer=useRef();

    //ShopList의 마지막 요소에 연결될 콜백 함수
    const lastShopElementRef=useCallback(node=>{
        if(loading) return; //로딩 중일때 실행 X
        if(observer.current) observer.current.disconnect();

        observer.current=new IntersectionObserver(entries =>{
            if(entries[0].isintersecting&&hasMore){
                setPage(prevPage=>prevPage+1); //다음 페이지 로드
            }
        });

        if (node) observer.current.observe(node);

    },[loading,hasMore]); //loading 또는 hasMore가 변경될 때 콜백

    useEffect(()=>{
        const handler=setTimeout(()=>{
            setDebouceKeyword(keyword);
        },300);
        return ()=>{
            clearTimeout(handler);
        };
    },[keyword]); //키워드 바뀔 때마다 실행

    //필터,정렬,키워드 변경 시 데이터 초기화 및 페이지 리셋
    useEffect(()=>{
        setShopList([]);
        setPage(1);
        setHasMore(true);
    },[filter,sort,debounceKeyword]); // [] 안 값 변경시 실행

    //페이지 번호,키워드 변경 시 api 호출, 데이터 로딩
    useEffect(()=>{
        const fetchShops=async ()=>{
            setLoading(true); //로딩
            try{
                const response=await getShopListInfinity({page,keyword,size:8,filter,sort});

                if(response&&response.content){
                    setShopList(prevShops=>[...prevShops,...response.content]);
                    setHasMore(page<response.totalPages);
                }else{
                    setHasMore(false);
                }
            }catch (error) {
                console.error("가게 정보를 가져오는 데 실패했습니다",error);
                setHasMore(false) //오류 발생 시 로드 X
            } finally {
                setLoading(false); //로딩 종료
            }
        };
        if(hasMore){
            fetchShops();
        }
    },[page,filter,sort,debounceKeyword,hasMore]); //page,keyword,hasMore 변경 시 useEffect 실행


    return (
        <div style={{ padding: '24px' }}>
            <h2>가게 목록</h2>
            <ShopFilterBar
                filter={filter}
                setFilter={setFilter}
                sort={sort}
                setSort={setSort}
                keyword={keyword}
                setKeyword={setKeyword}
            />
            <ShopList shopList={shopList} lastShopElementRef={lastShopElementRef} loading={loading} hasMore={hasMore} />

            {loading && <p>가게를 더 불러오는 중...</p>}
            {!hasMore && !loading && shopList.length > 0 && <p>모든 가게를 불러왔습니다.</p>}
            {!loading && shopList.length === 0 && <p>검색 결과가 없습니다.</p>}

        </div>
    );
};

export default MainPage