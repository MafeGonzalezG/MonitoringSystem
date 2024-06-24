import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dropdown.css';

const CustomDropdown = ({ options, defaultText, onChange, isSelected }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (!isSelected) {
      setSelectedOption(null);
    }
  }, [isSelected]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    onChange(option);
  };

  return (
    <Dropdown className="custom-dropdown">
      <Dropdown.Toggle className="custom-dropdown-toggle" variant="secondary" size="sm" id="dropdown-basic">
        {selectedOption ? selectedOption : defaultText}
      </Dropdown.Toggle>

      <Dropdown.Menu className='custom-dropdown-menu'>
        {options.map((option, index) => (
          <Dropdown.Item
            key={index}
            onClick={() => handleOptionSelect(option)}
          >
            {option}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default CustomDropdown;
