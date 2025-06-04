import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";

import BasicLayout from "../layouts/BasicLayout";
import cakeRouter from "./cakeRouter";

const Loading = <div>Loading...</div>;
const Main = lazy(() => import("../pages/mainPage"));

const mainRouter = createBrowserRouter([
    {
        path: "/",
        element: <BasicLayout />,
        children: [
            {
                index: true,
                element: <Suspense fallback={Loading}><Main /></Suspense>
            },
            cakeRouter()
        ]
    }
]);

export default mainRouter;
