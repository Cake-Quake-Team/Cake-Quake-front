import { lazy, Suspense } from "react";

const SigninPage = lazy(() => import("../pages/member/auth/signinPage"))
const SignupPage = lazy(() => import("../pages/member/auth/signupPage"))
const SignupBuyerPage = lazy(() => import("../pages/member/auth/signupBuyerPage"))
const SignupSellersStep1Page = lazy(() => import("../pages/member/auth/signupSellerStep1Page"))

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
        ]
    };
}

export default authRouter;