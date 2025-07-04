// src/components/common/LikeButton.jsx
import React, { useState, useEffect, useRef } from 'react'; // useRef 추가
import { toggleCakeLike, getCakeLikeStatus, toggleShopLike, getShopLikeStatus } from '../../api/likeApi';
import { useAuth } from '../../store/AuthContext';
import { Heart } from 'lucide-react';

const LikeButton = ({ type, itemId }) => {
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    //const [likeCount, setLikeCount] = useState(0);
    const isOptimisticallyUpdated = useRef(false); // useRef를 사용하여 렌더링에 영향을 주지 않는 값 저장


    // 컴포넌트 마운트 시 또는 user/itemId/type 변경 시 찜 상태 조회
    useEffect(() => {
        const fetchLikeStatus = async () => {
            // ⭐ 1. 낙관적 업데이트가 진행 중이거나 방금 완료된 경우에는 서버 조회를 건너뜁니다. ⭐
            if (isOptimisticallyUpdated.current) {
                isOptimisticallyUpdated.current = false; // 한 번 건너뛰었으면 플래그 초기화
                return;
            }

            if (!user || !user.userId || !itemId) {
                setIsLiked(false);
                return;
            }
            setIsLoading(true); // 로딩 시작
            try {
                let status;
                if (type === 'cake') {
                    status = await getCakeLikeStatus(itemId);
                } else if (type === 'shop') {
                    status = await getShopLikeStatus(itemId);
                }
                setIsLiked(status); // 실제 서버로부터의 찜 상태로 업데이트
            } catch (error) {
                console.error(`찜 상태 조회 실패 (${type} ${itemId}):`, error);
                setIsLiked(false);
            } finally {
                setIsLoading(false); // 로딩 종료
            }
        };
        fetchLikeStatus();
    }, [user, itemId, type]); // user, itemId, type이 변경될 때마다 실행

    const handleToggleLike = async () => {
        if (!user || !user.userId) {
            alert("로그인이 필요합니다.");
            return;
        }
        if (isLoading) return;

        // ⭐ 2. 낙관적 업데이트 시 플래그 설정 ⭐
        isOptimisticallyUpdated.current = true; // 낙관적 업데이트가 시작됨을 표시

        const prevIsLiked = isLiked; // 이전 상태 백업
        setIsLiked(!prevIsLiked);   // UI 즉시 업데이트 (낙관적)
        setIsLoading(true);         // 로딩 상태 시작

        try {
            let response;
            if (type === 'cake') {
                response = await toggleCakeLike(itemId);
            } else if (type === 'shop') {
                response = await toggleShopLike(itemId);
            }

            // ⭐ 3. 서버 응답으로 최종 상태 확정 (낙관적 업데이트와 다를 경우만 동기화) ⭐
            if (response.isLiked !== !prevIsLiked) {
                setIsLiked(response.isLiked); // 서버와 불일치 시 서버 상태로 재설정
            }
        } catch (error) {
            console.error(`찜 토글 실패 (${type} ${itemId}):`, error);
            alert(`찜 토글 실패: ${error.response?.data?.message || '알 수 없는 오류'}`);
            setIsLiked(prevIsLiked); // ⭐ 4. API 호출 실패 시 이전 상태로 되돌리기 ⭐
        } finally {
            setIsLoading(false); // 로딩 상태 종료
        }
    };

    return (
        <button
            onClick={handleToggleLike}
            disabled={isLoading}
            className={`
                flex items-center text-lg font-medium px-4 py-2 rounded-lg
                bg-gray-50 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50
                transition-colors duration-200
                ${isLiked ? 'text-red-500' : 'text-gray-700'}
                ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
            `}
            title={isLiked ? "찜 취소" : "찜하기"}
        >
            <Heart
                className={`mr-2 w-6 h-6 ${isLiked ? 'fill-current' : ''}`}
            />
            {isLoading ? '' : ''}
            {/*<span className="text-sm">{likeCount > 0 ? `(${likeCount})` : '(0)'}</span>*/}
        </button>
    );
};

export default LikeButton;