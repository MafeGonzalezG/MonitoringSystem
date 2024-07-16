import React, { useEffect, useState } from 'react';
import './map.css';
import mapboxgl from 'mapbox-gl';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import LayersLogic from './layersLogic.js';
import useDidMountEffect from '../customHooks/customHookMounted.js';  
import LatLngControl from './customControl.js';
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

const MapComponent = ({mapStyle,setYearList,lnglat,setlnglatclick,mapType,year, setShowBar,setPopUpview,setPopUpSettings,setSourceisLoading,inputFile}) => {

  const [map, setMap] = useState(null);
  const initializeMap = () => {
    const newMap = new mapboxgl.Map({
        container: 'map', // container ID
        center: [-73.5,5.5],
        style: 'mapbox://styles/mapbox/outdoors-v12', // starting position [lng, lat]
        zoom: 4, // starting zoom
    });
    newMap.addControl(new mapboxgl.NavigationControl(),'top-right');
    newMap.addControl(new mapboxgl.FullscreenControl(),'top-right');
    newMap.addControl(new LatLngControl(),'bottom-right');
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
          polygon: true,
          trash: true
      }
      });
    newMap.addControl(draw,'top-right');
    newMap.addControl(new mapboxgl.ScaleControl(),'bottom-right');
    newMap.on('draw.create', updateArea);
    newMap.on('draw.delete', updateArea);
    newMap.on('draw.update', updateArea);
    setMap(newMap);
    function updateArea(e) {
      const data = draw.getAll();
      if (data.features.length > 0) {
        // Do something with the drawn polygon data
        console.log('Polygon data:', data);
      } else {
        // No polygons are drawn
        console.log('No polygons');
      }
    }
  };
  
  useEffect(() => {
    initializeMap();
  },[]);
  // if(map){map.on('click', (e) => {
  //     // const lnglat = JSON.stringify(e.lngLat.wrap());
  //     // console.log(lnglat);
  //     // setlnglatclick([e.lngLat.lng,e.lngLat.lat]);
      
  //     console.log(elevation);
  //     console.log(e.lngLat.lng,e.lngLat.lat);

  //   });
  // }
  useDidMountEffect(() => {
    console.log('mapstyle',mapStyle);
    if(map){
      map.setStyle('mapbox://styles/mapbox/' + mapStyle);
    }
  },[mapStyle]);
  LayersLogic({setYearList, lnglat, map,mapType, year, setShowBar,setPopUpview,setPopUpSettings,setSourceisLoading,inputFile});
  return (
      <div id="map" ></div>
  );
};

export default MapComponent;
