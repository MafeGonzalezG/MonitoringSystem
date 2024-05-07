import React, { useEffect, useState } from 'react';
import './map.css';
import mapboxgl from 'mapbox-gl';
import ApiManager from '../apis/apiCountryManager.js';

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
const MapComponent = ({country}) => {
  const [map, setMap] = useState(null);
  useEffect(() => {
    const getCountry = async () => {
        console.log(country);
        const countryInfo = await ApiManager.fetchInfo(country);
        if (map && countryInfo) {
          const { latlng } = countryInfo;
          map.flyTo({
            center: [latlng[1], latlng[0]],
            zoom: 4,
            speed: 2,
            curve: 1,
            easing(t) {
              return t;
            },
          });
        }
      };
    getCountry();
 }, [country]);
  


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

  return (
      <div id="map" ></div>
  );
};

export default MapComponent;
