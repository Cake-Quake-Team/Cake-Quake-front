import { lazy, Suspense } from "react";
import SellerLayout from "../layouts/sellerLayout.jsx";


const SellerIndex = lazy(() => import("../pages/seller/indexPage"));
const CakeAdd = lazy(() => import("../pages/cake/seller/addCakePage.jsx"));
const CakeUpdate = lazy(() => import("../pages/cake/seller/updateCakePage.jsx"));
const SellerCakeRead = lazy(() => import("../pages/cake/seller/sellerReadPage.jsx"));
const OptionAdd = lazy(() => import("../pages/cake/seller/addOptionPage.jsx"));
const OptionUpdate = lazy(() => import("../pages/cake/seller/updateOptionPage.jsx"));
const OptionRead = lazy(() => import("../pages/cake/seller/readOptionPage.jsx"));


const Loading = <div>Loading...</div>; // 로딩 스피너 등 실제 컴포넌트로 대체 가능

const sellerRouter = () => {
    return {
        path: "seller",
        element: <SellerLayout />,
        children: [
            {
                path: "shop/:shopId",
                element: <Suspense fallback={Loading}><SellerIndex/></Suspense>
            },
            {
                path: "shop/:shopId/cakes/read/:cakeId",
                element: <Suspense fallback={Loading}><SellerCakeRead /></Suspense>
            },
            {
                path: "shop/:shopId/cakes/add",
                element: <Suspense fallback={Loading}><CakeAdd /></Suspense>
            },
            {
                path: "shop/:shopId/cakes/update/:cakeId",
                element: <Suspense fallback={Loading}><CakeUpdate /></Suspense>
            },
            {
                path: "shop/:shopId/options/add",
                element: <Suspense fallback={Loading}><OptionAdd/></Suspense>
            },
            {
                path: "shop/:shopId/options/update/:optionId",
                element: <Suspense fallback={Loading}><OptionUpdate/></Suspense>
            },
            {
                path: "shop/:shopId/options/read/:optionId",
                element: <Suspense fallback={Loading}><OptionRead/></Suspense>
            }
        ]
    };
};

export default sellerRouter;