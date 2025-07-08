// src/components/common/LikeButton.jsx (수정된 내용)
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCakeLikeStatus, toggleCakeLike, getShopLikeStatus, toggleShopLike } from '../../api/likeApi';
import { useAuth } from '../../store/AuthContext';
import { Heart } from 'lucide-react';

const LikeButton = ({ type, itemId, children, className, style }) => { // children, className, style prop은 그대로
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const queryKey = ['likeStatus', type, itemId, user?.userId];
    const { data: isLiked, isLoading: isFetchingStatus} = useQuery({
        queryKey: queryKey,
        queryFn: async () => {
            if (!user || !user.userId || !itemId) {
                return false;
            }
            if (type === 'cake') {
                return await getCakeLikeStatus(itemId);
            } else if (type === 'shop') {
                return await getShopLikeStatus(itemId);
            }
            return false;
        },
        enabled: !!user && !!user.userId && !!itemId,
        staleTime: Infinity,
        placeholderData: false,
    });

    const toggleLikeMutation = useMutation({
        mutationFn: async () => {
            if (type === 'cake') {
                return await toggleCakeLike(itemId);
            } else if (type === 'shop') {
                return await toggleShopLike(itemId);
            }
            throw new Error('Invalid like type');
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: queryKey });
            const previousIsLiked = queryClient.getQueryData(queryKey);
            queryClient.setQueryData(queryKey, (oldIsLiked) => !oldIsLiked);
            return { previousIsLiked };
        },
        onError: (err, newVar, context) => {
            console.error(`찜 토글 실패 (${type} ${itemId}):`, err);
            if (context?.previousIsLiked !== undefined) {
                queryClient.setQueryData(queryKey, context.previousIsLiked);
            }
            alert(`찜 토글 실패: ${err.response?.data?.message || '알 수 없는 오류가 발생했습니다.'}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKey });
        },
    });

    const handleToggleLike = async (e) => {
        e.stopPropagation();

        if (!user || !user.userId) {
            alert("로그인이 필요합니다.");
            return;
        }

        if (toggleLikeMutation.isPending) {
            return;
        }

        toggleLikeMutation.mutate();
    };

    const isLoading = isFetchingStatus || toggleLikeMutation.isPending;

    return (
        // ⭐⭐ 버튼에서 모든 내장 스타일 클래스 (className={`...`})를 제거합니다. ⭐⭐
        // `className`과 `style` prop만 그대로 받아서 적용합니다.
        <button
            onClick={handleToggleLike}
            disabled={isLoading}
            className={`${className || ''} ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`} // 외부 className만 적용
            style={style} // 외부 style 적용
            title={isLiked ? '찜 취소' : '찜하기'}
        >
            {/* children이 있으면 children을 렌더링, 없으면 기본 하트 아이콘만 렌더링 (텍스트는 외부에서 처리) */}
            {children ? (
                React.Children.map(children, child =>
                    child.type === Heart
                        ? React.cloneElement(child, { fill: isLiked ? 'currentColor' : 'none' })
                        : child
                )
            ) : (
                // children이 제공되지 않을 경우를 위한 기본 아이콘만.
                // 텍스트("찜하기")도 외부에서 전달하는 것이 일관적입니다.
                <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
            )}
        </button>
    );
};

export default LikeButton;