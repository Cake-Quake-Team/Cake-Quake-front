import { lazy, Suspense } from "react";
import SellerLayout from "../layouts/sellerLayout.jsx";


const SellerIndex = lazy(() => import("../pages/seller/indexPage"));
const CakeAdd = lazy(() => import("../pages/cake/addPage"));
const CakeUpdate = lazy(() => import("../pages/cake/updatePage.jsx"));
const CakeList = lazy(() => import("../pages/cake/listPage"));
const SellerCakeRead = lazy(() => import("../pages/cake/sellerReadPage.jsx"));


const Loading = <div>Loading...</div>; // 로딩 스피너 등 실제 컴포넌트로 대체 가능

const sellerRouter = () => {
    return {
        path: "seller",
        element: <SellerLayout />,
        children: [
            {
                index: true,
                element: <Suspense fallback={Loading}><SellerIndex/></Suspense>
            },
            {
                path: "cakes/list",
                element: <Suspense fallback={Loading}><CakeList /></Suspense>
            },
            {
                path: "cakes/read/:cakeId",
                element: <Suspense fallback={Loading}><SellerCakeRead /></Suspense>
            },
            {
                path: "cakes/add",
                element: <Suspense fallback={Loading}><CakeAdd /></Suspense>
            },
            {
                path: "cakes/update/:cakeId",
                element: <Suspense fallback={Loading}><CakeUpdate /></Suspense>
            }
            // {
            //     path: "list", // /cake/list
            //     element: <Suspense fallback={Loading}><CakeList /></Suspense>
            // },


        ]
    };
};

export default sellerRouter;