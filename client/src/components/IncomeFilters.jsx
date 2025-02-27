import React from 'react';

const IncomeFilters = ({ inputSearch, setInputSearch, selectedFilter, setSelectedFilter }) => {
  return (
    <div className="search-container">
      <input 
        type="text" 
        placeholder="Search by title..." 
        value={inputSearch} 
        onChange={({ target }) => setInputSearch(target.value)} 
      />
      {/* Add more filter options as needed */}
    </div>
  );
};

export default IncomeFilters; 