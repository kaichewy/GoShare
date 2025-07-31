import React from 'react';
import './Product.css';
import { useNavigate } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';

const Product = ({ product }) => {
  const navigate = useNavigate()
  
  const viewProduct = id => {
    navigate(`/product/${id}`)
  }

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
         onClick={() => viewProduct(product.id)}>
      
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
      </div>

      {/* Product Details */}
      <div className="p-6">
        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors duration-200">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
          </div>
          <span className="text-sm text-gray-500">({product.reviews || 0} Reviews)</span>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
            )}
          </div>
          
          <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium text-sm transition-colors duration-200 shadow-sm hover:shadow-md">
            <ShoppingCart className="w-4 h-4" />
            <span>Join</span>
          </button>
        </div>

        {/* Progress Bar (if needed) */}
        {product.bought && product.total && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{product.bought} out of {product.total} sold</span>
              <span>{Math.round((product.bought / product.total) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(product.bought / product.total) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;