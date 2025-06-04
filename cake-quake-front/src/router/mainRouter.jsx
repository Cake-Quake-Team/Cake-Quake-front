import BasicLayout from "../layouts/BasicLayout";
// 필요한 페이지 컴포넌트들을 임포트합니다.
import MainPage from "../pages/mainPage";
import {createBrowserRouter} from "react-router";
import {lazy, Suspense} from "react"; // mainPage.jsx의 export default MainPage; 에 대응

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
            // 기존 cakeRouter() 함수가 객체 배열을 반환한다면 그대로 사용
            // 그렇지 않다면, cakeRouter() 내부의 라우트들을 여기에 직접 작성하거나 객체 배열을 반환하도록 수정
            {
                path: "cake", // /cake 경로
                children: [
                    {
                        index: true, // /cake
                        element: <Suspense fallback={Loading}><CakeIndex/></Suspense>
                    },
                    {
                        path: "list", // /cake/list
                        element: <Suspense fallback={Loading}><CakeList /></Suspense>
                    },
                    {
                        path: "read/:cid", // /cake/read/:cid
                        element: <Suspense fallback={Loading}><CakeRead /></Suspense> // FeedPage가 read/cid에 해당한다고 가정
                    },
                    {
                        path: "add", // /cake/add
                        element: <Suspense fallback={Loading}><CakeAdd /></Suspense>
                    },
                    {
                        path: "modify/:cid", // /cake/modify/:cid
                        element: <Suspense fallback={Loading}><CakeModify /></Suspense>
                    }
                ]
            }
            // About 페이지 추가 (예시)


        ]
    }
]);

export default mainRouter;