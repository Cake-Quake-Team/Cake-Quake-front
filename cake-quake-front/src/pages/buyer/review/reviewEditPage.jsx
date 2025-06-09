import {useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import BasicLayout from "../../../layouts/basicLayout.jsx";
import ReviewForm from "../../../components/review/reviewFrom.jsx";
import {getMyReviewDetail, updateMyReview} from "../../../api/reviewApi.jsx";


export default function ReviewEditPage() {
    const { reviewId } = useParams();
    const nav = useNavigate();
    const [values, setValues] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        getMyReviewDetail(reviewId).then(data => {
            setValues({
                rating: data.rating,
                content: data.content,
                reviewPictureUrl: data.reviewPictureUrl || ''
            });
        });
    }, [reviewId]);

    const handleChange = (field, value) => {
        setValues(v => ({ ...v, [field]: value }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            await updateMyReview(reviewId, values);
            nav('/buyer/reviews');
        } finally {
            setSubmitting(false);
        }
    };

    if (!values) return <BasicLayout><div className="text-center py-20">로딩 중…</div></BasicLayout>;

    return (
            <div className="max-w-lg mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">리뷰 수정</h1>
                <ReviewForm
                    values={values}
                    onChange={handleChange}
                    submitting={submitting}
                    onSubmit={handleSubmit}
                    submitLabel="수정하기"
                />
            </div>
    );
}