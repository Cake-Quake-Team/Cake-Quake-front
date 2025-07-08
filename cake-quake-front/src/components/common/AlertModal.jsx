import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

function AlertModal({ message, type = "success", show }) {
    const baseStyle = "fixed top-10 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500";
    const visibility = show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none";

    const styleMap = {
        success: {
            bg: "bg-green-50",
            text: "text-green-800",
            border: "border-green-200",
            icon: <CheckCircle className="w-5 h-5 text-green-500" />,
        },
        error: {
            bg: "bg-red-50",
            text: "text-red-800",
            border: "border-red-200",
            icon: <AlertCircle className="w-5 h-5 text-red-500" />,
        },
    };

    const { bg, text, border, icon } = styleMap[type] || styleMap.success;

    return (
        <div className={`${baseStyle} ${visibility}`}>
            <div className={`flex items-center gap-2 px-5 py-3 rounded-xl border ${bg} ${text} ${border} shadow-md`}>
                {icon}
                <span className="text-sm font-medium">{message}</span>
            </div>
        </div>
    );
}

export default AlertModal;
