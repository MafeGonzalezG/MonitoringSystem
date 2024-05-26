import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function ColorCycleButton ({onpressMap}) {
  const colors = ['secondary', 'success', 'primary', 'danger']; // Bootstrap color variants
  const maps = ['light-v11', 'outdoors-v12', 'satellite-v9', 'navigation-night-v1']; // Bootstrap color variants
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
      {iconUrl && <img src={iconUrl} alt="icon" style={{ marginRight: '8px' ,width:'24px'}} />} {/* Render the image if iconUrl is provided */}
      {/* Click me */}
    </Button>
  );
};

export default ColorCycleButton;
