import React, { useState } from 'react';
import { Form} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Slidebar.css';

/**
 * Slidebar component using react-bootstrap.
 *
 * @component
 * @param {Object} props - The component accepts onChange, max, min, and step props.
 * @param {Function} props.onChange - The function that handles the change event.
 * @param {Array} yearList - The list of years to be displayed on the slidebar.
 * @returns {JSX.Element} The rendered Slidebar component.
 *
 * @example
 * // Render a slidebar with specific range and steps.
 * <Slidebar onChange={(value) => console.log(value)} yearList={[2000,2003,2006,2009] />
 */
function Slidebar({ onChange, yearList }) {
  const [value, setValue] = useState(0);

  const barMoves = (value) => {
    onChange(value);
    setValue(Number(value)); // Ensure value is treated as a number
  };

  const max = yearList.length - 1;

  return (
    <div className="slidebar bg-light">
      <Form>
      <div className="scale-container">
          {yearList.map((year, index) => (
            <div
              key={index}
              className={`tick ${index === value ? 'selected' : ''}`}
            >
              {year}
            </div>
          ))}
        </div>
        <Form.Range
          min={0}
          max={max}
          step={1}
          value={value}
          onChange={(e) => barMoves(e.target.value)}
        />
      </Form>
    </div>
  );
}

export default Slidebar;