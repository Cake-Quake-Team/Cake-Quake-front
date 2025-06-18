// src/router/sellerRouter.jsx
import { lazy, Suspense } from 'react';
import SellerLayout from '../layouts/sellerLayout.jsx';

const SellerIndex = lazy(() => import('../pages/seller/indexPage.jsx'));
const SellerOrderListPage = lazy(() => import('../pages/order/seller/SellerOrderListPage.jsx'));
const SellerOrderDetailPage = lazy(() => import('../pages/order/seller/SellerOrderDetailPage.jsx'));

const Loading = <div>Loading...</div>;

const sellerRouter = () => ({
    path: 'seller',
    element: <SellerLayout />,
    children: [
        {
            index: true,
            element: <Suspense fallback={Loading}><SellerIndex /></Suspense>
        },
        {
            path: 'orders',
            children: [
                {
                    index: true,
                    element: <Suspense fallback={Loading}><SellerOrderListPage /></Suspense>
                },
                {
                    path: ':orderId',
                    element: <Suspense fallback={Loading}><SellerOrderDetailPage /></Suspense>
                }
            ]
        }
    ]
});

export default sellerRouter;
