import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { Overview, Products, Orders, AddProduct, NotFound, ProductPage, OrderDetails, Login } from './pages'
import AuthLayout from './components/AuthLayout.jsx'

const router = createHashRouter([
    {
        path: '/',
        element: <AuthLayout><App /></AuthLayout>,
        children: [
            {
                path: '/',
                element: <Overview />
            },
            {
                path: '/products',
                element: <Products />
            },
            {
                path: '/orders',
                element: <Orders />
            },
            {
                path: '/addProduct',
                element: <AddProduct />
            },
            {
                path: '/product/:productId',
                element: <ProductPage />
            },
            {
                path: '/order/:orderId',
                element: <OrderDetails />
            }
        ]
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '*',
        element: <NotFound />
    }
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)
