import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useEffect, useState } from 'react';
// import TokenContextProvider from './TokenContext';
import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import RePassword from './components/RePassword/RePassword';
import OtpPage from './components/OtpPage/OtpPage';
import RecoverPassword from './components/RecoverPassword/RecoverPassword';
import NewPassword from './components/NewPassword/NewPassword';
import Blog from './components/Blog/Blog';
import ProductDetails from './components/ProductDetails/ProductDetails';
import Profile from './components/Profile/Profile';
import LiveStream from './components/LiveStream/LiveStream';
import Blogdetail from './components/Blogdetails/Blogdetail';
import Shop from './components/Shop/Shop';
import Landing  from './components/Landing/Landing'
import PostDetails from './components/Home/Postdetails';
function App() {
  // const getStoredToken = () => {
  //   return localStorage.getItem("userToken") || null;
  // };

  // const [token, setToken] = useState(getStoredToken);

  // useEffect(() => {
  //   if (token) {
  //     localStorage.setItem("userToken", token);
  //   } else {
  //     localStorage.removeItem("userToken");
  //   }
  // }, [token]);

  let routes = createBrowserRouter(
    [
      {
        path: "/",
        element: <Layout />,
        children: [
          { index: true, element: <Landing /> },
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
          { path: "repassword", element: <RePassword /> },
          { path: "otp", element: <OtpPage /> },
          { path: "recoverpassword", element: <RecoverPassword /> },
          { path: "newpassword", element: <NewPassword /> },
          { path: "home", element: <Home /> },
          { path: "blog", element: <Blog /> },
          { path: "product-details", element: <ProductDetails /> },
          { path: "shop", element: <Shop /> },
          { path: "profile", element: <Profile /> },
          { path: "LiveStream", element: <LiveStream /> },
          { path: "Blogdetails", element: <Blogdetail /> },
          { path: "post/:postId", element: <PostDetails /> },
          { path: "*", element: <Login /> },
        ],
      },
    ],
    {
      basename: "/graduation-pro-front",
    }
  );

  return (
   
      <RouterProvider router={routes} />
   
  );
}

export default App;
