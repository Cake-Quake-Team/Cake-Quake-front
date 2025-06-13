import { lazy, Suspense } from "react";
import RequireAuth from "../components/common/requireAuth.jsx";

const TokenTestPage = lazy(() => import("../pages/member/auth/tokenTestPage"))

const Loading = <div>Loading...</div>

const memberRouter = () => {
    return {
        path: "member",
        element: <RequireAuth allowedRoles={["BUYER"]} />,
        children: [
            {
                path: "token-test",
                element: <Suspense fallback={Loading}><TokenTestPage /></Suspense>
            },
        ]
    }
}

export default memberRouter;