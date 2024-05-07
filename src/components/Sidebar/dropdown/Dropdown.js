import React, { useState } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
const Dropdown = ({ options, defaultText }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="dropdown">
      <button className="btn btn-secondary btn-sm dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
        {selectedOption ? selectedOption : defaultText}
      </button>
      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        {options.map((option, index) => (
          <li key={index}>
            <a className="dropdown-item" href="#" onClick={() => handleOptionSelect(option)}>
              {option}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
