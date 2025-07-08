import BasicLayout from "../layouts/BasicLayout";
import MainPage from "../pages/mainPage";
import {createBrowserRouter} from "react-router";
import {Suspense} from "react";
import buyerRouter from "./buyerRouter.jsx";
import sellerRouter from "./sellerRouter.jsx";
import adminRouter from "./adminRouter.jsx";
import authRouter from "./authRouter.jsx";
import memberRouter from "./memberRouter.jsx";
import shopRouter from "./shopRouter.jsx";

const Loading = <div>Loading...</div>; // 로딩 스피너 등 실제 컴포넌트로 대체 가능

// createBrowserRouter에 전달할 라우트 객체 배열을 정의합니다.
const mainRouter = createBrowserRouter([
    {
        path: "/",
        element: <BasicLayout/>,
        children: [

            sellerRouter(),
            buyerRouter(),
            authRouter(),
            memberRouter(),
            shopRouter(),

        ]
    },
    {
        path: "/",
        children: [
            {
                index: true, // 부모 경로와 동일한 경로 (/)를 의미
                element: <Suspense fallback={Loading}><MainPage /></Suspense>
            },

            adminRouter()

        ]
    }
]);

export default mainRouter;