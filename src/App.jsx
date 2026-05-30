import "./App.css";
import {RouterProvider, createBrowserRouter} from "react-router-dom";

import AppLayout from "./layouts/app-layout";

import LandingPage from "./pages/landing";
import Dashboard from "./pages/dashboard";


const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/dashboard",
        element: 
            <Dashboard />      
      },
    ],
  },
]);

function App() {
  return (
      <RouterProvider router={router} />
  );
}

export default App;