import { lazy, Suspense } from "react";
import SellerLayout from "../layouts/sellerLayout.jsx";
import BasicLayout from "../layouts/basicLayout.jsx";


// detail로 수정
const SellerProfileDetailsPage = lazy(() => import("../pages/member/seller/sellerProfileDetailsPage.jsx"))
const SellerProfileDetailsModifyPage = lazy(() => import("../pages/member/seller/sellerProfileDetailsModifyPage.jsx"))

//발주
const ProcurementListPage = lazy(()=> import("../pages/procurement/shopProcurementListPage.jsx"));
const ProcurementCreatePage = lazy(()=>import("../pages/procurement/shopProcurementCreatePage.jsx"));
const ProcurementDetailPage= lazy(()=>import("../pages/procurement/shopProcurementDetailPage.jsx"));


const Loading = <div>Loading...</div>; // 로딩 스피너 등 실제 컴포넌트로 대체 가능

const sellerRouter = () => {
    return {
        path: "seller",
        children: [
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
            }
        ]
    };
};

export default sellerRouter;

