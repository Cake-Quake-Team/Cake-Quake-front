import { lazy, Suspense } from "react";
import SellerLayout from "../layouts/sellerLayout.jsx";
import BasicLayout from "../layouts/basicLayout.jsx";



const SellerProfileDetailsPage = lazy(() => import("../pages/member/seller/sellerProfileDetailsPage.jsx"))
const SellerProfileDetailsModifyPage = lazy(() => import("../pages/member/seller/sellerProfileDetailsModifyPage.jsx"))

const SellerProfilePages = lazy(()=>import("../pages/seller/sellerProfilePages.jsx"))
const SellerProfilePage = lazy(() => import("../pages/member/seller/sellerProfilePage.jsx"))
const SellerProfileModifyPage = lazy(() => import("../pages/member/seller/sellerProfileModifyPage.jsx"))


//발주
const ProcurementListPage = lazy(()=> import("../pages/procurement/shopProcurementListPage.jsx"));
const ProcurementCreatePage = lazy(()=>import("../pages/procurement/shopProcurementCreatePage.jsx"));
const ProcurementDetailPage= lazy(()=>import("../pages/procurement/shopProcurementDetailPage.jsx"));

//주문 관련
const SellerOrderListPage = lazy(() => import("../pages/order/seller/sellerOrderListPage.jsx"));
const SellerOrderDetailPage = lazy(() => import("../pages/order/seller/sellerOrderDetailPage.jsx"));

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
                // element: < />,
                children: [
                    {
                        path: "details",
                        element: <Suspense fallback={Loading}><SellerProfileDetailsPage /></Suspense>
                    },
                    {
                        path: "details/modify/:uid",
                        element: <Suspense fallback={Loading}><SellerProfileDetailsModifyPage /></Suspense>
                    },

                ]
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
            },
            //--------------------------판매자 주문 관련 라우트--------------------//
            {
                path: "shops/:shopId/orders",
                element: <Suspense fallback={Loading}><SellerOrderListPage/></Suspense>
            },
            {
                path: "shops/:shopId/orders/:orderId",
                element: <Suspense fallback={Loading}><SellerOrderDetailPage/></Suspense>
            }
        ]
    };
};

export default sellerRouter;

