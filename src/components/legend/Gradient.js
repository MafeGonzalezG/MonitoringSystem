import React from 'react';

const GradientBar = ({ colors, labels }) => {
  const gradientColors = colors.join(', ');
  const gradientStyle = {
    width: '100%',
    height: '20px', // Adjust height as needed
    background: `linear-gradient(to right, ${gradientColors})`,
    position: 'relative',
  };

  const labelContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '5px', // Adjust margin as needed
  };

  const labelStyle = {
    fontSize:'clamp(7px, 1vh,50px)'  };

  const colorStops = colors.map((color, index) => {
    const position = `${(index / (colors.length - 1)) * 100}%`;
    return `${color} ${position}`;
  }).join(', ');

  const gradientWithStops = `linear-gradient(to right, ${colorStops})`;

  return (
    <div>
      <div style={gradientStyle}>
        <div style={{ height: '100%', background: gradientWithStops }} />
      </div>
      <div style={labelContainerStyle}>
        {labels.map((label, index) => (
          <span key={index} style={{ ...labelStyle, left: `${(index / (labels.length - 1)) * 100}%` }}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default GradientBar;
