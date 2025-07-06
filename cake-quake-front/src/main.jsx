import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import mainRouter from './router/mainRouter.jsx';
import './index.css';
import { AuthProvider } from './store/AuthContext.jsx';

const queryClient = new QueryClient();

/*
  로그인 전역 상태 관리를 위한 AuthProvider 추가
*/
createRoot(document.getElementById('root')).render(

    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={mainRouter} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AuthProvider>
);
