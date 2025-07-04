// src/router/buyerRouter.jsx
import { lazy, Suspense } from 'react';
import CartLayout from '../layouts/CartLayout.jsx';
import AdminLayout from "../layouts/adminLayout.jsx";
import BasicLayout from "../layouts/basicLayout.jsx";
import OrderDetailPage from "../pages/order/buyer/orderDetailPage.jsx";
import AiRecommendPage from "../pages/ai/aiRecommendPage.jsx";



const CakeIndex = lazy(() => import("../pages/cake/buyer/indexPage.jsx"));
const BuyerCakeRead = lazy(() => import("../pages/cake/buyer/buyerReadPage.jsx"));
const CartPage = lazy(() => import('../pages/cart/CartPage.jsx'));
const OrderListPage = lazy(() => import('../pages/order/buyer/orderListPage.jsx'));
//const OrderDetailPage = lazy(() => import('../pages/order/buyer/orderDetailPage.jsx'));
const CreateOrderPage = lazy(() => import('../pages/order/buyer/createOrderPage.jsx'));

//-----------------리뷰------------------
const MyReviewsPage     = lazy(() => import("../pages/buyer/review/myReviewsPage.jsx"));
const ReviewCreatePage = lazy(()=>import("../pages/buyer/review/reviewCreatePage.jsx"));
const ReviewDetailPage = lazy(()=>import("../pages/buyer/review/reviewDetailPage.jsx"));
const ReviewEditPage = lazy(()=> import("../pages/buyer/review/reviewEditPage.jsx"));

//-------------------결제 내역 조회
const PaymentListPage = lazy(()=>import('../pages/payment/PaymentListPage.jsx'));
const PaymentDetailPage = lazy(()=>import('../pages/payment/paymentDetailPage.jsx'));

//---------------------마이페이지
const BuyerProfilePage = lazy(() => import("../pages/buyer/profile/buyerProfilePage.jsx"));
//온도
const TemperaturePage = lazy(() => import("../pages/buyer/temperature/temperaturePage.jsx"));
//포인트
const PointPage = lazy(() => import("../pages/buyer/point/pointPage.jsx"));
const BuyerProfileDetailsPage = lazy(() => import("../pages/member/buyer/buyerProfileDetailsPage.jsx"));
const BuyerProfileDetailsModifyPage = lazy(() => import("../pages/member/buyer/buyerProfileDetailsModifyPage.jsx"));
const BuyerProfileDetailsModifyAlarmPage = lazy(() => import("../pages/member/buyer/buyerProfileDetailsAlarmPage.jsx"));

//---------------------AI
const AIRecommendPage = lazy(() => import("../pages/ai/aiRecommendPage.jsx"));

//-------------------buyer/shops
const BuyerNoticeListPage=lazy(()=>import("../pages/buyer/shop/buyerNoticeListPage.jsx"));
const BuyerNoticeDetailPage = lazy(()=>import("../pages/buyer/shop/buyerNoticeDetailPage.jsx"));
const BuyerShopDetailPage=lazy(()=>import("../pages/buyer/shop/buyerShopDetailPage.jsx"));


//-------------------찜
const LikedMainPage = lazy(() => import("../pages/buyer/like/LikedMainPage.jsx"));



//QnA
const QnAListPage = lazy(() => import("../pages/qna/qnaListPage"));
const QnADetailPage = lazy(()=> import("../pages/qna/qnaDetailPage"));
const QnAFormPage = lazy (() => import("../pages/qna/QnAFormPage"));


const Loading = <div>Loading...</div>;

const buyerRouter = () => ({
    path: 'buyer',
    //
    children: [
        {
                index: true,
            //홈화면
                element: <Suspense fallback={Loading}><CakeIndex/></Suspense>

        },
        //---------------------------매장 상세 보기------------------------------------
        {
            path: "shops/:shopId",
            element: <Suspense fallback={Loading}><BuyerShopDetailPage /></Suspense>
        },

        //---------------------------공지사항 목록 보기------------------------------------
        {
            path: "shops/:shopId/notices",
            element: <Suspense fallback={Loading}><BuyerNoticeListPage /></Suspense>
        },

        { //공지사항 상세보기
            path: "shops/:shopId/notices/:noticeId",
            element: <Suspense fallback={Loading}><BuyerNoticeDetailPage/></Suspense>
        },



        //---------------------------상품 상세 보기------------------------------------
        {
                path: "shops/:shopId/cakes/read/:cakeId",
                element: <Suspense fallback={Loading}><BuyerCakeRead /></Suspense>
        },

        //------------------------------구매자 장바구니-----------------------
        {
            path: 'cart',
            element: <CartLayout />,
            children: [
                {
                    index: true,
                    element: <Suspense fallback={Loading}><CartPage /></Suspense>,
                }
            ]
        },


        //------------------------------구매자 주문-------------------------
        {
            path: 'orders',
            children: [
                {
                    index: true,
                    element: <Suspense fallback={Loading}><OrderListPage /></Suspense>
                },
                {
                    path: 'create',
                    element: <Suspense fallback={Loading}><CreateOrderPage /></Suspense>
                },
                {
                    path: ':orderId',
                    element: <Suspense fallback={Loading}><OrderDetailPage /></Suspense>
                }
            ]
        },

        {
            path: "reviews",
            children: [
                {
                    index: true,
                    element: (
                        <Suspense fallback={Loading}>
                            <MyReviewsPage/>
                        </Suspense>
                    )
                },
                //리뷰 생성
                {
                    path: 'create/:orderId',
                    element: (
                        <Suspense fallback={Loading}>
                            <ReviewCreatePage/>
                        </Suspense>
                    )
                },
                //리뷰 상세
                {
                    path: ':reviewId',
                    element: (
                        <Suspense fallback={Loading}>
                            <ReviewDetailPage/>
                        </Suspense>
                    )
                },

                //리뷰 수정
                {
                    path: ':reviewId/edit',
                    element:(
                        <Suspense fallback={Loading}>
                            <ReviewEditPage/>
                        </Suspense>
                    )
                }
            ]
        },
        //-----------------------결제 내역
        {
            path: "payments",
            children: [
                {
                    index: true,
                    element: (
                        <Suspense fallback={Loading}>
                            <PaymentListPage/>
                        </Suspense>
                    )
                },
                {
                    path: ':paymentId',
                    element: (
                        <Suspense fallback={Loading}>
                            <PaymentDetailPage/>
                        </Suspense>
                    )
                }
            ]
        },

        //-------------------구매자 마이페이지----------------------------
        {
            path: "profile",
            children: [
                {
                    index: true,
                    element: (
                        <Suspense fallback={Loading}>
                            <BuyerProfilePage/>
                        </Suspense>
                    )
                },
                // 찜
                {
                    path: "likes/:type?", // '/buyer/profile/likes' 또는 '/buyer/profile/likes/cake', '/buyer/profile/likes/shop'
                    element: (
                        <Suspense fallback={Loading}>
                            <LikedMainPage />
                        </Suspense>
                    )
                },
                {
                    //포인트
                    path: "points",
                    element:(
                        <Suspense fallback={Loading}>
                            <PointPage/>
                        </Suspense>
                    )
                } ,
                {
                    //온도
                    path: "temperature",
                    element:(
                        <Suspense fallback={Loading}>
                            <TemperaturePage/>
                        </Suspense>
                    )
                },
                {
                    // 유저 정보 - id, 전화번호 등
                    path: "details",
                    element: <Suspense fallback={Loading}><BuyerProfileDetailsPage /></Suspense>,
                },
                {
                    // 유저 정보 수정
                    path: "details/modify/:uid",
                    element: <Suspense fallback={Loading}><BuyerProfileDetailsModifyPage /></Suspense>
                },
                {
                    // 유저 알람 수정
                    path: "details/alarmsettings/:uid",
                    element: <Suspense fallback={Loading}><BuyerProfileDetailsModifyAlarmPage /></Suspense>
                },

            ]
        },

        //-------------------------AI 추천-------------------------------
        {
            path: "ai",
            element:(
                <Suspense fallback={Loading}>
                    <AIRecommendPage/>
                </Suspense>
    )
        },


        //------------------------QnA
        {
            path:'qna',
            children: [
                {
                    index : true,
                    element: (
                        <Suspense fallback={Loading}>
                            <QnAListPage/>
                        </Suspense>
                    )
                },
                {
                    path: 'create',
                    element: (
                        <Suspense fallback={Loading}>
                            <QnAFormPage/>
                        </Suspense>
                    )
                },
                {
                    path: ':qnaId',
                    element: (
                        <Suspense fallback={Loading}>
                            <QnADetailPage/>
                        </Suspense>
                    )
                },
                {
                    path: ':qnaId/edit',
                    element: (
                        <Suspense fallback={Loading}>
                            <QnAFormPage/>
                        </Suspense>
                    )
                }
            ]
        }
    ]
});

export default buyerRouter;