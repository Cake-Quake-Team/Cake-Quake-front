import { lazy, Suspense } from "react";
import {Navigate} from "react-router";

const MyReviewsPage     = lazy(() => import("../pages/buyer/review/myReviewsPage.jsx"));
const ReviewCreatePage = lazy(()=>import("../pages/buyer/review/reviewCreatePage.jsx"));
const ReviewDetailPage = lazy(()=>import("../pages/buyer/review/reviewDetailPage.jsx"));
const ReviewEditPage = lazy(()=> import("../pages/buyer/review/reviewEditPage.jsx"));

const SellerReviewPage = lazy(()=>import("../pages/shop/review/sellerReviewPage.jsx"));
const SellerReviewDetailPage = lazy(()=>import("../pages/shop/review/sellerReviewDetailPage.jsx"))

const Loading = <div>Loading...</div>

const ReviewRouter = () =>({
    path: "",
    children: [
        //buyer 페이지
        {
            path: "buyer",
            children:[
        //내 리뷰 리스트
        {
            index: false,
            path: "reviews",
            element: (
                <Suspense fallback={Loading}>
                    <MyReviewsPage/>
                </Suspense>
            )
        },
        //리뷰 생성
        {
          path: 'reviews/create/:orderId',
          element: (
              <Suspense fallback={Loading}>
                  <ReviewCreatePage/>
              </Suspense>
          )
        },
        //리뷰 상세
        {
            path: 'reviews/:reviewId',
            element: (
                <Suspense fallback={Loading}>
                    <ReviewDetailPage/>
                </Suspense>
            )
        },

        //리뷰 수정
        {
            path: 'reviews/:reviewId/edit',
            element:(
                <Suspense fallback={Loading}>
                    <ReviewEditPage/>
                </Suspense>
            )
        }]
        },

        //seller페이지
        {
            path:'seller',
            children: [
                    {
                    index:false,
                    path: "shops/:shopId/reviews",
                    element:(
                        <Suspense fallback={Loading}>
                            <SellerReviewPage/>
                        </Suspense>
                    )
                },
                {
                    path: "shops/:shopId/reviews/:reviewId",
                    element:(
                        <Suspense fallback={Loading}>
                            <SellerReviewDetailPage/>
                        </Suspense>
                    )
                }
            ]
        }
        ]
});
export default ReviewRouter;