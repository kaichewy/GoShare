import React from 'react';
import Product from './ProductCard/Product';
import './ProductGrid.css';

const ProductGrid = ({ products, fetchMore, hasMore, loading }) => {
  return (
    <div className="w-full">
      {/* Grid Header */}
      <div className="mb-12 text-center">
        <div className="inline-block mb-6">
          <h2 className="text-4xl font-bold text-gray-800  relative">
            Available Products
          </h2>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Discover amazing deals and join group purchases to save money together
        </p>
        <div className="flex justify-center items-center space-x-2 mt-6">
          <div className="w-8 h-1 bg-green-600 rounded-full"></div>
          <div className="w-4 h-1 bg-green-400 rounded-full"></div>
          <div className="w-8 h-1 bg-green-600 rounded-full"></div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="text-gray-600 text-lg">Loading amazing products...</span>
          </div>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && products.length > 0 && !loading && (
        <div className="mt-16 text-center">
          <button
            onClick={fetchMore}
            className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Load More Products
          </button>
        </div>
      )}

      {/* Empty State */}
      {products.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">No products found</h3>
          <p className="text-gray-600 text-lg">Try adjusting your search or check back later for new deals</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;