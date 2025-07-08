import React from 'react';
import { Heart } from 'lucide-react';
import { useQuery} from '@tanstack/react-query'; // useQuery, useQueryClient 임포트
import { useAuth } from '../../store/AuthContext';
import LikeButton from '../common/LikeButton'; // LikeButton 임포트
import { getShopLikeStatus } from '../../api/likeApi'; // getShopLikeStatus 임포트

/**
 * 매장 상세 페이지를 위한 찜하기/찜 해제 버튼 컴포넌트입니다.
 * 특정 매장 찜하기 스타일을 유지하면서 LikeButton의 로직을 사용합니다.
 * @param {object} props
 * @param {Long} props.shopId - 찜 상태를 토글할 매장의 ID
 */
const ShopLikeButton = ({ shopId }) => {
    const { user } = useAuth();


    // 이 매장의 찜 상태를 조회합니다.
    const queryKey = ['likeStatus', 'shop', shopId, user?.userId];
    const { data: isLiked} = useQuery({
        queryKey: queryKey,
        queryFn: async () => {
            if (!user || !user.userId || !shopId) {
                return false;
            }
            return await getShopLikeStatus(shopId);
        },
        enabled: !!user && !!user.userId && !!shopId,
        staleTime: Infinity,
        placeholderData: false,
    });

    // ⭐⭐⭐ 찜 상태(isLiked)에 따라 버튼의 모든 스타일 클래스를 동적으로 구성 ⭐⭐⭐
    const buttonClasses = `
        flex items-center text-lg font-medium px-4 py-2 rounded-lg 
        transition-colors duration-200 focus:outline-none 
        ${isLiked // 찜된 상태 (true)일 때의 스타일
        ? 'bg-red-100 text-red-500 border border-red-300 hover:bg-red-200 hover:text-red-600 focus:ring-red-300'
        // 찜 안된 상태 (false)일 때의 스타일 (기본 + hover)
        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-300'
    }
    `;

    return (
        <LikeButton
            type="shop"   // LikeButton에게 매장 타입임을 알림
            itemId={shopId} // LikeButton에게 매장 ID를 전달
            className={buttonClasses} // ⭐ 동적으로 구성된 className을 전달 ⭐
        >
            {/* children으로 Heart 아이콘과 "찜하기" 텍스트를 전달 */}
            {/* Heart 아이콘의 fill/stroke 속성은 LikeButton 내부에서 isLiked 상태에 따라 자동으로 처리됩니다. */}
            <Heart className="mr-2 w-6 h-6" /> 찜하기
        </LikeButton>
    );
};

export default ShopLikeButton;