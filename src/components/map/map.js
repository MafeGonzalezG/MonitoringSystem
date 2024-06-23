import React, { useEffect, useState } from 'react';
import './map.css';
import mapboxgl from 'mapbox-gl';
import LayersLogic from './layersLogic.js';
import useDidMountEffect from '../customHooks/customHookMounted.js';
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

const MapComponent = ({mapStyle,setMax,lnglat,setlnglatclick,mapType,year, setShowBar,setPopUpview,setPopUpSettings}) => {

  const [map, setMap] = useState(null);
  

  const initializeMap = () => {
    const newMap = new mapboxgl.Map({
        container: 'map', // container ID
        center: [-73.5,5.5],
        style: 'mapbox://styles/mapbox/outdoors-v12', // starting position [lng, lat]
        zoom: 4, // starting zoom
    });
    setMap(newMap);
  };
 
  useEffect(() => {
    initializeMap();
  },[]);
  if(map){map.on('click', (e) => {
      // const lnglat = JSON.stringify(e.lngLat.wrap());
      // console.log(lnglat);
      setlnglatclick([e.lngLat.lng,e.lngLat.lat]);
      console.log(e.lngLat.lng,e.lngLat.lat);
    });
  }
  useDidMountEffect(() => {
    console.log('mapstyle',mapStyle);
    if(map){
      map.setStyle('mapbox://styles/mapbox/' + mapStyle);
    }
  },[mapStyle]);
  LayersLogic({setMax, lnglat, map,mapType, year, setShowBar,setPopUpview,setPopUpSettings});
  return (
      <div id="map" ></div>
  );
};

export default MapComponent;
