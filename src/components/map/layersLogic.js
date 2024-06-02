import Layers from './layers.js';
import { useEffect, useState, useRef } from 'react';
import BiodiversityApiCall from '../apis/biodiversityApi.js';
import apiFires from '../apis/firesApi.js';
import AirQualityMap from '../apis/apiAirQuality.js';
import schoolAPiCall from '../apis/schoolApi.js';
import mapboxgl from 'mapbox-gl';
import militaryApicall from '../apis/apiMilitaryZones.js';
import resguardosApi from '../apis/apiResguardos.js';
import latestEarthquakes from '../apis/apiLatestEarthquakes.js';

function checkLayer(map, layerId) {
    if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
    }
    if (map.getSource(layerId)) {
        map.removeSource(layerId);
    }
    return;
}

function addLayer_(map, mapType, prev_layer,layerId,type='circle', source=null) {
    checkLayer(map, prev_layer);
    if(source){ 
        map.addSource(layerId,source);
        map.addLayer( {
            'id': layerId,
            'type': type,
            'source': layerId,
            'paint': {}
        },
        'building' // Place layer under labels, roads and buildings.
    );
    }
    else{
        map.addLayer(Layers(mapType, layerId));
    }
    return;
}

function handleApiCall(map,prev_layer, layerId, apiCall, processData, paint = {}, layerType = 'circle') {
    checkLayer(map, prev_layer);
    apiCall().then((data) => {

        const source = {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': processData(data)
            }
        };

        map.addSource(layerId, source);

        map.addLayer({
            'id': layerId,
            'type': layerType,
            'source': layerId,
            'paint': paint
        },
        'building'
    );
        
    }  
    );
    return;
}

function LayersLogic({
    setMax, setMin, setStep, lnglat, lnglatclick, map, country, mapType, year, setShowBar
}) {
    const [currentLayer, setCurrentLayer] = useState('');
    const [latLng, setLatLng] = useState([0, 0]);
    const prevYearRef = useRef();
    
    useEffect(() => {
        if (!map) return;

        const layerId = mapType.replace(/\s/g, '').toLowerCase();

        switch (mapType) {
            case 'Precipitation':
            case 'Clouds':
            case 'Temperature':
            case 'Pressure':
            case 'Wind':
                addLayer_(map, mapType, currentLayer,layerId);
                setCurrentLayer(layerId);
                break;
            case 'Biodiversity':
                handleApiCall(map, currentLayer,layerId, BiodiversityApiCall, data => data);
                setCurrentLayer(layerId);
                break;
            case 'Deforestation':
                setMax(2020);
                setMin(2002);
                setStep(1);
                setShowBar(true);
                addLayer_(map, mapType,currentLayer, layerId,'raster', {
                    'type': 'raster',
                    'tiles': [
                        `http://localhost:8080/geoserver/forest/wms?service=WMS&version=1.1.0&request=GetMap&layers=forest:${year}&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG:3857&styles=&format=image/png`
                    ],
                    'tileSize': 256
                });
                setCurrentLayer(layerId);
                break;
            case 'Earthquakes':
                addLayer_(map,mapType,currentLayer, layerId, 'raster',{
                    'type': 'raster',
                    'tiles': [
                        `http://localhost:8080/geoserver/Sismos/wms?service=WMS&version=1.1.0&request=GetMap&layers=Sismos:5&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG:3857&styles=&format=image/png`
                    ],
                    'tileSize': 256
                });
                setCurrentLayer(layerId);
                break;
            case 'Fires':
                handleApiCall(map,currentLayer ,layerId, apiFires, data => data.map(coords => ({
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': coords
                    }
                })), {
                    'circle-radius': 5,
                    'circle-stroke-width': 1,
                    'circle-color': 'orange',
                    'circle-stroke-color': 'red'
                });
                setCurrentLayer(layerId);
                break;
            case 'Air Quality':
                checkLayer(map, currentLayer);
                AirQualityMap(latLng[0], latLng[1]).then((data) => {
                    const popup = new mapboxgl.Popup({ offset: 10 }).setHTML(`
                        <p>CO: ${data.list[0].components.co}</p>
                        <p>NO: ${data.list[0].components.no}</p>
                        <p>NO2: ${data.list[0].components.no2}</p>
                        <p>O3: ${data.list[0].components.o3}</p>
                    `);
                    new mapboxgl.Marker().setLngLat(latLng).setPopup(popup).addTo(map);
                });
                setCurrentLayer(layerId);
                break;
            case 'Cuencas':
                addLayer_(map, mapType,currentLayer, layerId,'raster', {
                    'type': 'raster',
                    'tiles': [
                        `http://localhost:8080/geoserver/cuencas/wms?service=WMS&version=1.1.0&request=GetMap&layers=cuencas:cuencas&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG:3857&styles=&format=image/png`
                    ],
                    'tileSize': 256
                });
                new mapboxgl.Popup({ closeOnClick: false })
                    .setLngLat(latLng)
                    .setHTML('<div><img src="https://mapas.igac.gov.co:443/server/services/minasyenergia/cuencassedimentarias2010/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=0" ><div/>')
                    .setOffset([250, -190])
                    .addTo(map);
                setCurrentLayer(layerId);
                break;
            case 'Education':
                setMax(2022);
                setMin(2011);
                setStep(1);
                setShowBar(true);
                handleApiCall(map, currentLayer,layerId, schoolAPiCall, data => data.map(school => ({
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [school.lon, school.lat]
                    },
                    'properties': {
                        'departamento': school.departamento,
                        'tasa_matriculacion_5_16': school.tasa_matriculacion_5_16,
                        'ano': school.ano
                    }
                })), {
                    'circle-radius': 5,
                    'circle-stroke-width': 1,
                    'circle-color': 'blue',
                    'circle-stroke-color': 'black'
                });
                setCurrentLayer(layerId);

                map.setFilter(layerId, ['==', ['string', ['get', 'ano']], String(year)]);
                map.on('click', layerId, (e) => {
                    const coordinates = e.features[0].geometry.coordinates.slice();
                    const { departamento, tasa_matriculacion_5_16 } = e.features[0].properties;
                    new mapboxgl.Popup()
                        .setLngLat(coordinates)
                        .setHTML(`<h3>${departamento}</h3><p>Tasa de matriculación: ${parseFloat(tasa_matriculacion_5_16)}</p>`)
                        .addTo(map);
                });
                break;
            case 'Events':
                addLayer_(map, mapType, currentLayer,layerId,'circle', {
                    'type': 'geojson',
                    'data': 'https://eonet.gsfc.nasa.gov/api/v3/events/geojson?&days=20'
                });
                setCurrentLayer(layerId);
                map.on('click', layerId, (e) => {
                    const coordinates = e.features[0].geometry.coordinates.slice();
                    const { title, date, magnitudeValue, magnitudeUnit } = e.features[0].properties;
                    new mapboxgl.Popup()
                        .setLngLat(coordinates)
                        .setHTML(`<h3>${title}</h3><p>Fecha: ${date}  Magnitud: ${magnitudeValue ? `${magnitudeValue}${magnitudeUnit}` : ''}</p>`)
                        .addTo(map);
                });
                break;
            case 'Military Zones':
                handleApiCall(map, currentLayer,layerId, militaryApicall, data => data, {
                    'circle-radius': 5,
                    'circle-stroke-width': 1,
                    'circle-color': 'green',
                    'circle-stroke-color': 'black'
                });
                setCurrentLayer(layerId);
                map.on('click', layerId, (e) => {
                    const properties = e.features[0].properties;
                    const popupContent = Object.entries(properties).map(([key, value]) => {
                        if (key === 'zone') {
                            return `<h3>Zona ${value}</h3>`;
                        } else {
                            return `<p style="margin: 0;">${key}: ${value}</p>`;
                        }
                    }).join('');
                    new mapboxgl.Popup()
                        .setLngLat(e.lngLat)
                        .setHTML(popupContent)
                        .addTo(map);
                });
                break;
            case 'Communities':
                handleApiCall(map,currentLayer, layerId, resguardosApi, data => data, {
                    'circle-radius': 5,
                    'circle-stroke-width': 1,
                    'circle-color': 'green',
                    'circle-stroke-color': 'black'
                });
                map.on('click', layerId, (e) => {
                    const properties = e.features[0].properties;
                    const popupContent = Object.entries(properties).map(([key, value]) => {
                        if (key === 'comunidad') {
                            return `<h3>Zona ${value}</h3>`;
                        } else {
                            return `<p style="margin: 0;">${key}: ${value}</p>`;
                        }
                    }).join('');
                    new mapboxgl.Popup()
                        .setLngLat(e.lngLat)
                        .setHTML(popupContent)
                        .addTo(map);
                });
                setCurrentLayer(layerId);
                break;
            case 'Latest Earthquakes':
                handleApiCall(map,currentLayer, layerId, latestEarthquakes, data => data, {
                    'circle-radius': 5,
                    'circle-stroke-width': 1,
                    'circle-color': 'red',
                    'circle-stroke-color': 'black'
                });
                map.on('click', layerId, (e) => {
                    const properties = e.features[0].properties;
                    const popupContent = Object.entries(properties).map(([key, value]) => {
                        if (key === 'comunidad') {
                            return `<h3>Zona ${value}</h3>`;
                        } else {
                            return `<p style="margin: 0;">${key}: ${value}</p>`;
                        }
                    }).join('');
                    new mapboxgl.Popup()
                        .setLngLat(e.lngLat)
                        .setHTML(popupContent)
                        .addTo(map);
                });
                setCurrentLayer(layerId);
                break;
            default:
                break;
        }
    }, [map, mapType, year, latLng]);
    useEffect(() => {
        if (map && lnglat) {
            map.flyTo({
                center: lnglat,
                zoom: 4,
                speed: 2,
                curve: 1,
                easing(t) {
                return t;
                },
            });
        }
 }, [lnglat]);
    useEffect(() => {
        if (!map) return;
        const handleMapClick = (e) => setLatLng(e.lngLat.toArray());
        map.on('click', handleMapClick);
        return () => map.off('click', handleMapClick);
    }, [map]);

    return null;
}

export default LayersLogic;
