import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const isGitHubPagesDemo =
  typeof window !== "undefined" &&
  window.location.hostname.includes("github.io");

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div className="status-message">Checking authorization...</div>;
  }

  if (isGitHubPagesDemo) {
    return children;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
