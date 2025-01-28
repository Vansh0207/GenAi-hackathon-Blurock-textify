import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Header from "./components/Header"
import Home from "./components/Home"
import Footer from "./components/Footer"
import Signup from "./components/Signup"
import Login from "./components/Login"
import ProtectedRoutes from "./components/ProtectedRoutes"

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element:
      <ProtectedRoutes>
        <Header />
        <Home/>
        <Footer/>
      </ProtectedRoutes>
    ,
    // children: [
    // ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
])

function App() {

  return (
    <>
      {/* <Header/> */}
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App
