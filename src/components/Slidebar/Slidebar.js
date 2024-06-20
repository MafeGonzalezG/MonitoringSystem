import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Slidebar.css';

// const years_longer = [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022];
// const years = [2002, 2007, 2012, 2014, 2016, 2018, 2020, 2021, 2022];

/**
 * Slidebar component using react-bootstrap.
 *
 * @component
 * @param {Object} props - The component accepts onChange, max, min, and step props.
 * @param {function} props.onChange - The change event handler.
 * @param {number} props.max - The maximum value of the range.
 * @param {number} props.min - The minimum value of the range.
 * @param {number} props.step - The step value of the range.
 * @returns {JSX.Element} The rendered Slidebar component.
 *
 * @example
 * // Render a slidebar with specific range and steps.
 * <Slidebar onChange={(value) => console.log(value)} max={10} min={0} step={1} />
 */
function Slidebar({ onChange, max, min, step }) {
  const [value, setValue] = useState(0);

  const barMoves = (value) => {
      onChange(value);
      setValue(value);

  };

  return (
    <div className="slidebar">
      <Form.Label>Timeline</Form.Label>
      <Form.Range
        min={0}
        max={max}
        step={1}
        onChange={(e) => barMoves(e.target.value)}
      />
      <div>Value: {value}</div>
    </div>
  );
}

export default Slidebar;
