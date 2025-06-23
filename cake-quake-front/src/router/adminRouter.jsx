import AdminLayout from "../layouts/adminLayout.jsx";
import Shops from "../pages/admin/shops.jsx";
import {lazy, Suspense} from "react";
import RequireAuth from "../components/common/requireAuth.jsx";

/*
    25.06.23 Admin 역할만 접근 가능하게 변경
*/
const DeletionRequestAdminPage = lazy(() => import("../pages/admin/deletionRequestAdminPage.jsx"));
const IngredientListPage = lazy(()=> import("../pages/admin/IngredientListPage.jsx"));
const IngredientFormPage = lazy(()=> import("../pages/admin/IngredientFormPage.jsx"));
const PendingSellerListPage = lazy(()=> import("../pages/admin/pendingSellerListPage.jsx"));

const Loading = <div>Loading...</div>;

const adminRouter = () => ({
    path: "/admin",
    element: <RequireAuth allowedRoles={["ADMIN"]}></RequireAuth>,
    children: [
        {
            element: <AdminLayout />,
            children: [
                {
                    // index 미정. 없으면 레이아웃이 안 보여서 일단 이렇게 설정함.
                    index: true,
                    // element: <Shops />,
                },
                { path: "shops", element: <Shops /> },
                {
                    path: "review-deletion-requests",
                    element: (
                        <Suspense fallback={Loading}>
                            <DeletionRequestAdminPage />
                        </Suspense>
                    ),
                },
                {
                    path: "ingredients",
                    children: [
                        {
                            index: true,
                            element: (
                                <Suspense fallback={Loading}>
                                    <IngredientListPage />
                                </Suspense>
                            ),
                        },
                        {
                            path: "new",
                            element: (
                                <Suspense fallback={Loading}>
                                    <IngredientFormPage />
                                </Suspense>
                            ),
                        },
                        {
                            path: ":ingredientId/edit",
                            element: (
                                <Suspense fallback={Loading}>
                                    <IngredientFormPage />
                                </Suspense>
                            ),
                        },
                    ],
                },
                {
                    path: "sellers/pending",
                    element: (
                        <Suspense fallback={Loading}>
                            <PendingSellerListPage />
                        </Suspense>
                    ),
                },
            ],
        }
    ]
});


export default adminRouter ;