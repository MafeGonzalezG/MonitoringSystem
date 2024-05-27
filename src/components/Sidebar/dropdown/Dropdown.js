import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * Dropdown component using react-bootstrap.
 *
 * @component
 * @param {Object} props - The component accepts options, defaultText, and onChange props.
 * @param {Array} props.options - The dropdown options.
 * @param {string} props.defaultText - The default text to display.
 * @param {function} props.onChange - The change event handler.
 * @returns {JSX.Element} The rendered Dropdown component.
 *
 * @example
 * // Render a dropdown with options and a default text.
 * <Dropdown options={['Option 1', 'Option 2']} defaultText="Select an option" onChange={(option) => console.log(option)} />
 */
const CustomDropdown = ({ options, defaultText, onChange }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    onChange(option);
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="secondary" size="sm" id="dropdown-basic">
        {selectedOption ? selectedOption : defaultText}
      </Dropdown.Toggle>

      <Dropdown.Menu>
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
