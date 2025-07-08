// src/components/createorderdetails/OrderItemsDisplay.jsx

import React from 'react';
import { getItemDetails } from '../../../../utils/itemDetailsUtils';

const OrderItemsDisplay = ({ orderItems }) => {
    return (
        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #cce5ff', borderRadius: '8px', backgroundColor: '#e6f7ff' }}>
            <h3 style={{ fontSize: '1.2em', fontWeight: 'bold', marginBottom: '10px', color: '#0056b3' }}>주문 상품 ({orderItems.length}개)</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {orderItems.map((item, index) => {
                    // getItemDetails에서 필요한 모든 상세 정보를 가져옵니다.
                    const { name, unitPrice, quantity, thumbnail, selectedOptions, totalOptionsPrice, itemSubTotalPrice } = getItemDetails(item);

                    return (
                        <li key={item.cartItemId || item.cakeId || index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '10px',
                            borderBottom: '1px dashed #cce5ff',
                            paddingBottom: '10px'
                        }}>
                            <img
                                src={thumbnail || '/default-cake.png'}
                                alt={name}
                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', marginRight: '10px' }}
                            />
                            <div style={{ flexGrow: 1 }}>
                                <p style={{ fontWeight: 'bold', margin: 0 }}>{name}</p>

                                {/* ⭐⭐ 옵션 정보 표시: selectedOptions 배열을 직접 순회하며 표시 ⭐⭐ */}
                                {selectedOptions && selectedOptions.length > 0 ? (
                                    <div style={{ fontSize: '0.85em', color: '#555', margin: '3px 0 0 10px', borderLeft: '2px solid #ccc', paddingLeft: '5px' }}>
                                        {selectedOptions.map((option, optIdx) => (
                                            <p key={optIdx} style={{ margin: '0px' }}>
                                                {/* optionGroup 필드는 OptionType의 typeName에서 왔다고 가정 */}
                                                {option.optionType && `${option.optionType}: `}
                                                {option.optionName}
                                                {option.count > 1 && ` (${option.count}개)`}
                                                {option.price > 0 && ` (+${option.price.toLocaleString()}원)`}
                                            </p>
                                        ))}
                                        {totalOptionsPrice > 0 && (
                                            <p style={{ margin: '0px', fontWeight: 'bold' }}>
                                                옵션 추가 금액: +{totalOptionsPrice.toLocaleString()}원
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <p style={{ fontSize: '0.85em', color: '#555', margin: '3px 0 0 0' }}>
                                        옵션: 선택된 옵션 없음
                                    </p>
                                )}

                                <p style={{ fontSize: '0.9em', color: '#777', margin: '3px 0 0 0' }}>
                                    단가: {unitPrice.toLocaleString()}원 / 수량: {quantity}개
                                </p>
                            </div>
                            <span style={{ fontWeight: 'bold', fontSize: '1em' }}>
                                {itemSubTotalPrice.toLocaleString()}원
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default OrderItemsDisplay;