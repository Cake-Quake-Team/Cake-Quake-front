import { lazy, Suspense } from "react";
import SellerLayout from "../layouts/sellerLayout.jsx";
import BasicLayout from "../layouts/basicLayout.jsx";

const SellerProfileDetailsPage = lazy(() => import("../pages/member/seller/sellerProfileDetailsPage.jsx"))
const SellerProfileDetailsModifyPage = lazy(() => import("../pages/member/seller/sellerProfileDetailsModifyPage.jsx"))

const SellerProfilePage = lazy(()=>import("../pages/seller/sellerProfilePage.jsx"))


//발주
const ProcurementListPage = lazy(()=> import("../pages/procurement/shopProcurementListPage.jsx"));
const ProcurementCreatePage = lazy(()=>import("../pages/procurement/shopProcurementCreatePage.jsx"));
const ProcurementDetailPage= lazy(()=>import("../pages/procurement/shopProcurementDetailPage.jsx"));

//주문 관련
const SellerOrderListPage = lazy(() => import("../pages/order/seller/sellerOrderListPage.jsx"));
const SellerOrderDetailPage = lazy(() => import("../pages/order/seller/sellerOrderDetailPage.jsx"));

//QnA
const QnAListPage = lazy(() => import("../pages/qna/qnaListPage"));
const QnADetailPage = lazy(()=> import("../pages/qna/qnaDetailPage"));
const QnAFormPage = lazy (() => import("../pages/qna/QnAFormPage"));

const Loading = <div>Loading...</div>; // 로딩 스피너 등 실제 컴포넌트로 대체 가능

const sellerRouter = () => {
    return {
        path: "seller",
        // element: <BasicLayout />,
        children: [
            {
                path: "profile",
                // element: < />,
                children: [
                    {
                        index:true,
                        element:<Suspense fallback={Loading}><SellerProfilePage/></Suspense>
                    },
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
    }

};

export default sellerRouter;

