import React, { useState } from 'react'
import '../styles/Filter.css'
import { ListFilterPlus, Trash2 } from 'lucide-react'
import { FilterModal } from './FilterModal';
import { useEffect } from 'react';

export const Filters = ({inputSearch,setInputSearch,selectedFilter,setSelectedFilter,maxAmount}) => {
  const MIN_BOUND = 0;
  const MAX_BOUND = maxAmount;
  const[isFilterModalOpen,setIsFilterModalOpen] = useState(false);
  const[rangeValue,setRangeValue] = useState([MIN_BOUND,MAX_BOUND]);
  useEffect(() => {
    setRangeValue([MIN_BOUND,maxAmount]);
  }, [maxAmount]);
  const handleFilterSelect =(option) =>{
    setSelectedFilter(option)
    setIsFilterModalOpen(false);
  };
  const handleClearFilter =() =>{
    setSelectedFilter(null);
    setRangeValue([MIN_BOUND,MAX_BOUND]);
  };
  return (
    <>
    <div className="search-container">
    <input 
      type="text" 
      placeholder="Search.." 
      value={inputSearch} 
      onChange={({ target }) => setInputSearch(target.value)} // Corrected here
    />
    <button onClick={() => setIsFilterModalOpen(true)}>
      <ListFilterPlus />
    </button>
  </div>

  <FilterModal
  isOpen={isFilterModalOpen}
  onClose={() => setIsFilterModalOpen(false)}
  onFilterSelect={handleFilterSelect}
  rangeValue={rangeValue}
  setRangeValue={setRangeValue}
  MIN_BOUND={MIN_BOUND}
  MAX_BOUND={MAX_BOUND}
  
  />
  {selectedFilter && (

    <div className="selected-filter">
      <span className='filter-label'>Filter: Min: {selectedFilter.min} - Max: {selectedFilter.max}</span>
      <Trash2 onClick={handleClearFilter} className='clear-filter-icon'></Trash2>
    </div>
  )}
  </>
  )
}
