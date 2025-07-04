import { lazy, Suspense } from "react";

const SigninPage = lazy(() => import("../pages/member/auth/signinPage"))
const KakaoRedirectPage = lazy(() => import("../pages/member/auth/kakaoRedirectPage"))
const SignupPage = lazy(() => import("../pages/member/auth/signupPage"))
const SignupBuyerPage = lazy(() => import("../pages/member/auth/signupBuyerPage"))
const SignupSellersStep1Page = lazy(() => import("../pages/member/auth/signupSellerStep1Page"))
const SignupSellersStep2Page = lazy(() => import("../pages/member/auth/signupSellerStep2Page"))
const SignupKakaoUserPage = lazy(() => import("../pages/member/auth/signupKakaoUserPage"))
const ChangePasswordPage = lazy(() => import("../pages/member/auth/changePasswordPage"))

const Loading = <div>Loading...</div>

const authRouter = () => {
    return {
        path: "auth",
        children: [
            {
                path: "signin",
                element: <Suspense fallback={Loading}><SigninPage /></Suspense>
            },
            {
                path: "kakao",
                element: <Suspense fallback={Loading}><KakaoRedirectPage /></Suspense>
            },
            {
                path: "signup",
                element: <Suspense fallback={Loading}><SignupPage /></Suspense>
            },
            {
                path: "signup/buyer",
                element: <Suspense fallback={Loading}><SignupBuyerPage /></Suspense>
            },
            {
                path: "signup/seller-step1",
                element: <Suspense fallback={Loading}><SignupSellersStep1Page /></Suspense>
            },
            {
                path: "signup/seller-step2",
                element: <Suspense fallback={Loading}><SignupSellersStep2Page /></Suspense>
            },
            {
                path: "signup/kakao",
                element: <Suspense fallback={Loading}><SignupKakaoUserPage /></Suspense>
            },
            {
                path: "password",
                element: <Suspense fallback={Loading}><ChangePasswordPage /></Suspense>
            },
        ]
    };
}

export default authRouter;