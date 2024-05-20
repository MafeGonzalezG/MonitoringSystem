import ApiManager from '../apis/apiCountryManager.js';
import Layers from './layers.js';
import { useEffect,useState} from 'react';
import BiodiversityApiCall from '../apis/biodiversityApi.js';
import apiFires from '../apis/firesApi.js';
import AirQualityMap from '../apis/apiAirQuality.js';
import mapboxgl from 'mapbox-gl';
function checkLayer(map, layerId) {
    if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
        map.removeSource(layerId);
    }
}
function moveMap( countryInfo, map){
    
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
    return latlng;
}
function LayersLogic({map,country,mapType,year}){
    const [currentLayer,setCurrentLayer] = useState('');
    const [latLng, setLatLng] = useState([]);
    useEffect(() => {
        if (map && mapType === 'Precipitation') {
            const layerId = 'Precipitation';
            checkLayer(map, layerId);
            checkLayer(map, currentLayer);
            setCurrentLayer(layerId);
            map.addLayer(Layers(mapType,layerId));
        } else if (map && mapType === 'Clouds'){
            const layerId = 'Clouds';
            checkLayer(map, layerId);
            checkLayer(map, currentLayer);  
            map.addLayer(Layers(mapType,layerId));
        }else if (map && mapType === 'Temperature'){
            const layerId = 'Temperature';
            checkLayer(map, layerId);
            checkLayer(map, currentLayer);  
            setCurrentLayer(layerId);
            map.addLayer(Layers(mapType,layerId));
        }else if (map && mapType === 'Pressure'){
            const layerId = 'Pressure';
            checkLayer(map, layerId);
            checkLayer(map, currentLayer);  
            setCurrentLayer(layerId);
            map.addLayer(Layers(mapType,layerId));
        }
        else if (map && mapType === 'Wind'){
            const layerId = 'Wind';
            checkLayer(map, layerId);
            checkLayer(map, currentLayer);  
            setCurrentLayer(layerId);
            map.addLayer(Layers(mapType,layerId));
        }
        else if (map && mapType === 'Biodiversity'){
            const layerId = 'Biodiversity';
            BiodiversityApiCall().then((data) => {
                console.log(data);
            }
            );}
        else if(map && mapType==='Deforestation'){
            const layerId = 'Deforestation';
            checkLayer(map, layerId);
            checkLayer(map, currentLayer);  
            setCurrentLayer(layerId);
            map.addSource(layerId, {
                'type': 'raster',
                'tiles': [
                    `http://localhost:8080/geoserver/forest/wms?service=WMS&version=1.1.0&request=GetMap&layers=forest:${year}&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG:3857&styles=&format=image/png`
                ],
                'tileSize': 256
            });
            map.addLayer(
                {
                    'id': layerId,
                    'type': 'raster',
                    'source': layerId,
                    'paint': {}
                },
                'building' // Place layer under labels, roads and buildings.
            );
            }
        else if(map && mapType==='Fires'){
            const layerId = 'Fires';
            checkLayer(map, layerId);
            checkLayer(map, currentLayer);
            setCurrentLayer(layerId);
            apiFires().then((data) => {
                // console.log(data);
                map.addSource(layerId, {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': data.map((coordinates) => ({
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': coordinates
                            }
                        }))
                    }
                });
                map.addLayer(
                    {
                        'id': layerId,
                        'type': 'circle',
                        'source': layerId,
                        'paint': {
                            'circle-radius': 5,
                            'circle-stroke-width': 1,
                            'circle-color': 'orange',
                            'circle-stroke-color': 'red'
                        }
                    },
                    'building' // Place layer under labels, roads and buildings.
                );
            });
        }
        else if (map && mapType === 'Air Quality'){
            const layerId = 'AirQuality';
            checkLayer(map, layerId);
            checkLayer(map, currentLayer);
            setCurrentLayer(layerId);
            AirQualityMap(latLng[0],latLng[1]).then((data) => {
            console.log(data);
            const popup = new mapboxgl.Popup({ offset: 10 }).setHTML(`<p>CO:${data.list[0].components.co}
            <p>NO:${data.list[0].components.no}
            <p>NO2:${data.list[0].components.no2}
            <p>O3:${data.list[0].components.o3}
            `);  
            // <p>SO2:${data.list[0].components.so2}
            // <p>PM2.5:${data.list[0].components.pm2_5}
            // <p>PM10:${data.list[0].components.pm10}
            // <p>NH3:${data.list[0].components.nh3}</p>
            const marker1 = new mapboxgl.Marker()
            .setLngLat(latLng)
            .setPopup(popup) 
            .addTo(map);
            console.log(latLng);});
        }
    }, [map,mapType,year,latLng]); 
      
    useEffect(() => {
        const getCountry = async () => {
            const countryInfo = await ApiManager.fetchInfo(country);
            if (map && countryInfo) {
              const latlng = await moveMap(countryInfo, map);
              setLatLng([latlng[1],latlng[0]]);
            }
          };
        getCountry();
     }, [country]);
    }
export default LayersLogic;