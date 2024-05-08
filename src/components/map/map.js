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
const MapComponent = ({country,mapType}) => {
  const [map, setMap] = useState(null);
  useEffect(() => {
    if (mapType === 'Meteorology') {
        const layerId = 'weatherLayer';
        // First, check if the layer already exists and remove it if it does
        if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
            map.removeSource(layerId);
        }

        // Add the layer with weather data
        map.addLayer({
            'id': layerId,
            'type': 'raster',
            'source': {
                'type': 'raster',
                'tiles': [
                    'https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=81951b48765f92b240133d040298e4e9' // Ensure you replace this with your actual API key
                ],
                'tileSize': 256
            },
            'paint': {
                // Add custom styling if necessary
            }
        });
    }
}, [mapType]); // Depend on map and mapType
  
  useEffect(() => {
    const getCountry = async () => {
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
