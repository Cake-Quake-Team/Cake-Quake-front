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
import { useAuth } from "../../../store/AuthContext.jsx";
import AlertModal from "../../../components/common/AlertModal";

function OptionReadPage() {
    const { user } = useAuth();
    const { optionId } = useParams();
    const navigate = useNavigate();
    const [optionData, setOptionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false); // 수정 모드 상태
    const [formError, setFormError] = useState(null);
    const [showError, setShowError] = useState(false);

    // 데이터를 다시 불러오는 공통 함수
    const fetchOptionDetail = async () => {
        try {
            setLoading(true);
            const numericShopId = Number(user.shopId);
            const numericOptionId = Number(optionId);

            const fetchedOptionType = await getOptionTypeDetail(numericShopId, numericOptionId);
            const fetchedOptionItems = await getOptionItems(numericShopId);

            const relevantItems = fetchedOptionItems.filter(
                item => item.optionTypeId === fetchedOptionType.optionTypeId
            );

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
        if (!user.shopId || !optionId) {
            setError("매장 ID 또는 옵션 ID가 없습니다.");
            setLoading(false);
            return;
        }
        fetchOptionDetail();
    }, [user.shopId, optionId]);

    const handleDelete = async () => {
        if (isEditMode) {
            setIsEditMode(false);
        } else {
            if (window.confirm("정말로 이 옵션을 삭제하시겠습니까?")) {
                try {
                    await deleteOptionType(Number(user.shopId), Number(optionId));
                    setFormError({message: "옵션이 삭제되었습니다.", type: 'success' });
                    setShowError(true);
                    navigate(`/shops/${user.shopId}`);
                } catch (err) {
                    console.error("옵션 삭제 실패:", err);
                    setFormError({message: "옵션 삭제에 실패했습니다.", type: 'error' });
                    setShowError(true);
                }
            }
        }
    };

    const handleEditSaveClick = async (updatedDataFromChild) => {
        if (isEditMode) {
            try {
                const updateTypePayload = {
                    optionType: updatedDataFromChild.optionType,
                    isUsed: updatedDataFromChild.isUsed,
                    isRequired: updatedDataFromChild.isRequired,
                    minSelection: updatedDataFromChild.minSelection !== undefined ? updatedDataFromChild.minSelection : 0,
                    maxSelection: updatedDataFromChild.maxSelection !== undefined ? updatedDataFromChild.maxSelection : 1
                };
                await updateOptionType(Number(user.shopId), Number(optionId), updateTypePayload);

                const currentOptionItems = optionData?.optionItems || [];
                const existingItemIds = new Set(currentOptionItems.map(item => String(item.optionItemId)));

                for (const item of updatedDataFromChild.optionItems) {
                    if (item.optionItemId && String(item.optionItemId).startsWith('new_')) {
                        await addOptionItem(Number(user.shopId), {
                            optionTypeId: Number(optionId),
                            optionName: item.optionName,
                            price: item.price
                        });
                    } else if (item.optionItemId && existingItemIds.has(String(item.optionItemId))) {
                        await updateOptionItem(Number(user.shopId), Number(item.optionItemId), {
                            optionName: item.optionName,
                            price: item.price
                        });
                        existingItemIds.delete(String(item.optionItemId));
                    }
                }

                for (const idToDelete of existingItemIds) {
                    if (!String(idToDelete).startsWith('new_')) {
                        await deleteOptionItem(Number(user.shopId), Number(idToDelete));
                    }
                }

                setFormError({message: '옵션이 성공적으로 수정되었습니다.', type: 'success' });
                setShowError(true);
                await fetchOptionDetail();
                setIsEditMode(false);
            } catch (err) {
                let errorMessage = '옵션 수정에 실패했습니다.';
                if (err.response && err.response.data && err.response.data.message) {
                    errorMessage = err.response.data.message;
                } else if (err.message) {
                    errorMessage = err.message;
                }
                setFormError({message: errorMessage, type: 'error' });
                setShowError(true);
            }
        } else {
            setIsEditMode(true);
        }
    };

    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => setShowError(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showError]);

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
        <>
            <OptionDetail
                initialOptionTypeData={optionData}
                onDeleteClick={handleDelete}
                onEditClick={handleEditSaveClick}
                isEditMode={isEditMode}
            />

            <AlertModal
                message={formError?.message || formError}
                type={formError?.type || (formError ? 'success' : undefined)}
                show={showError}
                onClose={() => setShowError(false)}
            />
        </>
    );
}

export default OptionReadPage;
