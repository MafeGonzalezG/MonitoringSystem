import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import "./buttonchangemap.css"
import 'bootstrap/dist/css/bootstrap.min.css';
/**
 * A button that cycles through colors when clicked.
 * @param {object} props - The component's props.
 * @param {Function} props.onpressMap - A function that changes the map.
 * @returns {JSX.Element} - The component
 */
function ColorCycleButton ({onpressMap}) {
  const colors = ['success','secondary', 'primary', 'danger']; // Bootstrap color variants
  const maps = ['outdoors-v12','light-v11', 'satellite-v9', 'navigation-night-v1']; // Bootstrap color variants
  const [colorIndex, setColorIndex] = useState(0);
  const handleClick = () => {
    setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    
  };
  useEffect(() => {
    onpressMap(maps[colorIndex]);
    }, [colorIndex]);
  let iconUrl = 'https://img.icons8.com/FFFFFF/345/map-marker'; // Image URL
  return (
    <Button  variant={colors[colorIndex]} onClick={handleClick}>
      {iconUrl && <img src={iconUrl} alt="icon" style={{ marginRight: '8px' ,width:'2.5vw'}} />} {/* Render the image if iconUrl is provided */}
      {/* Click me */}
    </Button>
  );
};

export default ColorCycleButton;
