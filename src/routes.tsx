import { createBrowserRouter, Outlet } from "react-router-dom";
import Index from "./pages/index";
import PricingPage from "./pages/pricing";
import AdminDashboard from "./pages/admin";
import NotFound from "./pages/NotFound";

const routes = [
  {
    path: "/",
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "pricing",
        element: <PricingPage />,
      },
      {
        path: "admin",
        element: <AdminDashboard />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
