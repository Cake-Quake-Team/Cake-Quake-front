import React, { useState } from 'react';
import {useNavigate, useParams} from "react-router";
import ReviewForm from "../../../components/review/reviewFrom.jsx";
import {creatReview} from "../../../api/reviewApi.jsx";


export default function ReviewCreatePage() {
    const { orderId } = useParams();
    const nav = useNavigate();
    const [values, setValues] = useState({ rating: 0, content: '', reviewPictureUrl: '' });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (field, value) => {
        setValues(v => ({ ...v, [field]: value }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            await creatReview(orderId,values);
            nav('/buyer/reviews');
        } finally {
            setSubmitting(false);
        }
    };

    return (

            <div className="max-w-lg mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">리뷰 작성</h1>
                <ReviewForm
                    values={values}
                    onChange={handleChange}
                    submitting={submitting}
                    onSubmit={handleSubmit}
                    submitLabel="작성하기"
                />
            </div>

    );
}