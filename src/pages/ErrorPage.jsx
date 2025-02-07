import { useRouteError } from "react-router-dom";

export const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Oops!</h1>
        <p className="text-lg mb-4">Sorry, an unexpected error has occurred.</p>
        <p className="text-gray-600">
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </div>
  );
};

ErrorPage.displayName = "ErrorPage";

export default ErrorPage;
