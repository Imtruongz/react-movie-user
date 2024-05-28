import React from "react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">404 Not Found</h1>
        <p className="text-gray-600">
          Sorry, the page you are looking for does not exist.
        </p>
      </div>
    </div>
  );
}
