import React from 'react';

function ProductRankingCards({ topRankingProducts, lowestRankingProducts }) {
    return (
        <div style={rankingCardsContainerStyle}>
            <div style={rankingCardStyle}>
                <h2 style={rankingCardTitleStyle}>😊 인기 랭킹</h2>
                <ol style={rankingListStyle}>
                    {topRankingProducts && topRankingProducts.length > 0 ? (
                        topRankingProducts.map((product, index) => (
                            <li key={product.cakeId || `top-${index}`} style={rankingItemStyle}>
                                {index + 1}위 {product.cname}
                            </li>
                        ))
                    ) : (
                        <li style={rankingItemStyle}>데이터 없음</li>
                    )}
                </ol>
            </div>
            <div style={rankingCardStyle}>
                <h2 style={rankingCardTitleStyle}>😔 아쉬운 랭킹</h2>
                <ol style={rankingListStyle}>
                    {lowestRankingProducts && lowestRankingProducts.length > 0 ? (
                        lowestRankingProducts.map((product, index) => (
                            <li key={product.cakeId || `low-${index}`} style={rankingItemStyle}>
                                {index + 1}위 {product.cname}
                            </li>
                        ))
                    ) : (
                        <li style={rankingItemStyle}>데이터 없음</li>
                    )}
                </ol>
            </div>
        </div>
    );
}

export default ProductRankingCards;

// Styles for ProductRankingCards.js
const rankingCardsContainerStyle = {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
    flexWrap: 'wrap',
    justifyContent: 'center', // 가운데 정렬
};

const rankingCardStyle = {
    flex: '1 1 calc(50% - 10px)',
    minWidth: '300px',
    maxWidth: 'calc(50% - 10px)', // 최대 너비 제한 (두 개가 나란히)
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
    boxShadow: '0 1px 5px rgba(0,0,0,0.03)',
};

const rankingCardTitleStyle = {
    fontSize: '1.5em',
    marginBottom: '15px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
    textAlign: 'center',
    color: '#333',
};

const rankingListStyle = {
    listStyle: 'none',
    padding: 0,
};

const rankingItemStyle = {
    fontSize: '1.1em',
    padding: '8px 0',
    borderBottom: '1px dashed #f0f0f0',
    color: '#555',
};