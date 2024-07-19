import React, { useEffect, useState } from 'react';
import './map.css';
import mapboxgl from 'mapbox-gl';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import LayersLogic from './layersLogic.js';
import useDidMountEffect from '../customHooks/customHookMounted.js';  
import LatLngControl from './customControl.js';
import AddFileToMap from './addFileTomap.js';
import * as turf from '@turf/turf';
import AreaControl from './customAreaControl.js';
import FilterControl from './customFilterPerArea.js';
/**
 * Map rendering component.
 *
 * @component
 * @param {Object} props - The component accepts text props.
 * @param {text} props.mapStyle - The map style to be rendered.
 * @param {Function} props.setYearList - The function that sets the year list.
 * @param {Function} props.setlnglatclick - The function that sets the lnglatclick.
 * @param {Function} props.setShowBar - The function that sets the show bar.
 * @param {Function} props.setPopUpview - The function that sets the popup view.
 * @param {Function} props.setPopUpSettings - The function that sets the popup settings.
 * @param {Function} props.setSourceisLoading - The function that sets the source loading state.
 * @param {text} props.inputFile - The file to be added to the map.
 * @param {text} props.mapType - The type of the map.
 * @param {text} props.year - The year to be displayed on the map.
 * @returns {JSX.Element} The rendered map component.
 * @example
 * // Render a map component 
 * <MapComponent mapStyle={mapStyle} setYearList={setYearList} lnglat={lnglat} setShowBar = {setShowBar}  mapType={mapType} year={year} setPopUpview={setPopUpview} setPopUpSettings={setPopUpSettings} />
 * @returns {JSX.Element} The rendered map component.
 *
 * @example
 * // Render a map component with a countryfocus.
 * <Map country='colombia' />
 */
mapboxgl.accessToken = 'pk.eyJ1IjoiYWNtb3JhIiwiYSI6ImNsdHlnbGszMDBpMGUyaG8wMHNzd3NvcTAifQ.Ger587FmqVP5qcFPz7mwqg';

const MapComponent = ({mapStyle,setYearList,lnglat,setlnglatclick,mapType,year, setShowBar,setPopUpview,setPopUpSettings,setSourceisLoading,inputFile}) => {

  const [map, setMap] = useState(null);
  const [currentSource, setCurrentSource] = useState(null);
  const [currentLayers, setCurrentLayers] = useState([]);
  const [filterControl, setFilterControl] = useState(null);
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
      displayControlsDefault: true
      });
    const areaControl = new AreaControl();
    let isControlAdded = false;
    newMap.addControl(new mapboxgl.ScaleControl(),'bottom-right');
    newMap.addControl(draw,'top-right');
    const filterControl = new FilterControl();
    setFilterControl(filterControl);
    newMap.addControl(filterControl, 'top-right');
    newMap.on('draw.create', updateArea);
    newMap.on('draw.delete', updateArea);
    newMap.on('draw.update', updateArea);
    setMap(newMap);
    function updateArea(e) {
      const data = draw.getAll();
      if (data.features.length > 0) {
        // If it is a polygon display the area
        const areas = [];
        const lengths = [];
        data.features.forEach((feature) => {
          if(feature.geometry.type === 'Polygon'){
            const area = turf.area(feature);
            if(!isControlAdded){
              isControlAdded = true;
              newMap.addControl(areaControl, 'bottom-right');
            }
            areas.push(area);
          }else if(feature.geometry.type === 'LineString'){
            const length = turf.length(feature);
            if(!isControlAdded){
              isControlAdded = true;
              newMap.addControl(areaControl, 'bottom-right');
            } 
            lengths.push(length);
          }}
        );
        areaControl.updateArea(areas,lengths);
        filterControl.setDrawnFeatures(data);
      } else {
        // No polygons are drawn
        console.log('No polygons');
        newMap.removeControl(areaControl);
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
  useEffect(() => {
    if (filterControl){
      filterControl.setLayersToFilter(currentLayers);}
  },[currentLayers,filterControl]);
  LayersLogic({setYearList, lnglat, map,mapType, year,currentSource,currentLayers,setShowBar,setPopUpview,setPopUpSettings,setSourceisLoading,setCurrentSource,setCurrentLayers});
  AddFileToMap({inputFile,map,setCurrentSource,setSourceisLoading,setPopUpview,setPopUpSettings})
  return (
      <div id="map" ></div>
  );
};

export default MapComponent;
