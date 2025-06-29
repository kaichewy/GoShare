import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ProductPage.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ProductPage() {
  const [activeTab, setActiveTab] = useState('collaboration');
  const [selectedQuantity, setSelectedQuantity] = useState('25 Cases');
  const [selectedDelivery, setSelectedDelivery] = useState('Standard (3-5 days)');

  const [product, setProduct] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupData, setNewGroupData] = useState({
    business_name: '',
    target_quantity: 25,
    location: '',
    delivery_date: '',
    description: ''
  });

  const { productID } = useParams();

  // Fetch product data from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`http://localhost:8080/products/${productID}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (productID) {
      fetchProduct();
    }
  }, [productID]);

  // Fetch groups for this product
  useEffect(() => {
    const fetchGroups = async () => {
      if (!productID) return;
      
      try {
        setGroupsLoading(true);
        const response = await axios.get(`http://localhost:8080/groups/product/${productID}`);
        setGroups(response.data || []);
      } catch (error) {
        console.error('Error fetching groups:', error);
        setGroups([]); // Set empty array on error
      } finally {
        setGroupsLoading(false);
      }
    };

    fetchGroups();
  }, [productID]);

  // Join a group
  const handleJoinGroup = async (groupId) => {
    try {
      const token = localStorage.getItem('token'); // Adjust based on your auth implementation
      await axios.post(`http://localhost:8080/groups/${groupId}/join`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Refresh groups after joining
      const response = await axios.get(`http://localhost:8080/groups/product/${productID}`);
      setGroups(response.data || []);
      
      alert('Successfully joined the group!');
    } catch (error) {
      console.error('Error joining group:', error);
      alert('Failed to join group. Please try again.');
    }
  };

  // Create a new group
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token'); // Adjust based on your auth implementation
      console.log('Token:', token);
      
      const groupData = {
        ...newGroupData,
        product_id: parseInt(productID),
        current_quantity: 0
      };

      await axios.post('http://localhost:8080/addGroup', groupData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Refresh groups after creating
      const response = await axios.get(`http://localhost:8080/groups/product/${productID}`);
      setGroups(response.data || []);
      
      // Reset form and hide modal
      setNewGroupData({
        business_name: '',
        target_quantity: 25,
        location: '',
        delivery_date: '',
        description: ''
      });
      setShowCreateGroup(false);
      
      alert('Group created successfully!');
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group. Please try again.');
    }
  };

  // Calculate progress percentage
  const getProgressPercentage = (current, target) => {
    return target > 0 ? Math.min((current / target) * 100, 100) : 0;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="product-page">
        <div className="container">
          <div className="loading">Loading product...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-page">
        <div className="container">
          <div className="error">{error}</div>
          <Link to="/" className="back-button">← Back to products</Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-page">
        <div className="container">
          <div className="error">Product not found</div>
          <Link to="/" className="back-button">← Back to products</Link>
        </div>
      </div>
    );
  }

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
              ← Back to products
            </Link>

            {/* Product Image */}
            <div className="product-image">
              <img 
                src={product.ImageURL} 
                alt={product.Name}
                className="product-main-image"
              />
            </div>

            {/* Product Description */}
            {product.Description && (
              <div className="product-specs">
                <h3>Product Description</h3>
                <p>{product.Description}</p>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="details-section">
            <div className="breadcrumb">{product.Category || 'PRODUCTS'}</div>
            <h1 className="product-title">{product.Name}</h1>

            {/* Rating - only show if available */}
            {(product.rating || product.reviews) && (
              <div className="rating">
                <div className="stars">★★★★★</div>
                <div className="rating-text">
                  {product.rating || 'N/A'} 
                  {product.reviews && ` (${product.reviews} reviews)`}
                </div>
              </div>
            )}

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



            {/* Tabs */}
            <div className="tabs">
              <TabButton
                label="Active Groups"
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
                <div className="groups-header">
                  <h3>Active Group Orders</h3>
                  <button 
                    className="create-group-button"
                    onClick={() => setShowCreateGroup(true)}
                  >
                    + Create New Group
                  </button>
                </div>

                {groupsLoading ? (
                  <div className="loading">Loading groups...</div>
                ) : groups.length > 0 ? (
                  <div className="groups-list">
                    {groups.map((group) => (
                      <div key={group.id} className="collaboration-card">
                        <div className="collaboration-header">
                          <div className="business-name">{group.business_name}</div>
                          <button 
                            className="join-button"
                            onClick={() => handleJoinGroup(group.id)}
                          >
                            Join Order
                          </button>
                        </div>
                        <div className="collaboration-details">
                          <div>
                            {group.current_quantity} cases ordered • 
                            Needs {Math.max(0, group.target_quantity - group.current_quantity)} more for target
                          </div>
                          <div>📍 {group.location} • Delivery: {formatDate(group.delivery_date)}</div>
                          {group.description && <div className="group-description">{group.description}</div>}
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${getProgressPercentage(group.current_quantity, group.target_quantity)}%` }}
                          ></div>
                        </div>
                        <div className="progress-text">
                          {group.current_quantity} / {group.target_quantity} cases 
                          ({Math.round(getProgressPercentage(group.current_quantity, group.target_quantity))}%)
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="collaboration-placeholder">
                    <p>No active group orders for this product yet.</p>
                    <p>Be the first to start a group order!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="tab-content">
                <div className="delivery-info">
                  <h4>🚚 Shared Delivery Benefits</h4>
                  <p>Join a group order to split delivery costs with nearby businesses!</p>
                  
                  <div className="delivery-benefits">
                    <div className="benefit-item">
                      <strong>Cost Savings:</strong> Split shipping costs among group members
                    </div>
                    <div className="benefit-item">
                      <strong>Environmental Impact:</strong> Fewer delivery trips, reduced carbon footprint
                    </div>
                    <div className="benefit-item">
                      <strong>Flexible Delivery:</strong> Choose delivery windows that work for your business
                    </div>
                  </div>

                  {groups.length > 0 && (
                    <div className="upcoming-deliveries">
                      <h4>📅 Upcoming Group Deliveries</h4>
                      {groups.map((group) => (
                        <div key={group.id} className="delivery-item">
                          <span>{group.business_name}</span>
                          <span>{formatDate(group.delivery_date)}</span>
                          <span>{group.location}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Price and CTA */}
            <div className="price-section">
              <div className="final-price">
                ${product.Price}
              </div>
              
              <button 
                className="add-to-cart"
                onClick={() => setShowCreateGroup(true)}
              >
                Start Group Order
              </button>
              
              <Link to="/" className="product-details-link">
                Back to all products
              </Link>
            </div>
          </div>
        </div>

        {/* Create Group Modal */}
        {showCreateGroup && (
          <div className="modal-overlay" onClick={() => setShowCreateGroup(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Create New Group Order</h2>
              <form onSubmit={handleCreateGroup}>
                <div className="form-group">
                  <label>Business Name</label>
                  <input
                    type="text"
                    value={newGroupData.business_name}
                    onChange={(e) => setNewGroupData({...newGroupData, business_name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Target Quantity (cases)</label>
                  <input
                    type="number"
                    value={newGroupData.target_quantity}
                    onChange={(e) => setNewGroupData({...newGroupData, target_quantity: parseInt(e.target.value)})}
                    min="1"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={newGroupData.location}
                    onChange={(e) => setNewGroupData({...newGroupData, location: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Preferred Delivery Date</label>
                  <input
                    type="date"
                    value={newGroupData.delivery_date}
                    onChange={(e) => setNewGroupData({...newGroupData, delivery_date: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Description (optional)</label>
                  <textarea
                    value={newGroupData.description}
                    onChange={(e) => setNewGroupData({...newGroupData, description: e.target.value})}
                    rows="3"
                  />
                </div>
                
                <div className="form-actions">
                  <button type="button" onClick={() => setShowCreateGroup(false)}>
                    Cancel
                  </button>
                  <button type="submit">Create Group</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}