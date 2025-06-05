import BasicLayout from "../layouts/BasicLayout";
// 필요한 페이지 컴포넌트들을 임포트합니다.
import MainPage from "../pages/mainPage";
import {createBrowserRouter} from "react-router";
import {lazy, Suspense} from "react";
import cakeRouter from "./cakeRouter.jsx"; // mainPage.jsx의 export default MainPage; 에 대응

const CakeList = lazy(() => import("../pages/cake/listPage"));
const CakeRead = lazy(() => import("../pages/cake/readPage"));
const CakeAdd = lazy(() => import("../pages/cake/addPage"));
const CakeModify = lazy(() => import("../pages/cake/modifyPage"));
const CakeIndex = lazy(() => import("../pages/cake/indexPage"));


const Loading = <div>Loading...</div>; // 로딩 스피너 등 실제 컴포넌트로 대체 가능

// createBrowserRouter에 전달할 라우트 객체 배열을 정의합니다.
const mainRouter = createBrowserRouter([
    {
        path: "/",
        element: <BasicLayout />, // BasicLayout은 Header, Outlet, Footer를 포함
        children: [
            {
                index: true, // 부모 경로와 동일한 경로 (/)를 의미
                element: <Suspense fallback={Loading}><MainPage /></Suspense>
            },

            cakeRouter()


        ]
    }
]);

export default mainRouter;