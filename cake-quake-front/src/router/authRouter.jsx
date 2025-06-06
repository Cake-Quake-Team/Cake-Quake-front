import { lazy, Suspense } from "react";

const SigninPage = lazy(() => import("../pages/member/signinPage"))

const Loading = <div>Loading...</div>

const authRouter = () => {
    return {
        path: "auth",
        children: [
            {
                path: "signin",
                element: <Suspense fallback={Loading}><SigninPage /></Suspense>
            },
        ]
    }
}

export default authRouter;