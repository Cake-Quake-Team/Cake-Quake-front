// src/router/buyerRouter.jsx
import { lazy, Suspense } from 'react';
import CartLayout from '../layouts/CartLayout.jsx';
import AdminLayout from "../layouts/adminLayout.jsx";
import BasicLayout from "../layouts/basicLayout.jsx";


const CakeIndex = lazy(() => import("../pages/cake/buyer/indexPage.jsx"));
const BuyerCakeRead = lazy(() => import("../pages/cake/buyer/buyerReadPage.jsx"));
const CartPage = lazy(() => import('../pages/cart/CartPage.jsx'));
const OrderListPage = lazy(() => import('../pages/order/buyer/orderListPage.jsx'));
const OrderDetailPage = lazy(() => import('../pages/order/buyer/orderDetailPage.jsx'));
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
//온도
const TemperaturePage = lazy(() => import("../pages/buyer/temperature/temperaturePage.jsx"));
//포인트
const PointPage = lazy(() => import("../pages/buyer/point/pointPage.jsx"));


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

        //---------------------------상품 상세 보기------------------------------------
        {
                path: "shop/:shopId/cakes/read/:cakeId",
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
              }

          ]
        },


    ]
});

export default buyerRouter;