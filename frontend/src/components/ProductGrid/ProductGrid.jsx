import React from 'react';
import Product from './Product/Product';
import './ProductGrid.css';
import InfiniteScroll from 'react-infinite-scroll-component';

const ProductGrid = ({ products, fetchMore, hasMore }) => {
  //assuming products is the list of groups that are currently active
  return (
    // <InfiniteScroll 
    //   className='product-grid' 
    //   dataLength={products.length}
    //   next={fetchMore}
    //   hasMore={hasMore}
    //   loader={<h4>Loading more products...</h4>}
    //   endMessage={<p style={{ textAlign: 'center' }}>No More Groups</p>}
    // >
      <div className='product-grid' >
        {products.map(product => 
          <Product product={product}></Product>
        )}
      </div>
    // </InfiniteScroll>
  );
};

export default ProductGrid;