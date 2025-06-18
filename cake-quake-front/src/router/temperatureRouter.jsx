import {lazy, Suspense} from "react";

const TemperaturePage = lazy(() => import("../pages/buyer/temperature/temperaturePage.jsx"));

const Loading = <div>Loading...</div>; // 필요 시 Spinner 컴포넌트로 교체

const temperatureRouter = () => ({
    path: "temperature",
    children: [
        {
            index: true,
            element:(
                <Suspense fallback={Loading}>
                    <TemperaturePage/>
                </Suspense>
            )
        }
    ]

});
export default temperatureRouter;