import ProductGrid from "@/components/ProductGrid/ProductGrid";
import SearchBar from "@/components/SearchBar/SearchBar";
import { useState, useEffect } from 'react';
import axios from 'axios'
import "./HomeView.css"

function HomeView() {
  //Product assumed to have fields : image(url), name, reviews, bought, total
  const productsPerBatch = 20;

  const [visibleProducts, setVisibleProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoreProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`http://localhost:8080/productsLimited?limit=${productsPerBatch}&offset=${visibleProducts.length}`);
      const newProducts = response.data;
      console.log('Fetched products:', newProducts);
      setVisibleProducts([...visibleProducts, ...newProducts]);
      if (newProducts.length < productsPerBatch) {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoreProducts();
  }, []);

  const onSearch = (query) => {
    console.log(query);
  };

  return (
    <div>
      <main>
        <section className="search-section">
          <div className="header-container">
            <h1 className="logo-text">
              <span className="primary">go</span><span className="highlight">share</span>
            </h1>
            <SearchBar onSearch={onSearch}></SearchBar>
          </div>
        </section>
        <section className="products-section">
          <div className="products-container">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700">{error}</p>
                <button 
                  onClick={fetchMoreProducts}
                  className="mt-2 text-red-600 hover:text-red-800 underline"
                >
                  Try again
                </button>
              </div>
            )}
            <ProductGrid 
              products={visibleProducts}
              fetchMore={fetchMoreProducts}
              hasMore={hasMore}
              loading={loading}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomeView;
