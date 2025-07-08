import SellerLayout from "../layouts/sellerLayout.jsx";
import {lazy, Suspense} from "react";
import BasicLayout from "../layouts/basicLayout.jsx";
import TotalSalesPage from "../pages/order/seller/sales/TotalSalesPage.jsx";

const Loading = <div>Loading...</div>; // 로딩 스피너 등 실제 컴포넌트로 대체 가능
const ShopNotice=lazy(()=>import("../pages/shop/shopNoticeListPage.jsx"))
const ShopNoticeDetail=lazy(()=>import("../pages/shop/shopNoticeDetailPage.jsx"))
const ShopNoticeCreate=lazy(()=>import("../pages/shop/shopNoticeCreatePage.jsx"))
const ShopNoticeUpdate=lazy(()=>import("../pages/shop/shopNoticeUpdatePage.jsx"))
const ShopUpdate=lazy(()=>import("../pages/shop/shopUpdatePage.jsx"))


const SellerIndex = lazy(() => import("../pages/seller/indexPage"));
const CakeAdd = lazy(() => import("../pages/cake/seller/addCakePage.jsx"));
const CakeUpdate = lazy(() => import("../pages/cake/seller/updateCakePage.jsx"));
const SellerCakeRead = lazy(() => import("../pages/cake/seller/sellerReadPage.jsx"));
const OptionAdd = lazy(() => import("../pages/cake/seller/addOptionPage.jsx"));
const OptionRead = lazy(() => import("../pages/cake/seller/readOptionPage.jsx"));

//리뷰
const SellerReviewPage = lazy(()=>import("../pages/shop/review/sellerReviewPage.jsx"));
const SellerReviewDetailPage = lazy(()=>import("../pages/shop/review/sellerReviewDetailPage.jsx"))

//주문
const SellerOrderListPage = lazy(()=>import("../pages/order/seller/sellerOrderListPage.jsx"));
const SellerOrderDetailPage = lazy(()=>import("../pages/order/seller/sellerOrderDetailPage.jsx"));

//채팅
const SellerChattingPage =lazy(()=>import("../pages/shop/shopChatPage.jsx"));
const SellerChatListPage =lazy(()=>import("../pages/shop/sellerChatRoomsPage.jsx"));

const shopRouter = () => {
    return {
        path: "shops",
        element: <SellerLayout/>,
        children: [
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
            },
            //---------------------------------------현지
            {
                path: ":shopId",
                element: <Suspense fallback={Loading}><SellerIndex/></Suspense>
            },

            {
                path: ":shopId/cakes/read/:cakeId",
                element: <Suspense fallback={Loading}><SellerCakeRead /></Suspense>
            },
            {
                path: ":shopId/cakes/add",
                element: <Suspense fallback={Loading}><CakeAdd /></Suspense>
            },
            {
                path: ":shopId/cakes/update/:cakeId",
                element: <Suspense fallback={Loading}><CakeUpdate /></Suspense>
            },
            {
                path: ":shopId/options/add",
                element: <Suspense fallback={Loading}><OptionAdd/></Suspense>
            },
            {
                path: ":shopId/options/read/:optionId",
                element: <Suspense fallback={Loading}><OptionRead/></Suspense>
            },

            //----------------------------------매장 리뷰-------------------
            {
                index:false,
                path: ":shopId/reviews",
                element:(
                    <Suspense fallback={Loading}>
                        <SellerReviewPage/>
                    </Suspense>
                )
            },
            {
                path: ":shopId/reviews/:reviewId",
                element:(
                    <Suspense fallback={Loading}>
                        <SellerReviewDetailPage/>
                    </Suspense>
                )
            },
            //--------------------------판매자 주문 관련 라우트--------------------//
            {
                path: ":shopId/orders",
                element: <Suspense fallback={Loading}><SellerOrderListPage/></Suspense>
            },
            {
                path: ":shopId/orders/:orderId",
                element: <Suspense fallback={Loading}><SellerOrderDetailPage/></Suspense>
            },
            //--------------------------판매자 채팅 관련 라우트-------------------//
            {
                path: ":shopId/chatting",
                element: <Suspense fallback={Loading}><SellerChatListPage/></Suspense>
            },
            {
                path: ":shopId/chatting/:roomId",
                element: <Suspense fallback={Loading}><SellerChattingPage/></Suspense>
            },


            //--------------------------판매자 주문 통계 관련 라우트--------------------//
            {
                path: ":shopId/sales",
                element: <Suspense fallback={Loading}><TotalSalesPage/></Suspense>
            }
        ]
    };
};

export default shopRouter;