import ShopList from "../../components/shop/list/shopList.jsx";

const ShopListPage=({shopList, lastShopElementRef,loading, hasMore})=>{
    return(
    <ShopList
    shopList={shopList}
    lastShopElementRef={lastShopElementRef}
    loading={loading}
    hasMore={hasMore}
/>
    );
};

export default ShopListPage;

