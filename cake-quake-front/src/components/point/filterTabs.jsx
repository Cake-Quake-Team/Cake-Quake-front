import React from "react";

const tabs = [
    { key: "all",  label: "전체" },
    { key: "earn", label: "적립" },
    { key: "use",  label: "사용" },
];

export default function FilterTabs({ filter, onChange, onRecent10 }) {
    return (
        <div className="flex items-center justify-between mt-6">
            <div className="flex space-x-1 bg-white rounded-full shadow px-2 py-1">
                {tabs.map(t => (
                    <button
                        key={t.key}
                        onClick={() => onChange(t.key)}
                        className={`
              px-4 py-1 text-sm font-medium rounded-full transition
              ${filter === t.key
                            ? "bg-indigo-600 text-white shadow-inner"
                            : "text-gray-600 hover:bg-gray-100"}
            `}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
            <button
                onClick={onRecent10}
                className="text-sm text-indigo-600 border border-indigo-600 rounded-full px-3 py-1 hover:bg-indigo-50 transition"
            >
                최근 10건
            </button>
        </div>
    );
}
