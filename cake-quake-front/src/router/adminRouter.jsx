import AdminLayout from "../layouts/adminLayout.jsx";
import Shops from "../pages/admin/shops.jsx";
import {lazy, Suspense} from "react";


const DeletionRequestAdminPage = lazy(() => import("../pages/admin/deletionRequestAdminPage.jsx"));

//----------------발주 아이템
const IngredientListPage = lazy(()=> import("../pages/admin/IngredientListPage.jsx"));
const IngredientFormPage = lazy(()=> import("../pages/admin/IngredientFormPage.jsx"));

//----------------------발주
const ProcurementConfirmPage = lazy(()=> import("../pages/admin/adminProcurementConfirmPage.jsx"));
const AdminProcurementListPage = lazy(() => import("../pages/admin/adminProcurementListPage.jsx"));

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
        {
            path: "procurements",
            children: [
                {
                    index: true,
                    element: (
                        <Suspense fallback={Loading}>
                            <AdminProcurementListPage />
                        </Suspense>
                    ),
                },
                {
                    path: ":procurementId/confirm",
                    element: (
                        <Suspense fallback={Loading}>
                            <ProcurementConfirmPage />
                        </Suspense>
                    ),
                },
            ],
        },
    ],
});



export default adminRouter ;