const ShopFilterBar = ({ filter, setFilter, sort, setSort, keyword, setKeyword }) => {
    return (
        <div style={{ marginBottom: '16px' }}>
            <input
                placeholder="가게 이름 검색"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                style={{ marginRight: '8px' }}
            />
            <select value={filter} onChange={e => setFilter(e.target.value)} style={{ marginRight: '8px' }}>
                <option value="">전체</option>
                <option value="ACTIVE">영업 중</option>
                <option value="INACTIVE">영업 종료</option>
                <option value="CLOSED">휴점</option>
            </select>
            <select value={sort} onChange={e => setSort(e.target.value)}>
                <option value="shopId">최신순</option>
                <option value="rating">평점순</option>
            </select>
        </div>
    );
};

export default ShopFilterBar;
