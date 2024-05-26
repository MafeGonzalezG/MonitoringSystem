import ApiManager from '../apis/apiCountryManager.js';
import Layers from './layers.js';
import { useEffect,useState} from 'react';
import BiodiversityApiCall from '../apis/biodiversityApi.js';
import apiFires from '../apis/firesApi.js';
import AirQualityMap from '../apis/apiAirQuality.js';
import schoolAPiCall from '../apis/schoolApi.js';
import mapboxgl, { LngLat } from 'mapbox-gl';
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
function LayersLogic({setMax,setMin,setStep,lnglat,map,country,mapType,year,setShowBar}){
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
            setMax(2020);
            setMin(2002);
            setStep(1);
            setShowBar(true);
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
            }else if(map && mapType==='Earthquakes'){
                const layerId = 'Earthquakes';
                checkLayer(map, layerId);
                checkLayer(map, currentLayer);  
                setCurrentLayer(layerId);
                map.addSource(layerId, {
                    'type': 'raster',
                    'tiles': [
                        `http://localhost:8080/geoserver/Sismos/wms?service=WMS&version=1.1.0&request=GetMap&layers=Sismos:5&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG:3857&styles=&format=image/png`
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
        } else if(map && mapType==='Cuencas'){
            const layerId = 'Cuencas';
            checkLayer(map, layerId);
            checkLayer(map, currentLayer);
            setCurrentLayer(layerId);
            map.addSource(layerId, {
                'type': 'raster',
                'tiles': [
                    `http://localhost:8080/geoserver/cuencas/wms?service=WMS&version=1.1.0&request=GetMap&layers=cuencas:cuencas&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG:3857&styles=&format=image/png`
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
            const popup = new mapboxgl.Popup({ closeOnClick: false })
            .setLngLat(latLng)
            .setHTML('<div><img src="https://mapas.igac.gov.co:443/server/services/minasyenergia/cuencassedimentarias2010/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=0" ><div/>')
            .setOffset([250, -190])
            .addTo(map);

        }else if(map && mapType==='Education'){
            const layerId = 'Education';
            setMax(2022);
            setMin(2011);
            setStep(1);
            setShowBar(true);
            checkLayer(map, layerId);
            checkLayer(map, currentLayer);
            setCurrentLayer(layerId);
            schoolAPiCall(year).then((data) => {
                map.addSource(layerId, {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': data.map((school) => ({
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [school.lon, school.lat]
                            },
                            'properties': {
                                'departamento': school.departamento,
                                'tasa_matriculacion_5_16': school.tasa_matriculacion_5_16
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
                            'circle-color': 'blue',
                            'circle-stroke-color': 'black'
                        }
                    },
                    'building' // Place layer under labels, roads and buildings.
                );
                map.on('click', layerId, (e) => {
                    const coordinates = e.features[0].geometry.coordinates.slice();
                    const { departamento, tasa_matriculacion_5_16} = e.features[0].properties;
                    new mapboxgl.Popup()
                        .setLngLat(coordinates)
                        .setHTML(`<h3>${departamento}</h3><p>Tasa de matriculación: ${parseFloat(tasa_matriculacion_5_16)}</p>`)
                        .addTo(map);
                });
            });
        }
    }, [map,mapType,year,latLng,lnglat]); 
      
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