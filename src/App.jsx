
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Layout from './components/Layout/Layout'
import Home from './components/Home/Home'
import Login from './components/Login/Login'
import Register from './components/Register/Register'

function App() {
 
  let routes = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "home", element: <Home /> },
        { path: "*", element: <Login /> }, // 404 page or redirect
      ],
    },
  ], {
    basename: "/graduation-pro-front", // إضافة basename هنا
  });
  return (
    <>
 <RouterProvider router={routes}></RouterProvider>
    </>
  )
}

export default App
