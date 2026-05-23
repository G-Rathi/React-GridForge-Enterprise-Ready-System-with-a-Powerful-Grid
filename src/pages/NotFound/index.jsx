import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import "./style.scss";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-card">
        <h1 className="code">404</h1>

        <h2 className="title">Page Not Found</h2>

        <p className="desc">
          Oops! The page you are looking for doesn’t exist or has been moved.
        </p>

        <div className="actions">
          <button onClick={() => navigate(-1)} className="btn secondary">
            <ArrowLeft size={18} />
            Go Back
          </button>

          <button onClick={() => navigate("/")} className="btn primary">
            <Home size={18} />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;