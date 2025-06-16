
import { lazy, Suspense } from "react";

const TestPaymentPage = lazy(() => import('../pages/payment/testPaymentPage.jsx'));
const KakaoApprovePage = lazy(() => import('../pages/payment/kakaoApprovePage.jsx'));
const PaymentListPage = lazy(()=>import('../pages/payment/PaymentListPage.jsx'));
const PaymentDetailPage = lazy(()=>import('../pages/payment/paymentDetailPage.jsx'));

const Loading = <div>로딩 중...</div>; // ✅ 이거 꼭 필요함

const paymentRouter = () => ({
    path: 'payments',
// src/router/pointRouter.jsx
import { lazy, Suspense } from "react";
import BasicLayout from "../layouts/basicLayout.jsx";

const PointPage = lazy(() => import("../pages/buyer/point/pointPage.jsx"));

const Loading = <div>Loading...</div>; // 필요 시 Spinner 컴포넌트로 교체

const pointRouter = () => ({
    path: "point",

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
