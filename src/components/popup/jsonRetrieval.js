import React, { useState } from 'react';
async function getJson(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }


const JsonParserLegend = ({ urljson,metadataObj }) => {

    const [legend, setLegend] = useState([]);
    getJson(urljson).then((data) => {
      console.log(data.layers)
      for(let layer of data.layers){
        if (layer.layerId === metadataObj.item){
          setLegend(layer.legend);
      }}
    }).catch((error) => {
        console.error('Error:', error);
        return null;
    });
    return (
        <div>
            {legend.map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
                    <img
                        src={`data:${item.contentType};base64,${item.imageData}`}
                        alt={item.label || 'Legend Image'}
                        height={item.height}
                        width={item.width}
                    />
                    <p>{item.label || ''}</p>
                </div>
            ))}
        </div>
    );
  };

export default JsonParserLegend;