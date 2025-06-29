import React from 'react';
import Product from './Product/Product';
import './ProductGrid.css';
import InfiniteScroll from 'react-infinite-scroll-component';
//import { TailSpin } from 'react-loader-spinner';

const ProductGrid = ({ products, fetchMore, hasMore }) => {
  //assuming products is the list of groups that are currently active
  return (
    <InfiniteScroll 
      dataLength={products.length}
      next={fetchMore}
      hasMore={hasMore}
      loader={
         <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <TailSpin height={40} width={40} color="#ff6600" />
          <p>Loading more products...</p>
        </div>
      }
      endMessage={<p style={{ textAlign: 'center' }}>No More Groups</p>}
      className='product-grid'
    >
        {products.map(product => 
          <Product product={product}></Product>
        )}
    </InfiniteScroll>
  );
};

export default ProductGrid;