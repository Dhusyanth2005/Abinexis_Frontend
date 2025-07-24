import React, { useState } from 'react';
import { Star, Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800 hover:border-[#52B69A]/50 transition-all duration-500 hover:transform hover:scale-105">
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setLiked(!liked)}
          className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
            liked ? 'bg-[#52B69A] text-white' : 'bg-black/30 text-gray-300 hover:text-[#52B69A]'
          }`}
        >
          <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
        </button>
      </div>
      
      {product.badge && (
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 bg-gradient-to-r from-[#52B69A] to-[#34A0A4] text-white text-sm font-semibold rounded-full">
            {product.badge}
          </span>
        </div>
      )}

      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-6">
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-400">({product.reviews})</span>
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#52B69A] transition-colors duration-300">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {product.originalPrice && (
              <span className="text-gray-500 line-through text-sm">
                ₹{product.originalPrice}
              </span>
            )}
            <span className="text-xl font-bold text-white">
              ₹{product.price}
            </span>
          </div>
          
          <button className="px-4 py-2 bg-gradient-to-r from-[#52B69A] to-[#34A0A4] rounded-lg text-white font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;