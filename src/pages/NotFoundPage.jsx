import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-lg mb-4">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link to="/" className="text-blue-500 hover:text-blue-600">
          Go back home
        </Link>
      </div>
    </div>
  );
};

NotFoundPage.displayName = "NotFoundPage";

export default NotFoundPage;
