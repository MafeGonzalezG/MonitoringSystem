import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dropdown.css';
/**
 * A custom dropdown component using react-bootstrap.
 * @component
 * @param {Object} props - The component props.
 * @param {Array} props.options - The list of options to be displayed in the dropdown.
 * @param {string} props.defaultText - The default text to be displayed in the dropdown.
 * @param {Function} props.onChange - The function that handles the change event.
 * @param {boolean} props.isSelected - A boolean that determines whether an option is selected.
 * @param {Array} props.disabledOptions - The list of options to be disabled.
 * @returns {JSX.Element} - The Dropdown component
 * @example
 * <CustomDropdown
 *  options={['Option 1', 'Option 2', 'Option 3']}
 * defaultText='Select an option'
 * onChange={(option) => console.log(option)}
 * isSelected={false}
 * disabledOptions={['Option 2']}
 * />
 */
const CustomDropdown = ({ options, defaultText, onChange, isSelected, disabledOptions = [] }) => {
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
            onClick={() => !disabledOptions.includes(option) && handleOptionSelect(option)}
            disabled={disabledOptions.includes(option)}
          >
            {option}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default CustomDropdown;
