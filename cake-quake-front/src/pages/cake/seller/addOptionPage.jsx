import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import OptionAdd from '../../../components/cake/optionComponents/addOptionComponent';
import { addOptionType, addOptionItem, getOptionTypes } from '../../../api/cakeApi';
import { useAuth } from "../../../store/AuthContext.jsx";
import AlertModal from "../../../components/common/AlertModal"; 

function OptionAddPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [existingOptionTypes, setExistingOptionTypes] = useState([]);
    const [selectedOptionTypeId, setSelectedOptionTypeId] = useState('');
    const [selectedOptionType, setSelectedOptionType] = useState('');
    const [showNewOptionTypeInput, setShowNewOptionTypeInput] = useState(false);
    const [newOptionTypeName, setNewOptionTypeName] = useState('');
    const [optionItems, setOptionItems] = useState([{ name: '', price: '' }]);

    const [formError, setFormError] = useState(null);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        const fetchOptionTypes = async () => {
            try {
                const types = await getOptionTypes(user.shopId);
                setExistingOptionTypes(types);
            } catch (error) {
                console.error('옵션 타입 목록 조회 실패:', error);
                setFormError({ message: '옵션 타입 목록을 불러오는 데 실패했습니다.', type: 'error' });
                setShowError(true);
            }
        };
        fetchOptionTypes();
    }, [user.shopId]);

    // 옵션 값 추가
    const handleAddOptionItem = () => {
        setOptionItems([...optionItems, { name: '', price: '' }]);
    };

    // 옵션 값 삭제
    const handleRemoveOptionItem = (index) => {
        setOptionItems(optionItems.filter((_, i) => i !== index));
    };

    // 옵션 값 변경
    const handleOptionItemChange = (index, field, value) => {
        const updated = [...optionItems];
        updated[index][field] = value;
        setOptionItems(updated);
    };

    // 새 옵션 타입 등록
    const handleRegisterOptionType = async () => {
        if (!newOptionTypeName.trim()) {
            setFormError({ message: '옵션 타입 이름을 입력해주세요.', type: 'error' });
            setShowError(true);
            return;
        }

        try {
            const body = { optionType: newOptionTypeName };
            const result = await addOptionType(user.shopId, body);
            setExistingOptionTypes(prev => [...prev, result]);
            setSelectedOptionType(result.optionType);
            setSelectedOptionTypeId(result.optionTypeId);
            setNewOptionTypeName('');
            setShowNewOptionTypeInput(false);

            setFormError({ message: '옵션 타입이 등록되었습니다.', type: 'success' });
            setShowError(true);
        } catch (error) {
            console.error('옵션 타입 등록 실패:', error);
            setFormError({ message: '옵션 타입 등록에 실패했습니다.', type: 'error' });
            setShowError(true);
        }
    };

    // 새 옵션 타입 입력 토글
    const handleToggleNewOptionTypeInput = () => {
        setShowNewOptionTypeInput(prev => {
            if (prev) setNewOptionTypeName('');
            return !prev;
        });
    };

    // 옵션 값 등록
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedOptionTypeId) {
            setFormError({ message: '옵션 타입을 선택하거나 새로 등록해주세요.', type: 'error' });
            setShowError(true);
            return;
        }

        if (optionItems.some(item => !item.name.trim() || !item.price.trim())) {
            setFormError({ message: '모든 옵션 값과 가격을 입력해주세요.', type: 'error' });
            setShowError(true);
            return;
        }

        try {
            for (const item of optionItems) {
                const body = {
                    optionTypeId: Number(selectedOptionTypeId),
                    optionName: item.name,
                    price: Number(item.price)
                };

                await addOptionItem(user.shopId, body);
            }

            setFormError({ message: '옵션이 성공적으로 등록되었습니다.', type: 'success' });
            setShowError(true);

            // 초기화
            setOptionItems([{ name: '', price: '' }]);
            setSelectedOptionType('');
            setSelectedOptionTypeId(null);
            setNewOptionTypeName('');
            setShowNewOptionTypeInput(false);


        } catch (error) {
            console.error('옵션 등록 실패:', error);
            setFormError({ message: '옵션 등록에 실패했습니다.', type: 'error' });
            setShowError(true);
        }
    };

    const handleToList = () => {
        navigate(`/shops/${user.shopId}`);
    };

    // Toast 자동 사라지게
    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => setShowError(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showError]);

    return (
        <>
            <OptionAdd
                optionItems={optionItems}
                selectedOptionType={selectedOptionType}
                selectedOptionTypeId={selectedOptionTypeId}
                existingOptionTypes={existingOptionTypes}
                newOptionTypeName={newOptionTypeName}
                showNewOptionTypeInput={showNewOptionTypeInput}
                handleSubmit={handleSubmit}
                handleOptionItemChange={handleOptionItemChange}
                handleAddOptionItem={handleAddOptionItem}
                handleRemoveOptionItem={handleRemoveOptionItem}
                handleRegisterOptionType={handleRegisterOptionType}
                setSelectedOptionType={setSelectedOptionType}
                setSelectedOptionTypeId={setSelectedOptionTypeId}
                setShowNewOptionTypeInput={setShowNewOptionTypeInput}
                setNewOptionTypeName={setNewOptionTypeName}
                handleToggleNewOptionTypeInput={handleToggleNewOptionTypeInput}
                handleToList={handleToList}
            />

            <AlertModal
                message={formError?.message}
                type={formError?.type}
                show={showError}
            />
        </>
    );
}

export default OptionAddPage;
