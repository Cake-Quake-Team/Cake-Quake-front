import React, { useEffect, useState, useRef, useCallback } from 'react';
import ShopCard from './ShopCard';
import axios from 'axios';

//무한스크롤 + 리스트 출력
const ShopList = ({ filter, sort, keyword }) => {
    const [shops, setShops] = useState([]);
    const [page, setPage] = useState(0);
    const [hasNext, setHasNext] = useState(true);
    const observer = useRef();

    const lastElementRef = useCallback(node => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNext) {
                setPage(prev => prev + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [hasNext]);

    useEffect(() => {
        setShops([]);
        setPage(0);
    }, [filter, sort, keyword]);

    useEffect(() => {
        const fetchShops = async () => {
            const res = await axios.get('/api/shops', {
                params: {
                    page,
                    size: 10,
                    status: filter,
                    sort,
                    keyword,
                },
            });
            if (page === 0) {
                setShops(res.data.content);
            } else {
                setShops(prev => [...prev, ...res.data.content]);
            }
            setHasNext(res.data.hasNext);
        };
        fetchShops();
    }, [page, filter, sort, keyword]);

    return (
        <div>
            {shops.map((shop, index) => (
                <div key={shop.shopId} ref={index === shops.length - 1 ? lastElementRef : null}>
                    <ShopCard shop={shop} />
                </div>
            ))}
            {!hasNext && <p style={{ textAlign: 'center' }}>더 이상 데이터가 없습니다.</p>}
        </div>
    );
};

export default ShopList;
