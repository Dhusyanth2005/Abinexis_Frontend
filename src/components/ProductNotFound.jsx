import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const ProductNotFound = () => {
  const location = useLocation();
  const { query, error } = location.state || { query: '', error: '' };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <p className="text-lg mb-4">
          We couldn't find any products matching "<strong>{query}</strong>".
        </p>
        {error && <p className="text-red-400 mb-4">Error: {error}</p>}
        <p className="mb-4">Please try a different search term or explore our categories.</p>
        <Link
          to="/"
          className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ProductNotFound;