import SellerLayout from "../layouts/sellerLayout.jsx";
import {lazy, Suspense} from "react";

const Loading = <div>Loading...</div>; // 로딩 스피너 등 실제 컴포넌트로 대체 가능
const ShopDetail=lazy(()=>import("../pages/shop/shopDetailPage.jsx"))
const ShopNotice=lazy(()=>import("../pages/shop/shopNoticeListPage.jsx"))
const ShopNoticeDetail=lazy(()=>import("../pages/shop/shopNoticeDetailPage.jsx"))
const ShopNoticeCreate=lazy(()=>import("../pages/shop/shopNoticeCreatePage.jsx"))
const ShopNoticeUpdate=lazy(()=>import("../pages/shop/shopNoticeUpdatePage.jsx"))
const ShopUpdate=lazy(()=>import("../pages/shop/shopUpdatePage.jsx"))

const shopRouter = () => {
    return {
        path: "shops",
        children: [

            {
                path: "read/:cid",
                element: <Suspense fallback={Loading}><ShopDetail /></Suspense>
            },
            {
                path: "read/:cid/notices",
                element: <Suspense fallback={Loading}><ShopNotice /></Suspense>
            },
            {
                ///shops/read/123/notices/456
                path: "read/:cid/notices/:nid",
                element: <Suspense fallback={Loading}><ShopNoticeDetail /></Suspense>
            },
            {
                ///shops/read/123/notices/456
                path: "read/:cid/notices/new",
                element: <Suspense fallback={Loading}><ShopNoticeCreate /></Suspense>
            },
            {
                ///shops/read/123/notices/456
                path: "read/:cid/notices/:nid/update",
                element: <Suspense fallback={Loading}><ShopNoticeUpdate /></Suspense>
            },
            {
                //shops/update/5
                path:"update/:cid",
                element: <Suspense fallback={Loading}><ShopUpdate/></Suspense>
            }



        ]
    };
};

export default shopRouter;