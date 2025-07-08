import React, {useCallback, useEffect, useRef, useState} from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, positionStyles = {}, modalRefProp }) => {
    if (!isOpen) return null;

    // ⭐ 외부에서 전달된 ref가 있다면 사용하고, 없다면 내부 ref 생성
    const internalModalRef = useRef(null);
    const modalRef = modalRefProp || internalModalRef;

    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [currentPosition, setCurrentPosition] = useState({ top: null, left: null, right: null, bottom: null });

    useEffect(() => {
        if (isOpen && modalRef.current) { // ⭐ modalRef.current가 존재하는지 확인
            const rect = modalRef.current.getBoundingClientRect();
            const initialTop = positionStyles.top ? parseFloat(positionStyles.top) : null;
            const initialLeft = positionStyles.left ? parseFloat(positionStyles.left) : null;
            const initialRight = positionStyles.right ? parseFloat(positionStyles.right) : null;
            const initialBottom = positionStyles.bottom ? parseFloat(positionStyles.bottom) : null;

            let finalTop = initialTop;
            let finalLeft = initialLeft;

            if (finalTop === null && initialBottom !== null) {
                finalTop = window.innerHeight - rect.height - initialBottom;
            }
            if (finalLeft === null && initialRight !== null) {
                finalLeft = window.innerWidth - rect.width - initialRight;
            }

            setCurrentPosition({
                top: finalTop !== null ? finalTop : (window.innerHeight - rect.height) / 2,
                left: finalLeft !== null ? finalLeft : (window.innerWidth - rect.width) / 2,
                right: null,
                bottom: null,
            });
        }
    }, [isOpen, positionStyles, modalRef]); // ⭐ modalRef를 의존성 배열에 추가


    const handleMouseDown = useCallback((e) => {
        if (modalRef.current) {
            const rect = modalRef.current.getBoundingClientRect();
            setIsDragging(true);
            setOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (!isDragging) return;

        const newLeft = e.clientX - offset.x;
        const newTop = e.clientY - offset.y;

        const clampedLeft = Math.max(0, Math.min(newLeft, window.innerWidth - (modalRef.current?.offsetWidth || 0)));
        const clampedTop = Math.max(0, Math.min(newTop, window.innerHeight - (modalRef.current?.offsetHeight || 0)));

        setCurrentPosition({ top: clampedTop, left: clampedLeft, right: null, bottom: null });
    }, [isDragging, offset]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    useEffect(() => {
        if (!isOpen) {
            setIsDragging(false);
            setOffset({ x: 0, y: 0 });
            setCurrentPosition({ top: null, left: null, right: null, bottom: null });
        }
    }, [isOpen]);

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none" style={{ background: 'transparent' }}>
            <div
                ref={modalRef}
                className="bg-white rounded-lg shadow-xl w-80 h-[500px] flex flex-col pointer-events-auto border border-gray-200" // ⭐ border 추가
                style={{
                    position: 'fixed',
                    top: currentPosition.top !== null ? `${currentPosition.top}px` : (positionStyles.top || '50%'),
                    left: currentPosition.left !== null ? `${currentPosition.left}px` : (positionStyles.left || '50%'),
                    cursor: isDragging ? 'grabbing' : 'grab',
                    zIndex: 10000
                }}
            >
                {/* ⭐ 모달 헤더 스타일 변경 */}
                <div
                    className="flex items-center justify-between p-4 border-b border-gray-200 cursor-grab bg-gray-50" // 헤더 배경색 추가
                    onMouseDown={handleMouseDown}
                >
                    <h2 className="text-lg font-semibold text-black">{title || "채팅"}</h2> {/* 제목 색상 파란색 */}
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-blue-500 focus:outline-none" // 닫기 버튼 호버 색상 파란색
                        aria-label="Close chat"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};


export default Modal;