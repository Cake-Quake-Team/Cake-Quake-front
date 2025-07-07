import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCakeLikeStatus, toggleCakeLike, getShopLikeStatus, toggleShopLike } from '../../api/likeApi';
import { useAuth } from '../../store/AuthContext';
import { Heart } from 'lucide-react';

const LikeButton = ({ type, itemId }) => {
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
        <div className="mt-6 flex justify-center gap-3 flex-shrink-0">
            <button
                onClick={handleToggleLike}
                disabled={isLoading}
                className={`w-10 h-10 flex-shrink-0 flex items-center justify-center p-2 rounded-full border transition-colors duration-200
               ${isLiked ? ' text-red-300' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}
               ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
            `}
                title={isLiked ? '찜 취소' : '찜하기'}
            >
                <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
        </div>
    );
};

export default LikeButton;