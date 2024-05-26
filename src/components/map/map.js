import React, { useEffect, useState } from 'react';
import './map.css';
import mapboxgl from 'mapbox-gl';
import LayersLogic from './layersLogic.js';

/**
 * Map rendering component.
 *
 * @component
 * @param {Object} props - The component accepts text props.
 * @param {text} props.country - The name of the country to focus on the map.
 * @returns {JSX.Element} The rendered map component.
 *
 * @example
 * // Render a map component with a countryfocus.
 * <Map country='colombia' />
 */
mapboxgl.accessToken = 'pk.eyJ1IjoiYWNtb3JhIiwiYSI6ImNsdHlnbGszMDBpMGUyaG8wMHNzd3NvcTAifQ.Ger587FmqVP5qcFPz7mwqg';

const MapComponent = ({setMax,setMin,setStep,lnglat,setlnglat,country,mapType,year, setShowBar}) => {

  const [map, setMap] = useState(null);
  

  const initializeMap = () => {
    const newMap = new mapboxgl.Map({
        container: 'map', // container ID
        center: [-74.5, 40],
        style: 'mapbox://styles/mapbox/light-v11', // starting position [lng, lat]
        zoom: 9, // starting zoom
    });
    setMap(newMap);
  };
 
  useEffect(() => {
    initializeMap();
  },[]);
  if(map && mapType === 'Deforestation'){
    setShowBar(true);
  }
  if(map){map.on('click', (e) => {
      // const lnglat = JSON.stringify(e.lngLat.wrap());
      // console.log(lnglat);
      setlnglat([e.lngLat.lng,e.lngLat.lat]);
      console.log(e.lngLat.lng,e.lngLat.lat);
    });
  }
  LayersLogic({setMax,setMin,setStep,lnglat,map,country,mapType,year, setShowBar});
  return (
      <div id="map" ></div>
  );
};

export default MapComponent;
