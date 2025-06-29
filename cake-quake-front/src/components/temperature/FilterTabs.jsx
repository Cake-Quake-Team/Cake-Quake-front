const tab=[
    {key :"all",label: "--" },
    {key :"REVIEW_WRITTEN",label: "리뷰 작성" },
    {key :"PICKUP_COMPLETED",label: "픽업 완료" },
    {key :"RESERVATION_CANCELLED",label: "예약 취소" },
    {key :"NO_SHOW",label: "노쇼" },
    {key :"ADMIN_ADJUSTMENT",label: "관리자" },

];

export default function FilterTabs({ filter, onChange }) {
    return (
        <div className="flex justify-center flex-wrap gap-3 p-2 bg-gray-50 rounded-lg shadow-sm">
            {tab.map(t => (
                <button
                    key={t.key}
                    onClick={() => onChange(t.key)}
                    className={`
                        px-4 py-2 rounded-full text-sm font-medium
                        transition-all duration-300 ease-in-out
                        ${
                        filter === t.key
                            ? "bg-indigo-600 text-white shadow-md transform scale-105"
                            : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                    }
                    `}
                >
                    {t.label}
                </button>
            ))}
        </div>
    );
}