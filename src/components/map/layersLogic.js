import Layers from './layers.js';
import { useEffect, useState, useRef } from 'react';
import BiodiversityApiCall from '../apis/biodiversityApi.js';
import apiFires from '../apis/firesApi.js';
import AirQualityMap from '../apis/apiAirQuality.js';
import schoolAPiCall from '../apis/schoolApi.js';
import mapboxgl from 'mapbox-gl';
import militaryApicall from '../apis/apiWaterQuality.js';
import resguardosApi from '../apis/apiResguardos.js';
import apiWaterQuality from '../apis/apiWaterQuality.js';
import getLocations from '../apis/hardCodedResguardos.js';
import apiTempIdeam from '../apis/apiTempIDEAM.js';
import { stat } from 'fs';
function checkLayer(map, layerId) {
    if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
    }
    if (map.getSource(layerId)) {
        map.removeSource(layerId);
    }
    return;
}
async function fetchWmsMetadata(url) {
    const response = await fetch(url);
    const xml = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    const layerQueryable = xmlDoc.querySelector('Layer[queryable="1"]');

    // Check if the layer was found
    if (layerQueryable) {
        // Access the title and abstract
        const title = layerQueryable.querySelector('Title').textContent;
        const abstract = layerQueryable.querySelector('Abstract').textContent;
        // Access the LegendURL
        const legendURL = layerQueryable.querySelector('Style > LegendURL > OnlineResource').getAttribute('xlink:href');

        console.log('Title:', title);
        console.log('Legend URL:', legendURL);
        console.log('Abstract:', abstract);
        return { title,abstract, legendURL};
    } else {
        console.error('Layer with queryable="1" not found');
    }
    
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
    setMax, setMin, setStep, lnglat,setlnglat, lnglatclick, map, country, mapType, year, setShowBar
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
                setlnglat([-73.5,10.5]);
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
            
            case 'Cuencas':
                setlnglat([-73.5,10.5]);
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
                setlnglat([-73.5,10.5]);
                setMax(12);
                setMin(0);
                setStep(1);
                const years_school = [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022];
                setShowBar(true);
                handleApiCall(map, currentLayer,layerId, schoolAPiCall, data => data.filter(school=>school.ano==years_school[year]).map(school => ({
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
                
                map.on('click', layerId, (e) => {
                    const coordinates = e.features[0].geometry.coordinates.slice();
                    const { departamento, tasa_matriculacion_5_16 } = e.features[0].properties;
                    new mapboxgl.Popup()
                        .setLngLat(coordinates)
                        .setHTML(`<h3>${departamento}</h3><p>Tasa de matriculación: ${parseFloat(tasa_matriculacion_5_16)}</p>`)
                        .addTo(map);
                });
                setCurrentLayer(layerId);

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
                setlnglat([-73.5,10.5]);
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
                setlnglat([-73.5,10.5]);
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
            case 'Fallas':
                setlnglat([-73.5,10.5]);
                checkLayer(map, currentLayer);
                setCurrentLayer(layerId);
                map.addSource(layerId, {
                    'type': 'geojson',
                    'data': 'https://services1.arcgis.com/Og2nrTKe5bptW02d/arcgis/rest/services/MAPAGEOLOGIA/FeatureServer/1/query?where=1%3D1&outFields=*&outSR=4326&f=geojson'
                });
                map.addLayer(
                    {
                        'id': layerId,
                        'type': 'line',
                        'source': layerId,
                        'paint': {
                            'line-color': 'red',
                            'line-width': 2
                        }
                    },
                    'building' // Place layer under labels, roads and buildings.
                );
                break;
            case 'Water Quality':
                setlnglat([-73.5,10.5]);
                setMax(4);
                setMin(0);
                setStep(1);
                const years_water = [2018, 2019, 2020, 2021];
                setShowBar(true);
                handleApiCall(map, currentLayer,layerId, apiWaterQuality, data => data, {
                    'circle-radius': 5,
                    'circle-stroke-width': 1,
                    'circle-color': 'blue',
                    'circle-stroke-color': 'black'
                });
                map.setFilter(layerId, ['==', ['string', ['get', 'ano']], String(years_water[year])]);
                map.on('click', layerId, (e) => {
                    const properties = e.features[0].properties;
                    const popupContent = Object.entries(properties).map(([key, value]) => {
                        if (key === 'departamento') {
                            return;
                        } else {
                            return `<p style="margin: 0;">${key}: ${value}</p>`;
                        }
                    }).join('');
                    new mapboxgl.Popup()
                        .setLngLat(e.lngLat)
                        .setHTML(`<h3>Departamento ${properties.departamento}</h3>`+popupContent)
                        .addTo(map);
                });
                setCurrentLayer(layerId);
            case 'Agricultura Familiar':
                setlnglat([-73.5,10.5]);
                addLayer_(map, mapType, currentLayer,layerId,'raster', {
                    'type': 'raster',
                    'tiles': [
                        `https://geoservicios.upra.gov.co/arcgis/services/uso_suelo_rural/areas_probables_agricultura_familiar/MapServer/WMSServer?request=GetMap&service=WMS&bbox={bbox-epsg-3857}&styles=&format=image/png&width=265&height=256&layers=0&version=1.1.0&srs=EPSG:3857`
                    ],
                    'tileSize': 256
                });
                setCurrentLayer(layerId);
                break;
            case 'Amenza Hidrica Arroz':
                setlnglat([-74.796387,10.963889]);
                fetchWmsMetadata('http://localhost:8080/geoserver/LU/wms?request=GetCapabilities&layers=LU:amenaza_hidrico_arroz').then(metadata => {
                    const title = metadata.title;
                    const abstract = metadata.abstract;
                    console.log('Title:', title);
                    console.log('Abstract:', abstract);
                    const popup = new mapboxgl.Popup({ closeOnClick: false })
                    .setLngLat(lnglat)
                    .setHTML(`<b>${title}</b><p>${abstract}</p>`)
                    .addTo(map);
                });

                
                addLayer_(map, mapType, currentLayer,layerId,'raster', {
                    'type': 'raster',
                    'tiles': [
                        `http://localhost:8080/geoserver/LU/wms?service=WMS&version=1.1.0&request=GetMap&layers=LU:amenaza_hidrico_arroz&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG:3857&styles=&format=image/png`
                    ],
                    'tileSize': 256
                });
                
                setCurrentLayer(layerId);
                break;
            case 'Acuiferos Cesar':
                    setlnglat([-73.5,10.5]);
                    fetchWmsMetadata('https://geoservicios.upra.gov.co/arcgis/services/adecuacion_tierras_rurales/acuiferos_cesar/MapServer/WMSServer?request=GetCapabilities&service=WMS').then(metadata => {
                        const title = metadata.title;
                        const abstract = metadata.abstract;
                        console.log('Title:', title);
                        console.log('Abstract:', abstract);
                        const popup = new mapboxgl.Popup({ closeOnClick: false })
                        .setLngLat([-73.5,10.5])
                        .setHTML(`<b>${title}</b><p>${abstract}</p>`)
                        .addTo(map);
                    });
                    addLayer_(map, mapType, currentLayer,layerId,'raster', {
                        'type': 'raster',
                        'tiles': [
                            `https://geoservicios.upra.gov.co/arcgis/services/adecuacion_tierras_rurales/acuiferos_cesar/MapServer/WMSServer?request=GetMap&service=WMS&bbox={bbox-epsg-3857}&styles=&format=image/png&width=265&height=256&layers=0&version=1.1.0&srs=EPSG:3857`
                        ],
                        'tileSize': 256
                    });
                setCurrentLayer(layerId);
                break;
            case 'Resguardos':
                setlnglat([-73.5,10.5]);
                checkLayer(map, currentLayer);
                const locations = getLocations();
                const features = locations.map(location => ({
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [location.coordinates.longitude, location.coordinates.latitude]
                    },
                    'properties': {
                        'name': location.name,
                        'alternateName': location.alternateName,
                        'area': location.area
                    }
                }));
                const geojson = {
                    'type': 'FeatureCollection',
                    'features': features
                };
                const source = {
                    'type': 'geojson',
                    'data': geojson
                };
                map.addSource(layerId, source);
                map.addLayer({
                    'id': layerId,
                    'type': 'circle',
                    'source': layerId,
                    'paint': {
                        'circle-radius': 5,
                        'circle-stroke-width': 1,
                        'circle-color': 'green',
                        'circle-stroke-color': 'black'
                    }
                });
                map.on('click', layerId, (e) => {
                    const properties = e.features[0].properties;
                    const popupContent = Object.entries(properties).map(([key, value]) => {
                        if (key === 'name') {
                            return;
                        } else {
                            return `<p style="margin: 0;">${key}: ${value}</p>`;
                        }
                    }).join('');
                    new mapboxgl.Popup()
                        .setLngLat(e.lngLat)
                        .setHTML(`<h3>Nombre ${properties.name}</h3>`+popupContent)
                        .addTo(map);
                });
                setCurrentLayer(layerId);
                break;
                case 'Informalidad':
                    // setShowBar(true);
                    // setMax(3);
                    // setMin(0);
                    // setStep(1);
                    // const years = [2014, 2019, 2020];
                    setlnglat([-73.5,10.5]);
                    fetchWmsMetadata(`https://geoservicios.upra.gov.co/arcgis/services/formalizacion_propiedad/Indice_Informalidad_2014_Dep/MapServer/WMSServer?request=GetCapabilities&service=WMS`).then(metadata => {
                        const title = metadata.title;
                        const abstract = metadata.abstract;
                        const legendURL = metadata.legendURL;
                        console.log('legendURL:', legendURL)
                        console.log('Title:', title);
                        console.log('Abstract:', abstract);
                        const popup = new mapboxgl.Popup({ closeOnClick: false })
                        .setLngLat([-73.5,10.5])
                        .setHTML(`<b>${title}</b><p>${abstract}</p><div><img src="${legendURL}" alt="Legend Image"><div/>`)
                        .addTo(map);
                    });
                    addLayer_(map, mapType, currentLayer,layerId,'raster', {
                        'type': 'raster',
                        'tiles': [
                            `https://geoservicios.upra.gov.co/arcgis/services/formalizacion_propiedad/Indice_Informalidad_2014_Dep/MapServer/WMSServer?request=GetMap&service=WMS&bbox={bbox-epsg-3857}&styles=&format=image/png&width=265&height=256&layers=0&version=1.1.0&srs=EPSG:3857`
                        ],
                        'tileSize': 256
                    });
                setCurrentLayer(layerId);
                break;
            case 'Temperatura Estaciones IDEAM':
                setShowBar(true);
                setMax(14);
                setMin(0);
                setStep(1);
                const years_temp = [2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012,2013,2014,2015,2016,2017,2018,2019];
                setlnglat([-73.5,10.5]);
                handleApiCall(map, currentLayer,layerId, apiTempIdeam, data => data.filter(station=>new Date(station.properties.fechaobservacion).getFullYear()==years_temp[year]).map(station => ({
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [station.geometry.coordinates[0], station.geometry.coordinates[1]]
                    },
                    'properties': station.properties
                })), {
                    'circle-radius': 5,
                    'circle-stroke-width': 1,
                    'circle-color': [
                      'interpolate',
                      ['linear'],
                      ['to-number',['get', 'valorobservado']], // Assuming temperature is the property in your data
                      0, 'blue',
                      10, 'green',
                      20, 'yellow',
                      30, 'orange',
                      40, 'red'
                    ],
                    'circle-stroke-color': 'black'
                  });
                setCurrentLayer(layerId);
                break;
            default:
                break;
        }
    }, [map, mapType, year]);

    useEffect(() => {
        if (!map) return;
        const layerId = mapType.replace(/\s/g, '').toLowerCase();

        switch (mapType) {
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
        }
    }, [map,mapType,latLng]);
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
