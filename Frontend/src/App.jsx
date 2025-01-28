import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Header from "./components/Header"
import Home from "./components/Home"
import Footer from "./components/Footer"

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element:
      <>
        <Header />
        <Home/>
        <Footer/>
      </>
    ,
    // children: [
    // ]
  },
  // {
  //   path: '/login',
  //   element: <Login />
  // },
  // {
  //   path: '/signup',
  //   element: <Signup />
  // },
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
