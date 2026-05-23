import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { useAuth } from '../common/contexts/AuthContext';
import { useGetMenuQuery } from '../features/menu/menuApi';
import Shell from './AppShell/Shell';
import LoadingSpinner from '../components/LoadingSpinner';
import { PrivateRoute } from '../common/hocs/PrivateRoute';
// menu will be loaded from RTK Query menuApi
import RootLayout from './RootLayout';
import GlobalLoader from '../common-components/GlobalLoader';


// Lazy load pages
const Login = lazy(() => import('../pages/Auth/Login'));
const Register = lazy(() => import('../pages/Auth/Register'));
const NotFound = lazy(() => import('../pages/NotFound'));
function lazyPageImport(pageName) {
  // convention: pages export default component at src/pages/<Name>/index.jsx
  return lazy(() => import(`../pages/${pageName}/index.jsx`).catch(() => import(`../pages/${pageName}.jsx`)).catch(()=> ({ default: () => <NotFound /> })));
}

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  // Fetch menu via RTK Query; skip request when not authenticated
  const { data: routes = [], isLoading, isError } = useGetMenuQuery(null, { skip: !isAuthenticated });

  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <GlobalLoader />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          !isAuthenticated ? <Login /> : <Navigate to="/" replace />
        } />
        <Route path="/register" element={
          !isAuthenticated ? <Register /> : <Navigate to="/" replace />
        } />

        {/* Protected Routes */}
        <Route path="/" element={<PrivateRoute><Shell menulist={isAuthenticated ? routes : []}/></PrivateRoute>}>
          {routes?.map((menu) => {
            // Create routes for parent menu items
            const routes = [];
            
            if (menu.component && menu.type === 'menu') {
              const Comp = lazyPageImport(menu.component);
              routes.push(
                <Route key={menu.path} path={menu.path} element={<Comp />} />
              );
            }
            
            // Create routes for children menu items
            if (menu.children && menu.children.length > 0) {
              menu.children.forEach((child) => {
                if (child.component && child.type === 'menu') {
                  const ChildComp = lazyPageImport(child.component);
                  routes.push(
                    <Route key={child.path} path={child.path} element={<ChildComp />} />
                  );
                }
              });
            }
            
            return routes;
          })}
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;