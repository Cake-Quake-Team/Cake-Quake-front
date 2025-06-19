import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
    deleteOptionType,
    getOptionItems,
    getOptionTypeDetail,
    updateOptionType,
    updateOptionItem,
    addOptionItem,
    deleteOptionItem
} from '../../../api/cakeApi';

import OptionDetail from '../../../components/cake/optionComponents/optionDetailComponent';

function OptionReadPage() {
    const { shopId, optionId } = useParams();
    const navigate = useNavigate();
    const [optionData, setOptionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false); // ★ 수정 모드 상태 추가

    // 데이터를 다시 불러오는 공통 함수 (초기 로딩 및 수정 후 리프레시에 사용)
    const fetchOptionDetail = async () => {
        try {
            setLoading(true);
            const numericShopId = Number(shopId); // shopId, optionId는 URL 파라미터이므로 숫자로 변환
            const numericOptionId = Number(optionId);

            const fetchedOptionType = await getOptionTypeDetail(numericShopId, numericOptionId); // 단일 객체
            const fetchedOptionItems = await getOptionItems(numericShopId); // 전체 옵션 값

            // 이 옵션 타입에 해당하는 옵션 값만 필터링
            const relevantItems = fetchedOptionItems.filter(
                item => item.optionTypeId === fetchedOptionType.optionTypeId
            );

            // 옵션 값 포함시켜서 저장
            setOptionData({
                ...fetchedOptionType,
                optionItems: relevantItems
            });
        } catch (err) {
            setError("옵션 정보를 불러오는데 실패했습니다.");
            console.error("Failed to fetch option detail:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!shopId || !optionId) {
            setError("매장 ID 또는 옵션 ID가 없습니다.");
            setLoading(false);
            return;
        }
        fetchOptionDetail(); // 컴포넌트 마운트 시 데이터 로딩
    }, [shopId, optionId]); // shopId, optionId 변경 시 다시 로딩

    // '취소' or '삭제' 버튼 클릭 핸들러
    const handleDelete = async () => {
        if (isEditMode) {
            setIsEditMode(false);   // 상세조회 모드로 전환
        } else {
            if (window.confirm("정말로 이 옵션을 삭제하시겠습니까?")) {
                try {
                    await deleteOptionType(Number(shopId), Number(optionId));
                    alert("옵션이 삭제되었습니다.");
                    navigate(`/shops/${shopId}/options`); // 삭제 후 옵션 목록 페이지로 이동
                } catch (err) {
                    console.error("옵션 삭제 실패:", err);
                    alert("옵션 삭제에 실패했습니다.");
                }
            }
        }
    };

    // '수정' 또는 '저장' 버튼 클릭 핸들러 (이전의 handleEditClick을 확장)
    // OptionDetail 컴포넌트에서 변경된 데이터(optionTypeData)를 인자로 받습니다.
    const handleEditSaveClick = async (updatedDataFromChild) => {
        if (isEditMode) {
            // ★ 현재 수정 모드이므로 '저장' 버튼 클릭 시
            try {
                // 1. 옵션 타입 자체 (isRequired, minSelect, maxSelect) 업데이트
                const updateTypePayload = {
                    optionType: updatedDataFromChild.optionType,
                    isUsed: updatedDataFromChild.isUsed,
                    isRequired: updatedDataFromChild.isRequired,
                    minSelection: updatedDataFromChild.minSelection!== undefined ? updatedDataFromChild.minSelection : 0,
                    maxSelection: updatedDataFromChild.maxSelection !== undefined ? updatedDataFromChild.maxSelection : 1
                };
                await updateOptionType(Number(shopId), Number(optionId), updateTypePayload);

                // 2. 옵션 항목들 (optionItems) 업데이트 로직
                const currentOptionItems = optionData?.optionItems || []; // 기존 데이터 안전하게 가져오기
                const existingItemIds = new Set(currentOptionItems.map(item => String(item.optionItemId)));

                for (const item of updatedDataFromChild.optionItems) {
                    if (item.optionItemId && String(item.optionItemId).startsWith('new_')) {
                        // 새로 추가된 항목 (임시 ID가 'new_'로 시작하는 경우)
                        await addOptionItem(Number(shopId), {
                            optionTypeId: Number(optionId),
                            optionName: item.optionName,
                            price: item.price
                        });
                    } else if (item.optionItemId && existingItemIds.has(String(item.optionItemId))) {
                        // 기존 항목 (수정)
                        await updateOptionItem(Number(shopId), Number(item.optionItemId), {
                            optionName: item.optionName,
                            price: item.price
                        });
                        existingItemIds.delete(String(item.optionItemId)); // 처리된 항목은 Set에서 제거
                    }
                }

                // existingItemIds에 남아있는 항목들은 삭제된 항목들
                for (const idToDelete of existingItemIds) {
                    if (!String(idToDelete).startsWith('new_')) { // 임시 ID가 아닌 실제 ID만 삭제
                        await deleteOptionItem(Number(shopId), Number(idToDelete));
                    }
                }

                alert('옵션이 성공적으로 수정되었습니다.');
                await fetchOptionDetail(); // 수정 완료 후 최신 데이터 다시 불러오기
                setIsEditMode(false); // 저장 후 조회 모드로 전환
            } catch (err) {
                let errorMessage = '옵션 수정에 실패했습니다.'; // 기본 에러 메시지

                // Axios 에러인 경우 (error.response.data에 서버 응답이 있을 수 있음)
                if (err.response && err.response.data && err.response.data.message) {
                    errorMessage = err.response.data.message;
                } else if (err.message) {
                    // 일반적인 JavaScript Error 객체의 메시지
                    errorMessage = err.message;
                }

                alert(errorMessage);
            }
        } else {
            // ★ 현재 조회 모드이므로 '수정' 버튼 클릭 시
            setIsEditMode(true); // 수정 모드로 전환
        }
    };

    if (loading) {
        return <div className="text-center py-8">옵션 상세 정보를 불러오는 중...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">{error}</div>;
    }

    if (!optionData) {
        return <div className="text-center py-8 text-gray-500">옵션 정보를 찾을 수 없습니다.</div>;
    }

    return (
        <OptionDetail
            initialOptionTypeData={optionData} // optionData를 initialOptionTypeData prop으로 전달
            onDeleteClick={handleDelete}
            onEditClick={handleEditSaveClick} // ★ 수정/저장 핸들러 연결
            isEditMode={isEditMode} // ★ 현재 모드 상태 전달
        />
    );
}

export default OptionReadPage;