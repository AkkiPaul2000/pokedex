import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ErrorPageProps {
  message?: string;
  onRetry?: () => void;
}

function ErrorPage({ 
  message = "Server is currently unavailable. Please try again later.", 
  onRetry 
}: ErrorPageProps) {
  const navigate = useNavigate();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="error-page">
      <div className="error-content">
        <h2>Oops!</h2>
        <p>{message}</p>
        <div className="error-actions">
          <button onClick={handleRetry} className="retry-button">
            Try Again
          </button>
          <button onClick={() => navigate('/')} className="home-button">
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;