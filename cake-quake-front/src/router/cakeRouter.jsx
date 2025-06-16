// import { lazy, Suspense } from "react";
//
// const CakeAdd = lazy(() => import("../pages/cake/addPage"));
// const CakeUpdate = lazy(() => import("../pages/cake/updatePage.jsx"));
// const CakeIndex = lazy(() => import("../pages/cake/indexPage"));
// const CakeList = lazy(() => import("../pages/cake/listPage"));
// const SellerCakeRead = lazy(() => import("../pages/cake/sellerReadPage.jsx"));
// const BuyerCakeRead = lazy(() => import("../pages/cake/buyerReadPage.jsx"));
//
// const Loading = <div>Loading...</div>;
//
// const cakeRouter = () => {
//     return {
//         path: "cakes",
//         children: [
//             {
//                 index: true,
//                 element: <Suspense fallback={Loading}><CakeIndex/></Suspense>
//             },
//             // {
//             //     path: "list",
//             //     element: <Suspense fallback={Loading}><CakeList /></Suspense>
//             // },
//             // {
//             //     path: "seller/read/:cakeId",
//             //     element: <Suspense fallback={Loading}><SellerCakeRead /></Suspense>
//             // },
//             {
//                 path: "buyer/read/:cakeId",
//                 element: <Suspense fallback={Loading}><BuyerCakeRead /></Suspense>
//             },
//             // {
//             //     path: "add",
//             //     element: <Suspense fallback={Loading}><CakeAdd /></Suspense>
//             // },
//             // {
//             //     path: "update/:cakeId",
//             //     element: <Suspense fallback={Loading}><CakeUpdate /></Suspense>
//             // }
//         ]
//     };
// };
//
// export default cakeRouter;