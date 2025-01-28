import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Profile from "./components/Profile";
import MainLayout from "./components/MainLayout";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element:
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/profile/:id',
        element: <Profile />
      },
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;