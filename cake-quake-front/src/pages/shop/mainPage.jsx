import {useState} from "react";
import ShopFilterBar from "../../components/shop/shopFilterBar.jsx";
import ShopList from "../../components/shop/shopList.jsx";

const MainPage = () => {
    const [filter, setFilter] = useState('');
    const [sort, setSort] = useState('shopId');
    const [keyword, setKeyword] = useState('');

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
            <ShopList filter={filter} sort={sort} keyword={keyword} />
        </div>
    );
};

export default MainPage