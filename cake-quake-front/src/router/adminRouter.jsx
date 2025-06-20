import AdminLayout from "../layouts/adminLayout.jsx";
import Shops from "../pages/admin/shops.jsx";
import {lazy, Suspense} from "react";


const DeletionRequestAdminPage = lazy(() => import("../pages/admin/deletionRequestAdminPage.jsx"));
const IngredientListPage = lazy(()=> import("../pages/admin/IngredientListPage.jsx"));
const IngredientFormPage = lazy(()=> import("../pages/admin/IngredientFormPage.jsx"));

const Loading = <div>Loading...</div>;

const adminRouter = () => ({
    path: "/admin",
    element: <AdminLayout />,
    children: [
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
    ],
});


export default adminRouter ;