import { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductPage.css';

export default function ProductPage({ backButton }) {
  const [activeTab, setActiveTab] = useState('collaboration');
  const [selectedQuantity, setSelectedQuantity] = useState('25 Cases');
  const [selectedDelivery, setSelectedDelivery] = useState('Standard (3-5 days)');
  const [selectedGrade, setSelectedGrade] = useState('Premium');

  const collaborationOrders = [
    {
      business: 'Metro Cafe Chain',
      ordered: 6,
      needed: 4,
      location: 'Downtown',
      delivery: 'Tuesday'
    },
    {
      business: 'Bright Start Academy',
      ordered: 18,
      needed: 7,
      location: 'Westside',
      delivery: 'Thursday'
    },
    {
      business: 'Design Studio Pro',
      ordered: 22,
      needed: 3,
      location: 'Business District',
      delivery: 'Friday'
    }
  ];

  const TabButton = ({ label, tabKey, isActive, onClick }) => (
    <button
      onClick={() => onClick(tabKey)}
      className={`tab-button ${isActive ? 'active' : ''}`}
    >
      {label}
    </button>
  );

  const OptionButton = ({ label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`option-button ${isActive ? 'active' : ''}`}
    >
      {label}
    </button>
  );

  return (
    <div className="product-page">
      <div className="container">
        {/* Main Content */}
        <div className="main-content">
          {/* Product Section */}
          <div className="product-section">
            <Link to="/" className="back-button">
              ← Back to office supplies
            </Link>

            {/* Product Image */}
            <div className="product-image">
              <img 
                src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop&crop=center" 
                alt="Premium Copy Paper - Professional grade A4 white"
                className="product-main-image"
              />
            </div>

            {/* Product Specifications */}
            <div className="product-specs">
              <h3>Product Specifications</h3>
              <div className="specs-list">
                <div><span className="spec-label">Paper Weight:</span> 80gsm premium quality</div>
                <div><span className="spec-label">Compatibility:</span> All inkjet and laser printers</div>
                <div><span className="spec-label">Certification:</span> FSC certified sustainable source</div>
                <div><span className="spec-label">Pack Size:</span> 5 reams per case (2,500 sheets)</div>
                <div><span className="spec-label">Sheet Size:</span> A4 (210 × 297 mm)</div>
                <div><span className="spec-label">Brightness:</span> 96% ISO brightness rating</div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="details-section">
            <div className="breadcrumb">OFFICE SUPPLIES</div>
            <h1 className="product-title">Premium Copy Paper</h1>

            {/* Rating */}
            <div className="rating">
              <div className="stars">★★★★★</div>
              <div className="rating-text">4.8 (156 business reviews)</div>
            </div>

            {/* Order Quantity */}
            <div className="option-group">
              <div className="option-label">Order Quantity</div>
              <div className="option-buttons">
                {['10 Cases', '25 Cases', '50 Cases', 'Custom'].map((quantity) => (
                  <OptionButton
                    key={quantity}
                    label={quantity}
                    isActive={selectedQuantity === quantity}
                    onClick={() => setSelectedQuantity(quantity)}
                  />
                ))}
              </div>
            </div>

            {/* Delivery Speed */}
            <div className="option-group">
              <div className="option-label">Delivery Speed</div>
              <div className="option-buttons">
                {['Standard (3-5 days)', 'Express (1-2 days)', 'Shared Route'].map((delivery) => (
                  <OptionButton
                    key={delivery}
                    label={delivery}
                    isActive={selectedDelivery === delivery}
                    onClick={() => setSelectedDelivery(delivery)}
                  />
                ))}
              </div>
            </div>

            {/* Paper Grade */}
            <div className="option-group">
              <div className="option-label">Paper Grade</div>
              <div className="option-buttons">
                {['Basic', 'Premium', 'Ultra'].map((grade) => (
                  <OptionButton
                    key={grade}
                    label={grade}
                    isActive={selectedGrade === grade}
                    onClick={() => setSelectedGrade(grade)}
                  />
                ))}
              </div>
            </div>

            {/* Bulk Pricing */}
            <div className="bulk-pricing">
              <div className="bulk-pricing-title">Bulk Pricing (Per Case)</div>
              <div className="pricing-tier">
                <span>10-24 cases</span>
                <span className="price">$12.50</span>
              </div>
              <div className="pricing-tier">
                <span>25-49 cases</span>
                <span className="price">
                  $10.75 <span className="savings-badge">Save 14%</span>
                </span>
              </div>
              <div className="pricing-tier">
                <span>50+ cases</span>
                <span className="price">
                  $9.25 <span className="savings-badge">Save 26%</span>
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
              <TabButton
                label="Active Orders"
                tabKey="collaboration"
                isActive={activeTab === 'collaboration'}
                onClick={setActiveTab}
              />
              <TabButton
                label="Delivery"
                tabKey="delivery"
                isActive={activeTab === 'delivery'}
                onClick={setActiveTab}
              />
            </div>

            {/* Tab Content */}
            {activeTab === 'collaboration' && (
              <div className="tab-content">
                {collaborationOrders.map((order, index) => (
                  <div key={index} className="collaboration-card">
                    <div className="collaboration-header">
                      <div className="business-name">{order.business}</div>
                      <button className="join-button">Join Order</button>
                    </div>
                    <div className="collaboration-details">
                      <div>{order.ordered} cases ordered • Needs {order.needed} more for bulk pricing</div>
                      <div>📍 {order.location} • Delivery: {order.delivery}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="tab-content">
                <div className="delivery-card">
                  <div className="delivery-title">🚚 Shared Delivery Available</div>
                  <div className="delivery-description">
                    Split shipping costs with nearby businesses<br />
                    Standard: $45 | Shared: $25 per location
                  </div>
                </div>
                
                <div className="delivery-card">
                  <div className="delivery-title">📅 Next Shared Routes</div>
                  <div className="delivery-description">
                    <div>Tuesday, June 25 - Downtown/Westside</div>
                    <div>Thursday, June 27 - Business District</div>
                    <div>Friday, June 28 - Industrial Area</div>
                  </div>
                </div>
              </div>
            )}

            {/* Add-ons */}
            <div className="add-ons">
              <div className="add-ons-title">Quick Add-Ons</div>
              <div className="add-on-item">
                <span>+ Express delivery upgrade</span>
                <span className="add-on-price">+$25</span>
              </div>
              <div className="add-on-item">
                <span>+ Delivery coordination service</span>
                <span className="add-on-price">+$15</span>
              </div>
            </div>

            {/* Price and CTA */}
            <div className="price-section">
              <div className="final-price">
                $268.75
                <span className="total-savings">Save $80.25</span>
              </div>
              
              <button className="add-to-cart">
                Start Collaboration Order (25)
              </button>
              
              <a href="#" className="product-details-link">
                See full product details
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}