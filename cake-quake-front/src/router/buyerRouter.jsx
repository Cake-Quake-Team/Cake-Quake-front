// src/router/buyerRouter.jsx
import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import CartLayout from '../layouts/CartLayout.jsx';

const CartPage = lazy(() => import('../pages/cart/CartPage.jsx'));
const OrderListPage = lazy(() => import('../pages/order/buyer/orderListPage.jsx'));
const OrderDetailPage = lazy(() => import('../pages/order/buyer/orderDetailPage.jsx'));
const CreateOrderPage = lazy(() => import('../pages/order/buyer/createOrderPage.jsx'));

const Loading = <div>Loading...</div>;

const buyerRouter = () => ({
    path: 'buyer',
    children: [
        {
            index: true,
            element: <Navigate to="/buyer/cart" />,
        },
        {
            path: 'cart',
            element: <CartLayout />,
            children: [
                {
                    index: true,
                    element: <Suspense fallback={Loading}><CartPage /></Suspense>,
                }
            ]
        },
        {
            path: 'orders',
            children: [
                {
                    index: true,
                    element: <Suspense fallback={Loading}><OrderListPage /></Suspense>
                },
                {
                    path: 'create',
                    element: <Suspense fallback={Loading}><CreateOrderPage /></Suspense>
                },
                {
                    path: ':orderId',
                    element: <Suspense fallback={Loading}><OrderDetailPage /></Suspense>
                }
            ]
        }
    ]
});

export default buyerRouter;
