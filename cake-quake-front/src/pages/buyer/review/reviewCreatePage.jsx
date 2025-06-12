import React, { useState} from 'react';
import { useNavigate, useParams} from "react-router";
import ReviewForm from "../../../components/review/reviewForm.jsx";
import {createReview} from "../../../api/reviewApi.jsx";


export default function ReviewCreatePage() {

    const { orderId } = useParams();
    //나중에 주문에서 얻어옴
   // const { state } = useLocation();
    const nav = useNavigate();
    const [values, setValues] = useState({ rating: 0, content: '', reviewPictureUrl: '' });
    const [submitting, setSubmitting] = useState(false);

    // 나중에 주문 파트 붙으면 state.cakeId 쓰기
    // 지금은 테스트용으로 직접 입력하거나 하드코딩
   // const [testCakeId, setTestCakeId] = useState(1);         // ← 원하는 값으로 바꿔보세요
    // 🎯 일단 하드코딩할 상품 정보, 포인트, 온도
    const cakeId    = 1;
    const product   = {
        imageUrl: 'https://via.placeholder.com/150',
        name:     '테스트 케이크',
        store:    '테스트 베이커리',
        date:     '2025-06-11 12:00'
    };
    const points       = 10;    // 테스트용 예상 적립 포인트
    const temperature  = 0.5;   // 테스트용 예상 온도



    const handleChange = (field, value) => {
        setValues(v => ({ ...v, [field]: value }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const fd = new FormData();
            fd.append('cakeId', cakeId);                // 하드코딩 cakeId
            fd.append('rating', values.rating);
            fd.append('content', values.content);
            if (values.reviewPictureUrl) {
                fd.append('reviewPictureUrl', values.reviewPictureUrl);
            }

            await createReview(orderId, fd);
            nav('/buyer/reviews');
        } catch (e) {
            console.error('리뷰 작성 실패', e);
            alert('리뷰 작성에 실패했습니다.');
        } finally {
            setSubmitting(false);
        }
    };




    return (
     <div className="min-h-screen bg-gray-50 py-10">
         {/* 제목 */}
         <h2 className="text-xl font-bold text-center relative mb-6">
             리뷰 쓰기
             <span  className="absolute bottom-0 left-1/2 w-[100px] h-0.5 bg-black -translate-x-1/2"></span>
         </h2>

         <ReviewForm
             product={product}
             points={points}
             temperature={temperature}
             values={values}
             onChange={handleChange}
             submitting={submitting}
             onSubmit={handleSubmit}
             submitLabel="작성하기"
         />
     </div>
    );
}