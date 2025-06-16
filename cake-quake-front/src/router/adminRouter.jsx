import AdminLayout from "../layouts/adminLayout.jsx";
import Shops from "../pages/admin/shops.jsx";
import Reviews from "../pages/admin/deletionRequestAdminPage.jsx";
import mainRouter from "./mainRouter.jsx";
import {lazy} from "react";


const DeletionRequestAdminPage = lazy(() => import("../pages/admin/deletionRequestAdminPage.jsx"));

const adminRouter  = ()=> {
    return {
        path: "/admin",
        element: <AdminLayout/>,
        children: [
            {path: "shops", element: <Shops/>},      // /admin/shops

            {path: "review-deletion-requests", element: <DeletionRequestAdminPage />},  // /admin/reviews

        ]

    }
}


export default adminRouter ;