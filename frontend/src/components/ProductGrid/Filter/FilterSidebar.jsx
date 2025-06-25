import React from 'react';
import './FilterSidebar.css';

const FilterSidebar = () => {
  return (
    <div className="filter-sidebar">
      <div className="filter-group">
        <h3>Filters</h3>
        <p>Taste</p>
        <label><input type="checkbox" /> Sweet</label>
        <label><input type="checkbox" /> Sour</label>
        <label><input type="checkbox" /> Bitter</label>
        <label><input type="checkbox" /> Fruity</label>
        <button className="clear-btn">Clear</button>
      </div>
    </div>
  );
};

export default FilterSidebar;