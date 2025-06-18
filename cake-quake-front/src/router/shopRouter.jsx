import SellerLayout from "../layouts/sellerLayout.jsx";
import {lazy, Suspense} from "react";

const Loading = <div>Loading...</div>; // 로딩 스피너 등 실제 컴포넌트로 대체 가능
const ShopList = lazy(() => import("../pages/shop/mainPage.jsx"));
const ShopDetail=lazy(()=>import("../pages/shop/shopDetailPage.jsx"))
const ShopNotice=lazy(()=>import("../pages/shop/shopNoticeListPage.jsx"))
const ShopNoticeDetail=lazy(()=>import("../pages/shop/shopNoticeDetailPage.jsx"))
const ShopNoticeCreate=lazy(()=>import("../pages/shop/shopNoticeCreatePage.jsx"))
const ShopNoticeUpdate=lazy(()=>import("../pages/shop/shopNoticeUpdatePage.jsx"))


//발주
const ProcurementListPage = lazy(()=> import("../pages/procurement/shopProcurementListPage.jsx"));
const ProcurementCreatePage = lazy(()=>import("../pages/procurement/shopProcurementCreatePage.jsx"));
const ProcurementDetailPage= lazy(()=>import("../pages/procurement/shopProcurementDetailPage.jsx"));

const shopRouter = () => {
    return {
        path: "shop",
        children: [
            {
                index: true,
                element: <Suspense fallback={Loading}><ShopList/></Suspense>
            },
            {
                path: "read/:cid",
                element: <Suspense fallback={Loading}><ShopDetail /></Suspense>
            },
            {
                path: "read/:cid/notices",
                element: <Suspense fallback={Loading}><ShopNotice /></Suspense>
            },
            {
                ///shop/read/123/notices/456
                path: "read/:cid/notices/:nid",
                element: <Suspense fallback={Loading}><ShopNoticeDetail /></Suspense>
            },
            {
                ///shop/read/123/notices/456
                path: "read/:cid/notices/new",
                element: <Suspense fallback={Loading}><ShopNoticeCreate /></Suspense>
            },
            {
                ///shop/read/123/notices/456
                path: "read/:cid/notices/:nid/update",
                element: <Suspense fallback={Loading}><ShopNoticeUpdate /></Suspense>
            },

            //--------------------발주--------------------
            {
                path: "read/:cid/procurements",
                element: <Suspense fallback={Loading}><ProcurementListPage/></Suspense>
            },
            {
                path: "read/:cid/procurements/new",
                element:<Suspense fallback={Loading}><ProcurementCreatePage/></Suspense>
            },
            {
                path: "read/:cid/procurements/:pid",
                element: <Suspense fallback={Loading}><ProcurementDetailPage/></Suspense>
            }



        ]
    };
};

export default shopRouter;