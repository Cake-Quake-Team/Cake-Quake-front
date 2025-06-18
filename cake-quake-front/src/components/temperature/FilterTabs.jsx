const tab=[
    {key :"all",label: "리뷰 작성" },
    {key :"REVIEW_WRITTEN",label: "리뷰 작성" },
    {key :"RESERVATION_CANCELLED",label: "예약 취소" },
    {key :"NO_SHOW",label: "노쇼" },
    {key :"ADMIN_ADJUSTMENT",label: "관리자" },

];

export default function FilterTabs({ filter, onChange }) {
    return (
        <div className="flex space-x-4 text-sm">
            {tab.map(t => (
                <button
                    key={t.key}
                    onClick={() => onChange(t.key)}
                    className={`pb-1 ${
                        filter === t.key
                            ? "border-b-2 border-indigo-600 text-indigo-600"
                            : "text-gray-500"
                    }`}
                >
                    {t.label}
                </button>
            ))}
        </div>
    );
}