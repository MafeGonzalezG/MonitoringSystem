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
import proj4 from 'proj4';
import { stat } from 'fs';
proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");

// EPSG:3857 is predefined in Proj4js, but defining it explicitly for clarity
proj4.defs("EPSG:3857", "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs");
function checkLayer(map, layerId) {
    if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
    }
    if (map.getSource(layerId)) {
        map.removeSource(layerId);
    }
    return;
}
async function fetchAllFeatures(url) {
    const allFeatures = [];
    let offset = 0;
    const limit = 1000; // Number of records to fetch per request

    while (true) {
        const queryUrl = `${url}&resultOffset=${offset}&resultRecordCount=${limit}`;
        const response = await fetch(queryUrl);
        const data = await response.json();
        allFeatures.push(...data.features);

        if (data.features.length < limit) {
            // If fewer features are returned than the limit, we have fetched all records
            break;
        }

        offset += limit;
    }

    return {
        type: 'FeatureCollection',
        features: allFeatures
    };
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
function addLayer_(map, mapType, prev_layer,layerId,type='circle',source=null,...imageValues) {
    checkLayer(map, prev_layer);
    if(type=='image'){
        addWmsLayer(layerId,map,imageValues[0],imageValues[1],imageValues[2],imageValues[3]);
    }else{
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
    }
    return;
}
function addWmsLayer(currentLayer, map, wmsUrl,epsg,bbox,layer) {
    // Create WMS request URL
    const wmsRequestUrl = `${wmsUrl}&layers=${layer}&bbox=${bbox.join(',')}&width=256&height=256&${epsg}&styles=&format=image/png&transparent=true`;
    console.log(wmsRequestUrl);
    map.addSource(currentLayer, {
        'type': 'image',
        'url': wmsRequestUrl,
        'coordinates': [
            [bbox[0], bbox[3]],  // Top-left
            [bbox[2], bbox[3]],  // Top-right
            [bbox[2], bbox[1]],  // Bottom-right
            [bbox[0], bbox[1]]   // Bottom-left
        ]
    });

    map.addLayer({
        'id': currentLayer,
        'type': 'raster',
        'source': currentLayer,
        'paint': {}
    }, 'building');
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
    const reproj_urls = {
        'deforestation': {'url':'https://gis.siatac.co/arcgis/services/MAC_DatosAbiertos/Cob_Region_100K_','bbox':[-4.225780,-77.670617,4.948186,-66.847215]},
    }
    useEffect(() => {
        if (!map) return;
        const urls = {
            'earthquakes': {'url':`https://srvags.sgc.gov.co/arcgis/services/Amenaza_Sismica/Amenaza_Sismica_Nacional/MapServer/WMSServer?request=GetMap&version=1.3.0`,'fetch_medatada':false,'type':'image','epsg':'crs=CRS:84','bbox':[-84.764004,-4.998033,-66.003125,16.998958],'layer':5},
            'deforestation':{'url':'https://gis.siatac.co/arcgis/services/MAC_DatosAbiertos/Cob_Region_100K_','fetch_metadata':false,'type':'image','bbox':[-77.670617,-4.225780,-66.847215,4.948186],'epsg':'srs=EPSG:4170','layer':0},
            'cuencas' :{'url':`http://localhost:8080/geoserver/cuencas/wms?service=WMS&version=1.1.0&request=GetMap&layers=cuencas:cuencas&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG:3857&styles=&format=image/png`,'fetch_medatada':false,'type':'raster','bbox':null,'epsg':null},
            'agricultura Familiar' : {'url':`https://geoservicios.upra.gov.co/arcgis/services/uso_suelo_rural/areas_probables_agricultura_familiar/MapServer/WMSServer?request=GetMap&service=WMS&bbox={bbox-epsg-3857}&styles=&format=image/png&width=265&height=256&layers=0&version=1.1.0&srs=EPSG:3857`,'fetch_medatada':false,'type':'raster','bbox':null,'epsg':null},
            'mining': {'url': "http://gis-gfw.wri.org/arcgis/rest/services/country_data/south_america/MapServer/7/query?outFields=*&where=1%3D1&f=geojson",'title':'status','type':'raster','bbox':null,'epsg':null},
            'reservas indigenas':{'url':"https://services6.arcgis.com/CagbVUK5R9TktP2I/ArcGIS/rest/services/RESGUARDO_INDIGENA_LEGALIZADO/FeatureServer/0/query?where=1%3D1&outFields=*&f=geojson",'title':'NOMBRE','type':'raster','bbox':null,'epsg':null},
            'amenaza Hidrica Arroz':{'url': `http://localhost:8080/geoserver/LU/wms?service=WMS&version=1.1.0&request=GetMap&layers=LU:amenaza_hidrico_arroz&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG:3857&styles=&format=image/png`,'fetch_medatada':true,'metadata_url':'http://localhost:8080/geoserver/LU/wms?request=GetCapabilities&layers=LU:amenaza_hidrico_arroz','type':'raster','bbox':null,'epsg':null},
            'acuiferos Cesar':{'url':`https://geoservicios.upra.gov.co/arcgis/services/adecuacion_tierras_rurales/acuiferos_cesar/MapServer/WMSServer?request=GetMap&service=WMS&bbox={bbox-epsg-3857}&styles=&format=image/png&width=265&height=256&layers=0&version=1.1.0&srs=EPSG:3857`,'fetch_metadata':true,'metadata_url':'https://geoservicios.upra.gov.co/arcgis/services/adecuacion_tierras_rurales/acuiferos_cesar/MapServer/WMSServer?request=GetCapabilities&service=WMS','type':'raster','bbox':null,'epsg':null},
            'informalidad':{'url':`https://geoservicios.upra.gov.co/arcgis/services/formalizacion_propiedad/Indice_Informalidad_2014_Dep/MapServer/WMSServer?request=GetMap&service=WMS&bbox={bbox-epsg-3857}&styles=&format=image/png&width=265&height=256&layers=0&version=1.1.0&srs=EPSG:3857`,'fetch_metadata':true,'metadata_url':`https://geoservicios.upra.gov.co/arcgis/services/formalizacion_propiedad/Indice_Informalidad_2014_Dep/MapServer/WMSServer?request=GetCapabilities&service=WMS`,'type':'raster','bbox':null,'epsg':null},
        };
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
                setMax(8);
                setMin(0);
                setStep(1);
                setShowBar(true);
                const deforestationYears = [2002, 2007, 2012, 2014, 2016, 2028, 2020, 2021,2022];
                checkLayer(map, currentLayer);
                const wmsUrl =  urls[layerId].url+`${deforestationYears[year]}/MapServer/WMSServer?service=WMS&version=1.1.0&request=GetMap`;
                addWmsLayer(layerId, map, wmsUrl,urls[layerId].epsg,urls[layerId].bbox,urls[layerId].layer);
                setCurrentLayer(layerId);
                break;
            case 'Earthquakes':
            case 'Cuencas':
            case 'Agricultura Familiar':
            case 'Amenaza Hidrica Arroz':
            case 'Acuiferos Cesar':
            case 'Informalidad':
                setlnglat([-73.5,10.5]);
                if(urls[layerId].type=='raster'){
                    addLayer_(map,mapType,currentLayer, layerId, urls[layerId].type,{
                        'type': 'raster',
                        'tiles': [
                            urls[layerId].url
                        ],
                        'tileSize': 256
                    });
                    
                }else{
                    addLayer_(map,mapType,currentLayer,layerId,urls[layerId].type,null,urls[layerId].url,urls[layerId].epsg,urls[layerId].bbox,urls[layerId].layer)
                }
                setCurrentLayer(layerId);
                // new mapboxgl.Popup({ closeOnClick: false })
                // .setLngLat(latLng)
                // .setHTML('<div><img src="https://mapas.igac.gov.co:443/server/services/minasyenergia/cuencassedimentarias2010/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=0" ><div/>')
                // .setOffset([250, -190])
                // .addTo(map);
                if(urls[layerId].fetch_medatada){
                    fetchWmsMetadata(urls[layerId].metadata_url).then(metadata => {
                        const title = metadata.title;
                        const abstract = metadata.abstract;
                        console.log('Title:', title);
                        console.log('Abstract:', abstract);
                        const popup = new mapboxgl.Popup({ closeOnClick: false })
                        .setLngLat(lnglat)
                        .setHTML(`<b>${title}</b><p>${abstract}</p>`)
                        .addTo(map);
                });}
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
                const source_ = {
                    'type': 'geojson',
                    'data': geojson
                };
                map.addSource(layerId, source_);
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
            case 'Temperatura Estaciones IDEAM':
                setShowBar(true);
                setMax(14);
                setMin(0);
                setStep(1);
                console.log('ideam')
                const years_temp = [2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020];
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
            case 'Hot Spots':
                setlnglat([-73.5,10.5]);
                checkLayer(map, currentLayer);
                const url = "https://services2.arcgis.com/g8WusZB13b9OegfU/arcgis/rest/services/Emerging_Hot_Spots_2023/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";
                map.addSource(layerId, {
                    'type': 'geojson',
                    'data': url
                });
                map.addLayer({
                    'id': layerId,
                    'type': 'fill',
                    'source': layerId,
                    'paint': {
                        'fill-outline-color': 'black',
                        'fill-color': 'blue',
                        'fill-opacity': 0.5,
                        
                    }
                });
                map.on('click', layerId, (e) => {
                    const properties = e.features[0].properties;
                    const popupContent = Object.entries(properties).map(([key, value]) => {
                        if (key === 'PATTERN') {
                            return;
                        } else {
                            return `<p style="margin: 0;">${key}: ${value}</p>`;
                        }
                    }).join('');
                    new mapboxgl.Popup()
                        .setLngLat(e.lngLat)
                        .setHTML(`<h3>Pattern ${properties.PATTERN}</h3>`+popupContent)
                        .addTo(map);
                });
                setCurrentLayer(layerId);
                break
            case "Mining":
            case 'Reservas indigenas':
                setlnglat([-73.5,10.5]);
                checkLayer(map, currentLayer);
                fetchAllFeatures(urls[mapType]).then((data) => {;
                    console.log('Total number of features:', data.features.length);
                        map.addSource(layerId, {
                            'type': 'geojson',
                            'data': data
                        });
                        map.addLayer({
                            'id': layerId,
                            'type': 'fill',
                            'source': layerId,
                            'paint': {
                                'fill-outline-color': 'black',
                                'fill-color': 'blue',
                                'fill-opacity': 0.5,
                            }
                        });
                        map.addLayer({
                            'id': layerId + '-line',
                            'type': 'line',
                            'source': layerId,
                            'paint': {
                                'line-color': 'black',
                                'line-width': 2
                            }
                        });
                        map.on('click', layerId, (e) => {
                            const properties = e.features[0].properties;
                            const popupContent = Object.entries(properties).map(([key, value]) => {
                                if (key === urls[mapType].title) {
                                    return;
                                } else {
                                    return `<p style="margin: 0;">${key}: ${value}</p>`;
                                }
                            }).join('');
                            new mapboxgl.Popup()
                                .setLngLat(e.lngLat)
                                .setHTML(`<h3>${urls[mapType].title} ${properties[urls[mapType].title]}</h3>`+popupContent)
                                .addTo(map);
                        });
                        setCurrentLayer(layerId);
                    }).catch((error) => {   
                        console.error('Error fetching data:', error);
                    });
                setCurrentLayer(layerId);
                break
            case 'Catastro':
                    console.log('catastro')
                    setlnglat([-73.5,10.5]);
                    checkLayer(map, currentLayer);
                    const layer_1 = 'U_NOMENCLATURA_VIAL'
                    const url_1 = `https://dservices2.arcgis.com/RVvWzU3lgJISqdke/arcgis/services/CATASTRO_PUBLICO_Mayo_15_2024_gdb/WFSServer?service=wfs&request=getFeature&typeName=CATASTRO_PUBLICO_Mayo_15_2024_gdb:${layer_1}&outputFormat=geojson&srsname=EPSG:4326`;
                    map.addSource(layerId+layer_1, {
                        'type': 'geojson',
                        'data': url_1
                    });
                    map.addLayer({
                        'id': layerId+layer_1,
                        'source': layerId+layer_1,
                        'type':'line',
                        'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                                        },
                        'paint': {
                            'line-color': '#2EC4B6',
                            'line-width': 4
                        }
                    });
                    map.addLayer({
                        'id': layerId+layer_1+'-fill',
                        'source': layerId+layer_1,
                        'type': 'symbol',
                        'layout': {
                            "text-field": "{Texto}",
                        "text-font": [
                            "DIN Offc Pro Medium",
                            "Arial Unicode MS Bold"
                        ],
                        "text-size": 12}
                    });
                    const layer_2 = 'U_PERIMETRO';
                    const url_2 = `https://dservices2.arcgis.com/RVvWzU3lgJISqdke/arcgis/services/CATASTRO_PUBLICO_Mayo_15_2024_gdb/WFSServer?service=wfs&request=getFeature&typeName=CATASTRO_PUBLICO_Mayo_15_2024_gdb:${layer_2}&outputFormat=geojson&srsname=EPSG:4326`;
                    map.addSource(layerId+layer_2, {
                        'type': 'geojson',
                        'data': url_2
                    });
                    map.addLayer({
                        'id': layerId+layer_2,
                        'source': layerId+layer_2,
                        'type':'fill',
                        'paint': {
                            'fill-color': '#F1E8B8',
                            'fill-opacity': 0.5
                        }
                    });
                    map.addLayer({
                        'id': layerId+layer_2+'-line',
                        'source': layerId+layer_2,
                        'type':'line',
                        'paint': {
                            'line-color': '#F1E8B8',
                            'line-width': 2
                        }
                    });
                    const layer_3 = 'R_NOMENCLATURA_VIAL';
                    const url_3 = `https://dservices2.arcgis.com/RVvWzU3lgJISqdke/arcgis/services/CATASTRO_PUBLICO_Mayo_15_2024_gdb/WFSServer?service=wfs&request=getFeature&typeName=CATASTRO_PUBLICO_Mayo_15_2024_gdb:${layer_3}&outputFormat=geojson&srsname=EPSG:4326`;
                    map.addSource(layerId+layer_3, {
                        'type': 'geojson',
                        'data': url_3
                    });
                    map.addLayer({
                        'id': layerId+layer_3,
                        'source': layerId+layer_3,
                        'type':'symbol',
                        'layout': {
                            "text-field": "{Texto}",
                        "text-font": [
                            "DIN Offc Pro Medium",
                            "Arial Unicode MS Bold"
                        ],
                        "text-size": 12}
                    });
                    map.addLayer({
                        'id': layerId+layer_3+'-line',
                        'source': layerId+layer_3,
                        'type':'line',
                        'layout': { 'line-join': 'round', 'line-cap': 'round'},
                        'paint': {
                            'line-color': '#2EC4B6',
                            'line-width': 4
                        }
                    });
                    const layer_4 = 'U_MANZANA';
                    const url_4 = `https://dservices2.arcgis.com/RVvWzU3lgJISqdke/arcgis/services/CATASTRO_PUBLICO_Mayo_15_2024_gdb/WFSServer?service=wfs&request=getFeature&typeName=CATASTRO_PUBLICO_Mayo_15_2024_gdb:${layer_4}&outputFormat=geojson&srsname=EPSG:4326`;
                    map.addSource(layerId+layer_4, {
                        'type': 'geojson',
                        'data': url_4
                    });
                    map.addLayer({
                        'id': layerId+layer_4,
                        'source': layerId+layer_4,
                        'type':'fill',
                        'paint': {
                            'fill-color': '#AFDEDC',
                            'fill-opacity': 0.5
                        }
                    });
                    const layer_5 = 'R_NOMENCLATURA_DOMICILIARIA';
                    const url_5 = `https://dservices2.arcgis.com/RVvWzU3lgJISqdke/arcgis/services/CATASTRO_PUBLICO_Mayo_15_2024_gdb/WFSServer?service=wfs&request=getFeature&typeName=CATASTRO_PUBLICO_Mayo_15_2024_gdb:${layer_5}&outputFormat=geojson&srsname=EPSG:4326`;
                    map.addSource(layerId+layer_5, {
                        'type': 'geojson',
                        'data': url_5
                    });
                    map.addLayer({
                        'id': layerId+layer_5,
                        'source': layerId+layer_5,
                        'type':'symbol',
                        'layout': {
                            "text-field": "{Texto}",
                        "text-font": [
                            "DIN Offc Pro Medium",
                            "Arial Unicode MS Bold"
                        ],
                        "text-size": 12}
                    });
                    map.addLayer({
                        'id': layerId+layer_5+'-line',
                        'source': layerId+layer_5,
                        'type':'line',
                        'layout': { 'line-join': 'round', 'line-cap': 'round'},
                        'paint': {
                            'line-color': '#2EC4B6',
                            'line-width': 4
                        }
                    });
                    const layer_6 = 'R_CONSTRUCCION_INFORMAL';
                    const url_6 = `https://dservices2.arcgis.com/RVvWzU3lgJISqdke/arcgis/services/CATASTRO_PUBLICO_Mayo_15_2024_gdb/WFSServer?service=wfs&request=getFeature&typeName=CATASTRO_PUBLICO_Mayo_15_2024_gdb:${layer_6}&outputFormat=geojson&srsname=EPSG:4326`;
                    map.addSource(layerId+layer_6, {
                        'type': 'geojson',
                        'data': url_6
                    });
                    map.addLayer({
                        'id': layerId+layer_6,
                        'source': layerId+layer_6,
                        'type':'fill',
                        'paint': {
                            'fill-color': '#F1E8B8',
                            'fill-opacity': 0.5
                        }
                    });
                    map.addLayer({
                        'id': layerId+layer_6+'-line',
                        'source': layerId+layer_6,
                        'type':'symbol',
                        'layout': {
                            "text-field": "{Identificador}",
                        "text-font": [
                            "DIN Offc Pro Medium",
                            "Arial Unicode MS Bold"
                        ],
                        "text-size": 12}
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
