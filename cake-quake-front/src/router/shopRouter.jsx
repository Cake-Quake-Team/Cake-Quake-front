import SellerLayout from "../layouts/sellerLayout.jsx";
import {lazy, Suspense} from "react";

const Loading = <div>Loading...</div>; // 로딩 스피너 등 실제 컴포넌트로 대체 가능
const ShopList = lazy(() => import("../pages/shop/mainPage.jsx"));

const shopRouter = () => {
    return {
        path: "shop",
        children: [
            {
                index: true,
                element: <Suspense fallback={Loading}><ShopList/></Suspense>
            }
            // {
            //     path: "list", // /cake/list
            //     element: <Suspense fallback={Loading}><CakeList /></Suspense>
            // },


        ]
    };
};

export default shopRouter;