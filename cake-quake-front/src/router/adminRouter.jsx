import AdminLayout from "../layouts/adminLayout.jsx";
import Shops from "../pages/admin/shops.jsx";
import {lazy, Suspense} from "react";
import RequireAuth from "../components/common/requireAuth.jsx";

/*
    25.06.23 Admin 역할만 접근 가능하게 변경
*/
const DeletionRequestAdminPage = lazy(() => import("../pages/admin/deletionRequestAdminPage.jsx"));

//----------------발주 아이템
const IngredientListPage = lazy(()=> import("../pages/admin/IngredientListPage.jsx"));
const IngredientFormPage = lazy(()=> import("../pages/admin/IngredientFormPage.jsx"));
const PendingSellerListPage = lazy(()=> import("../pages/admin/pendingSellerListPage.jsx"));

//----------------------발주

const AdminProcurementListPage = lazy(() => import("../pages/admin/adminProcurementListPage.jsx"));
const AdminProcurementDetailPage = lazy (()=>import("../pages/admin/adminProcurementDetailPage.jsx"))


//--------------------QnA
// QnA (관리자)
const QnAAdminListPage    = lazy(() => import("../pages/admin/qna/qnaAdminListPage.jsx"));
const QnAAdminRespondPage = lazy(() => import("../pages/admin/qna/qnaAdminRespondPage.jsx"));


const Loading = <div>Loading...</div>;

const adminRouter = () => ({
    path: "/admin",
    element: <RequireAuth allowedRoles={["ADMIN"]}></RequireAuth>,
    children: [
        {
            element: <AdminLayout />,
            children: [
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
                   index: true,
                    element: (
                        <Suspense fallback={Loading}>
                            <PendingSellerListPage />
                        </Suspense>
                    ),
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
                            path: ":procurementId",
                            element: (
                                <Suspense fallback={Loading}>
                                    < AdminProcurementDetailPage/>
                                </Suspense>
                            ),
                        },
                    ],
                },
                {
                    path: 'qna',
                    children: [
                        {
                            index: true,
                            element: (
                                <Suspense fallback={Loading }>
                                    <QnAAdminListPage />
                                </Suspense>
                            ),
                        },
                        {
                            path: 'type/:type',
                            element: (
                                <Suspense fallback={Loading}>
                                    <QnAAdminListPage />
                                </Suspense>
                            ),
                        },
                        {
                            path: 'status/:status',
                            element: (
                                <Suspense fallback={Loading }>
                                    <QnAAdminListPage />
                                </Suspense>
                            ),
                        },
                        {
                            path: 'role/:role',
                            element: (
                                <Suspense fallback={Loading}>
                                    <QnAAdminListPage />
                                </Suspense>
                            ),
                        },
                        {
                            path: ":qnaId/respond",
                            element: (
                                <Suspense fallback={<Loading />}>
                                    <QnAAdminRespondPage />
                                </Suspense>
                            ),
                        },
                    ],
                },
            ],
        }
    ]
});



export default adminRouter ;