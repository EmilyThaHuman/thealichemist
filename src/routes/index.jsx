import { createBrowserRouter } from "react-router-dom";
import Root from "@/layouts/Root";
import ErrorPage from "@/pages/ErrorPage";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ProjectDetail from "@/pages/ProjectDetail";
import ProjectsPage from "@/pages/ProjectsPage";
import ArchitecturePage from "@/pages/projects/ArchitecturePage";
import ProductDesignPage from "@/pages/projects/ProductDesignPage";
import ClothingDesignPage from "@/pages/projects/ClothingDesignPage";
import RentalsPage from "@/pages/projects/RentalsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <HomePage
            navLinks={[
              { href: "/projects", text: "OUR WORK" },
              { href: "/about", text: "ABOUT US" },
              { href: "/press", text: "PRESS & AWARDS" },
              { href: "/contact", text: "CONTACT" },
            ]}
          />
        ),
      },
      {
        path: "projects",
        element: <ProjectsPage />,
      },
      {
        path: "projects/architecture",
        element: <ArchitecturePage />,
      },
      {
        path: "projects/production",
        element: <ProductDesignPage />,
      },
      {
        path: "projects/clothing",
        element: <ClothingDesignPage />,
      },
      {
        path: "projects/rentals",
        element: <RentalsPage />,
      },
      {
        path: "projects/:id",
        element: <ProjectDetail />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
