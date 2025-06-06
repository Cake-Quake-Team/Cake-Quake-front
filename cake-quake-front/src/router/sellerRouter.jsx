import { lazy, Suspense } from "react";
import BasicLayout from "../layouts/basicLayout.jsx";
import SellerLayout from "../layouts/sellerLayout.jsx";


const SellerIndex = lazy(() => import("../pages/seller/indexPage"));



const Loading = <div>Loading...</div>; // 로딩 스피너 등 실제 컴포넌트로 대체 가능

const sellerRouter = () => {
    return {
        path: "seller",
        element: <SellerLayout />,
        children: [
            {
                index: true,
                element: <Suspense fallback={Loading}><SellerIndex/></Suspense>
            }
            // {
            //     path: "list", // /cake/list
            //     element: <Suspense fallback={Loading}><CakeList /></Suspense>
            // },


        ]
    };
};

export default sellerRouter;