import { lazy, Suspense } from "react";

const CakeAdd = lazy(() => import("../pages/cake/addPage"));
const CakeModify = lazy(() => import("../pages/cake/modifyPage"));
const CakeIndex = lazy(() => import("../pages/cake/indexPage"));
const CakeList = lazy(() => import("../pages/cake/listPage")); // CakeList 컴포넌트 추가
const CakeRead = lazy(() => import("../pages/cake/readPage")); // CakeRead 컴포넌트 추가

const Loading = <div>Loading...</div>; // 로딩 스피너 등 실제 컴포넌트로 대체 가능

// cakeRouter 함수는 라우트 객체 하나를 반환하도록 합니다.
// 이 객체는 createBrowserRouter의 children 배열에 바로 들어갈 수 있는 형태여야 합니다.
const cakeRouter = () => {
    return {
        path: "cake", // 이 라우트는 부모 라우트 (여기서는 '/')에 대한 상대 경로입니다.
        children: [
            {
                index: true, // /cake 경로
                element: <Suspense fallback={Loading}><CakeIndex/></Suspense>
            },
            {
                path: "list", // /cake/list
                element: <Suspense fallback={Loading}><CakeList /></Suspense>
            },
            {
                path: "read/:cid", // /cake/read/:cid
                element: <Suspense fallback={Loading}><CakeRead /></Suspense>
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
    };
};

export default cakeRouter;