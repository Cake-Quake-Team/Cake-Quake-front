import { lazy, Suspense } from "react";

const CakeList = lazy(() => import("../pages/cake/listPage"));
const CakeRead = lazy(() => import("../pages/cake/readPage"));
const CakeAdd = lazy(() => import("../pages/cake/addPage"));
const CakeModify = lazy(() => import("../pages/cake/modifyPage"));
const CakeIndex = lazy(() => import("../pages/cake/indexPage"));

const Loading = <div>Cake Loading...</div>;

export default function cakeRouter() {
    return {
        path: "/cake",
        element: <Suspense fallback={Loading}><CakeIndex /></Suspense>,
        children: [
            {
                path: "list",
                element: <Suspense fallback={Loading}><CakeList /></Suspense>
            },
            {
                path: "read/:cid",
                element: <Suspense fallback={Loading}><CakeRead /></Suspense>
            },
            {
                path: "add",
                element: <Suspense fallback={Loading}><CakeAdd /></Suspense>
            },
            {
                path: "modify/:cid",
                element: <Suspense fallback={Loading}><CakeModify /></Suspense>
            }
        ]
    };
}
