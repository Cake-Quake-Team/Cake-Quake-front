// src/router/pointRouter.jsx
import { lazy, Suspense } from "react";

const PointPage = lazy(() => import("../pages/buyer/point/pointPage.jsx"));

const Loading = <div>Loading...</div>; // 필요 시 Spinner 컴포넌트로 교체

const pointRouter = () => ({
    path: "point",
    children: [
        {
            index: true,
            element:(
                <Suspense fallback={Loading}>
                    <PointPage/>
                </Suspense>
            )
        }
    ]

});
 export default pointRouter;