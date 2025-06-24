import { lazy, Suspense } from "react";
import SellerLayout from "../layouts/sellerLayout.jsx";
import BasicLayout from "../layouts/basicLayout.jsx";


const SellerProfilePages = lazy(()=>import("../pages/seller/sellerProfilePages.jsx"))
const SellerProfilePage = lazy(() => import("../pages/member/seller/sellerProfilePage.jsx"))
const SellerProfileModifyPage = lazy(() => import("../pages/member/seller/sellerProfileModifyPage.jsx"))

//발주
const ProcurementListPage = lazy(()=> import("../pages/procurement/shopProcurementListPage.jsx"));
const ProcurementCreatePage = lazy(()=>import("../pages/procurement/shopProcurementCreatePage.jsx"));
const ProcurementDetailPage= lazy(()=>import("../pages/procurement/shopProcurementDetailPage.jsx"));


const Loading = <div>Loading...</div>; // 로딩 스피너 등 실제 컴포넌트로 대체 가능

const sellerRouter = () => {
    return {
        path: "seller",
        // element: <BasicLayout />,
        children: [

            {
                path:"mypage",
                element:<Suspense fallback={Loading}><SellerProfilePages/></Suspense>
            },
            {
                path: "profile",
                element: <Suspense fallback={Loading}><SellerProfilePage /></Suspense>
            },
            {
                path: "profile/modify/:uid",
                element: <Suspense fallback={Loading}><SellerProfileModifyPage /></Suspense>
            },


            //--------------------발주--------------------
            {
                path: ":shopId/procurements",
                element: <Suspense fallback={Loading}><ProcurementListPage/></Suspense>
            },
            {
                path: ":shopId/procurements/create",
                element:<Suspense fallback={Loading}><ProcurementCreatePage/></Suspense>
            },
            {
                path: ":shopId/procurements/:procurementId",
                element: <Suspense fallback={Loading}><ProcurementDetailPage/></Suspense>
            }
        ]
    };
};

export default sellerRouter;

