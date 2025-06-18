import { lazy, Suspense } from "react";
import BasicLayout from "../layouts/basicLayout.jsx";


const CakeIndex = lazy(() => import("../pages/cake/buyer/indexPage.jsx"));
const BuyerCakeRead = lazy(() => import("../pages/cake/buyer/buyerReadPage.jsx"));

const Loading = <div>Loading...</div>; // 로딩 스피너 등 실제 컴포넌트로 대체 가능

const buyerRouter = () => {
    return {
        path: "buyer",
        children: [
            {
                index: true,
                element: <Suspense fallback={Loading}><CakeIndex/></Suspense>
            },
            {
                path: "shop/:shopId/cakes/read/:cakeId",
                element: <Suspense fallback={Loading}><BuyerCakeRead /></Suspense>
            },
        ]
    };
};

export default buyerRouter;