import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import OptionAdd from '../../../components/cake/optionComponents/addOptionComponent';
import { addOptionType, addOptionItem, getOptionTypes } from '../../../api/cakeApi';

function OptionAddPage() {
    const { shopId } = useParams();
    const navigate = useNavigate();
    const [existingOptionTypes, setExistingOptionTypes] = useState([]);
    const [selectedOptionTypeId, setSelectedOptionTypeId] = useState('');
    const [selectedOptionType, setSelectedOptionType] = useState('');
    const [showNewOptionTypeInput, setShowNewOptionTypeInput] = useState(false);
    const [newOptionTypeName, setNewOptionTypeName] = useState('');
    const [optionItems, setOptionItems] = useState([{ name: '', price: '' }]);

    useEffect(() => {
        const fetchOptionTypes = async () => {
            try {
                const types = await getOptionTypes(shopId); // [{optionTypeId, optionType}]
                setExistingOptionTypes(types);
            } catch (error) {
                console.error('옵션 타입 목록 조회 실패:', error);
                alert('옵션 타입 목록을 불러오는 데 실패했습니다.');
            }
        };
        fetchOptionTypes();
    }, [shopId]);

    // 옵션 값 항목 추가 (비어있음)
    const handleAddOptionItem = () => {
        setOptionItems([...optionItems, { name: '', price: '' }]);
    };

    // 옵션 값 삭제
    const handleRemoveOptionItem = (index) => {
        const updatedItems = optionItems.filter((_, i) => i !== index);
        setOptionItems(updatedItems);
    };

    // 옵션 값 항목에 내용 추가
    const handleOptionItemChange = (index, field, value) => {
        const newItems = [...optionItems];
        newItems[index][field] = value;
        setOptionItems(newItems);
    };

    // 새 옵션 타입 등록
    const handleRegisterOptionType = async () => {
        if (!newOptionTypeName.trim()) {
            alert('옵션 타입 이름을 입력해주세요.');
            return;
        }
        try {
            const body = { optionType: newOptionTypeName };
            const result = await addOptionType(shopId, body); // { optionTypeId, optionType }
            alert('새 옵션 타입이 성공적으로 등록되었습니다.');
            setExistingOptionTypes(prev => [...prev, result]);
            setSelectedOptionType(result.optionType);
            setSelectedOptionTypeId(result.optionTypeId);
            setNewOptionTypeName('');
            setShowNewOptionTypeInput(false);
        } catch (error) {
            console.error('옵션 타입 등록 실패:', error);
            alert('옵션 타입 등록에 실패했습니다.');
        }
    };

    // 새 옵션 타입 등록 토글 핸들러
    const handleToggleNewOptionTypeInput = () => {
        setShowNewOptionTypeInput(prev => {
            if (prev) setNewOptionTypeName('');
            return !prev;
        });
    };

    // 새로운 옵션 타입 등록 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedOptionTypeId) {
            alert('옵션 타입을 선택하거나 새로 등록해주세요.');
            return;
        }

        if (optionItems.some(item => !item.name.trim() || !item.price.trim())) {
            alert('모든 옵션 값과 가격을 입력해주세요.');
            return;
        }

        try {
            for (const item of optionItems) {
                const body = {
                    optionTypeId: Number(selectedOptionTypeId),
                    optionName: item.name,
                    price: Number(item.price)
                };

                await addOptionItem(shopId, body);
                navigate(`/shops/${shopId}`);
            }

            alert('옵션이 성공적으로 등록되었습니다.');
            setOptionItems([{ name: '', price: '' }]);
            setSelectedOptionType('');
            setSelectedOptionTypeId(null);
            setNewOptionTypeName('');
            setShowNewOptionTypeInput(false);
        } catch (error) {
            console.error('옵션 등록 실패:', error);
            alert('옵션 등록에 실패했습니다.');
        }
    };

    // 취소 버튼 클릭 핸들러
    const handleToList = () => {
        navigate(`/shops/${shopId}`);
    };

    return (
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
    );
}

export default OptionAddPage;
