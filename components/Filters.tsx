import { useState } from 'react';

const Filters = () => {
  const [stateFilter, setStateFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleFilter = () => {
    // For now, we simply log the filter values.
    console.log('Filtering by:', { stateFilter, startDate, endDate });
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ marginBottom: '8px' }}>
        <label htmlFor="state">State: </label>
        <select
          id="state"
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="TX">Texas</option>
          <option value="FL">Florida</option>
          <option value="NC">North Carolina</option>
          {/* Add more states as needed */}
        </select>
      </div>
      <div style={{ marginBottom: '8px' }}>
        <label>Start Date: </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: '8px' }}>
        <label>End Date: </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <button onClick={handleFilter}>Apply Filters</button>
    </div>
  );
};

export default Filters; 