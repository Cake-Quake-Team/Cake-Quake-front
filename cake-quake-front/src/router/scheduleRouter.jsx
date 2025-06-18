import {lazy, Suspense} from "react";

const SchedulePage = lazy(() => import("../pages/schedulePage.jsx"));

const Loading = <div>Loading...</div>; // 필요 시 Spinner 컴포넌트로 교체

const scheduleRouter = () => ({
    path: "schedule",
    children: [
        {
            index: true,
            element:(
                <Suspense fallback={Loading}>
                    <SchedulePage/>
                </Suspense>
            )
        }
    ]

});
export default scheduleRouter;