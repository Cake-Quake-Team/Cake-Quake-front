import { lazy, Suspense } from "react";

const SigninPage = lazy(() => import("../pages/member/signinPage"))
const SignupPage = lazy(() => import("../pages/member/signupPage"))
const BuyerSignupPage = lazy(() => import("../pages/member/buyer/buyerSignupPage"))

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
                path: "buyer/signup",
                element: <Suspense fallback={Loading}><BuyerSignupPage /></Suspense>
            },
            // {
            //     path: "seller/signup",
            //     element: <Suspense fallback={Loading}><SignupPage /></Suspense>
            // },
        ]
    }
}

export default authRouter;