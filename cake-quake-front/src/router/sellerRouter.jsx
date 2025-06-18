import { lazy, Suspense } from "react";
import SellerLayout from "../layouts/sellerLayout.jsx";


const SellerIndex = lazy(() => import("../pages/seller/indexPage"));
const SellerProfilePage = lazy(() => import("../pages/member/seller/sellerProfilePage.jsx"))
const SellerProfileModifyPage = lazy(() => import("../pages/member/seller/sellerProfileModifyPage.jsx"))


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
                path: "profile",
                element: <Suspense fallback={Loading}><SellerProfilePage /></Suspense>
            },
            {
                path: "profile/modify/:uid",
                element: <Suspense fallback={Loading}><SellerProfileModifyPage /></Suspense>
            },
            // {
            //     path: "list", // /cake/list
            //     element: <Suspense fallback={Loading}><CakeList /></Suspense>
            // },


        ]
    };
};

export default sellerRouter;