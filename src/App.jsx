
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar/Navbar';
import Layout from './components/Layout/Layout';
import Home from './components/Home/Home'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import RePassword from './components/RePassword/RePassword'
import OtpPage from './components/OtpPage/OtpPage'
import RecoverPassword from './components/RecoverPassword/RecoverPassword'
import NewPassword from './components/NewPassword/NewPassword'
import Blog from './components/Blog/Blog'
import ProductDetails from './components/ProductDetails/ProductDetails'

import Shop from './components/Shop/Shop';
import Profile from './components/Profile/Profile';

import Shop from './components/Shop/Shop'; // ✅ إضافة مكون Shop
import LiveStream from './components/LiveStream/LiveStream';


function App() {
 
  let routes = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "repassword", element: <RePassword/> },
        { path: "otp", element: <OtpPage/>},
        { path: "recoverpassword", element: <RecoverPassword/>},
        { path: "newpassword", element: <NewPassword/>},
        { path: "home", element: <Home /> },
        { path: "*", element: <Login /> },
        {path: "blog",element:<Blog/>} // 404 page or redirect
        { path: "product-details", element: <ProductDetails /> },
        {path: "shop", element: <Shop /> },

        {path: "profile", element: <Profile/>},

        {path:"LiveStream", element: <LiveStream/> },



        { path: "*", element: <Login /> }, // 404 page or redirect
      ],
    },
  ], {
    basename: "/graduation-pro-front", 
  });
  return (
    <>
 <RouterProvider router={routes}></RouterProvider>
    </>
  )
}

export default App
