import AdminLayout from "../layouts/adminLayout.jsx";
import Shops from "../pages/admin/shops.jsx";
import Reviews from "../pages/admin/reviews.jsx";

const adminRoutes  = [
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            { path: "shops", element: <Shops /> },      // /admin/shops
            { path: "reviews", element: <Reviews /> },  // /admin/reviews

        ]
    }
];

export default adminRoutes ;