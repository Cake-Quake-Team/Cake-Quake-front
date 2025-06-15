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
                    <PointPage />
                </Suspense>
            ),
        },
        // 예: 특정 기간 필터 경로 추가
        // {
        //   path: ":filter", // ex) /point/last7day
        //   element: (
        //     <Suspense fallback={Loading}>
        //       <PointPage />
        //     </Suspense>
        //   ),
        // },
    ],
});

export default pointRouter;
