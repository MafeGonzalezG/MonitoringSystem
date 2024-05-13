import React, { useEffect, useState } from 'react';
import './map.css';
import mapboxgl from 'mapbox-gl';
import LayersLogic from './layersLogic.js';
import ImageLayer from '@naivemap/mapbox-gl-image-layer';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWNtb3JhIiwiYSI6ImNsdHlnbGszMDBpMGUyaG8wMHNzd3NvcTAifQ.Ger587FmqVP5qcFPz7mwqg';

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
const MapComponent = ({country,mapType}) => {

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
  }, []);

  LayersLogic({map,country,mapType});
  // if(map){
  // const layer = new ImageLayer('layer-id', {
  //   url: 'https://mapas.igac.gov.co/server/services/agrologia/actividadquimicanacional/MapServer/WMSServer?bbox=-4.233935,-81.766815,13.534596,-66.675701&styles=&format=image/png&service=WMS&version=1.3.0&request=GetMap&crs=EPSG:4326&transparent=true&width=256&height=256&layers=0',
  //   projection: 'EPSG:4326',
  //   resampling: 'nearest',
  //   coordinates: [
  //     [105.289838, 32.204171], // top-left-4.233935,-81.766815,13.534596,-66.675701
  //     [110.195632, 32.204171], // top-right
  //     [110.195632, 28.164713], // bottom-right
  //     [105.289838, 28.164713], // bottom-left
  //   ],
  // })
  // map.on('load', function() {
  //   // Now it's safe to add the layer
  //   map.addLayer(layer);
  // });}
  return (
      <div id="map" ></div>
  );
};

export default MapComponent;
