function CakeOptionForm({ optionTypes = [], selectedOptions, setSelectedOptions }) {
    const toggleOptionValue = (optionTypeId, optionItemId) => {
        setSelectedOptions(prev => {
            const currentValues = prev[optionTypeId] || [];
            let newValues;
            if (currentValues.includes(optionItemId)) {
                newValues = currentValues.filter(id => id !== optionItemId);
            } else {
                newValues = [...currentValues, optionItemId];
            }
            return { ...prev, [optionTypeId]: newValues };
        });
    };

    return (
        <div className="my-6">
            <h2>옵션 선택</h2>

            {optionTypes.length === 0 && (
                <p className="text-gray-500">옵션 정보가 없습니다. 🥲</p>
            )}

            {optionTypes.map((type) => (
                <div key={type.optionTypeId} className="mb-4">
                    <h3 className="font-medium mb-2">{type.name}</h3>

                    {Array.isArray(type.optionValues) && type.optionValues.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {type.optionValues.map((value) => (
                                <label
                                    key={`${type.optionTypeId}_${value.optionValueId}`}
                                    className="inline-flex items-center space-x-2 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={
                                            selectedOptions[type.optionTypeId]?.includes(value.optionValueId) || false
                                        }
                                        onChange={() =>
                                            toggleOptionValue(type.optionTypeId, value.optionValueId)
                                        }
                                    />
                                    <span>{value.name} ({value.price.toLocaleString()}원)</span>
                                </label>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400">선택 가능한 옵션이 없습니다.</p>
                    )}
                </div>
            ))}
        </div>
    );
}

export default CakeOptionForm;