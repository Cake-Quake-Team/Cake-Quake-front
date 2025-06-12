function CakeCategorySelector({ categories, selectedKeyword, onSelect }) {
    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(category => (
                <button
                    key={category.keyword}
                    type="button"
                    onClick={() => onSelect(category.keyword)}
                    className={`
                        px-4 py-1 text-sm font-medium transition-all duration-300 ease-in-out
                        ${selectedKeyword === category.keyword
                        ? "bg-gray-200 text-gray-700 rounded-2xl"
                        : "text-gray-500 hover:bg-gray-100 hover:rounded-2xl"}
                    `}
                >
                    {category.label}
                </button>
            ))}
        </div>
    );
}

export default CakeCategorySelector;
