import { lazy, Suspense } from "react";
import {Navigate} from "react-router";

const MyReviewsPage     = lazy(() => import("../pages/buyer/review/myReviewsPage.jsx"));
const ReviewCreatePage = lazy(()=>import("../pages/buyer/review/reviewCreatePage.jsx"));
const ReviewDetailPage = lazy(()=>import("../pages/buyer/review/reviewDetailPage.jsx"));
const ReviewEditPage = lazy(()=> import("../pages/buyer/review/reviewEditPage.jsx"));
const Loading = <div>Loading...</div>

const ReviewRouter = () =>({
    path: "buyer",
    children: [
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
        },

        //잘못된 /buyer경로 다이렉트
        {
            path:'',
            element: <Navigate to="reviews" replace/>
        }



        ]
});
export default ReviewRouter;