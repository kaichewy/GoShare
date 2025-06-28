import ProductGrid from "@/components/ProductGrid/ProductGrid";
import airpodsImg from '@/assets/images/airpods_max_pink.jpg';
import FilterSidebar from '@/components/ProductGrid/Filter/FilterSidebar'
import SearchBar from "@/components/SearchBar/SearchBar";
import { useState, useEffect } from 'react';
import "./HomeView.css"

function HomeView() {
  //Product assumed to have fields : image(url), name, reviews, bought, total

  const product = {
    name: 'Air Pod Max Bulk Order',
    image: airpodsImg,
    price: 4.99,
    bought: 35,    // Number bought
    total: 100     // Total available
  };

  const [ productList, setProductList ] = useState(Array(50).fill(product))

  const productsPerBatch = 20;

  const [visibleProducts, setVisibleProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setVisibleProducts(productList.slice(0, productsPerBatch));
  }, [productList]);

  const fetchMoreProducts = () => {
    const nextBatch = visibleProducts.length + productsPerBatch;
    const nextProducts = productList.slice(visibleProducts.length, nextBatch);

    setVisibleProducts(prev => [...prev, ...nextProducts]);

    if (nextBatch >= productList.length) {
      setHasMore(false); // no more products to load
    }
  };

  const onSearch = (query) => {
    console.log(query)
  }

  return (
    <div>
      <main>
        <section className="search-section">
          <h1 className="logo-text">
            <span className="primary">go</span><span className="highlight">share</span>
          </h1>
          <SearchBar onSearch={onSearch}></SearchBar>
        </section>
        <section className="products-section">
          <div className="products-container">
              <FilterSidebar></FilterSidebar>
              <ProductGrid 
              products={visibleProducts}
              fetchMore={fetchMoreProducts}
              hasMore={hasMore}></ProductGrid>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomeView;
