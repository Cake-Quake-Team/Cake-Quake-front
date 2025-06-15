import { lazy, Suspense } from "react";

const TestPaymentPage = lazy(() => import('../pages/payment/testPaymentPage.jsx'));
const KakaoApprovePage = lazy(() => import('../pages/payment/kakaoApprovePage.jsx'));
const PaymentListPage = lazy(()=>import('../pages/payment/PaymentListPage.jsx'));
const PaymentDetailPage = lazy(()=>import('../pages/payment/paymentDetailPage.jsx'));

const Loading = <div>로딩 중...</div>; // ✅ 이거 꼭 필요함

const paymentRouter = () => ({
    path: 'payments',
    children: [
        {
            index: true,
            element: (
                <Suspense fallback={Loading}>
                    <PaymentListPage/>
                </Suspense>
    )
        },
        {
            path: ':paymentId',
            element: (
                <Suspense fallback={Loading}>
                    <PaymentDetailPage/>
                </Suspense>
            )
        }

    ],
});

export default paymentRouter;
