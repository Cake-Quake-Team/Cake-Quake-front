// src/components/point/FilterTabs.jsx
import React from "react";
const tabs = [
    { key: "all",  label: "전체" },
    { key: "earn", label: "적립" },
    { key: "use",  label: "사용" },
];
export default function FilterTabs({ filter, onChange, onRecent10 }) {
    return (
        <div className="flex items-center justify-between text-sm">
            <div className="flex space-x-4">
                {tabs.map(t => (
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
            <button onClick={onRecent10} className="text-gray-500 hover:underline">
                최근 10건
            </button>
        </div>
    );
}
