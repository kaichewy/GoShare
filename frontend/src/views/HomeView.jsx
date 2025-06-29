import ProductGrid from "@/components/ProductGrid/ProductGrid";
import airpodsImg from '@/assets/images/airpods_max_pink.jpg';
import FilterSidebar from '@/components/ProductGrid/Filter/FilterSidebar'
import SearchBar from "@/components/SearchBar/SearchBar";
import { useState, useEffect } from 'react';
import axios from 'axios'
import "./HomeView.css"

function HomeView() {
  //Product assumed to have fields : image(url), name, reviews, bought, total
  const productsPerBatch = 20;

  const [visibleProducts, setVisibleProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreProducts = () => {
    axios.get(`http://localhost:8080/productsLimited?limit=${productsPerBatch}&offset=${visibleProducts.length}`).then(response => {
      const newProducts = response.data
      console.log(newProducts)
      setVisibleProducts([...visibleProducts, ...newProducts])
      if (newProducts.length < productsPerBatch) {
        setHasMore(false)
      }
    })
  };

  useEffect(() => {
    fetchMoreProducts()
  }, []);

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
