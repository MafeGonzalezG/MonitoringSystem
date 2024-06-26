import Layers from './layers.js';
import { useEffect, useState, useRef } from 'react';
import BiodiversityApiCall from '../apis/biodiversityApi.js';
import AirQualityMap from '../apis/apiAirQuality.js';
import schoolAPiCall from '../apis/schoolApi.js';
import mapboxgl from 'mapbox-gl';
import resguardosApi from '../apis/apiResguardos.js';
import apiTempIdeam from '../apis/apiTempIDEAM.js';

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
    console.log('Fetching metadata from:', url)
    const response = await fetch(url);
    const xml = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    let layerQueryable = xmlDoc.querySelector('Layer[queryable="1"]');

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
function addGenericPopUp(map,layerId,MainKey){
    map.on('mouseenter', layerId, () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('click', layerId, (e) => {
        const properties = e.features[0].properties;
        const popupContent = Object.entries(properties).map(([key, value]) => {
            if (key === MainKey) {
                return;
            } else {
                return `<p style="margin: 0;">${key}: ${value}</p>`;
            }
        }).join('');
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<h3>${MainKey} :  ${properties[MainKey]}</h3>`+popupContent)
            .addTo(map);
    });
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
            'mining': {'url': "http://gis-gfw.wri.org/arcgis/rest/services/country_data/south_america/MapServer/7/query?outFields=*&where=1%3D1&f=geojson",'title':'status','type':'geojson','bbox':null,'epsg':null},
            'reservasindigenas':{'url':"https://services6.arcgis.com/CagbVUK5R9TktP2I/ArcGIS/rest/services/RESGUARDO_INDIGENA_LEGALIZADO/FeatureServer/0/query?where=1%3D1&outFields=*&f=geojson",'title':'NOMBRE','type':'geojson','bbox':null,'epsg':null},

        };
        switch (mapType) {
            case "Mining":
            case 'Reservas indigenas':
                setlnglat([-73.5,10.5]);
                checkLayer(map, currentLayer);
                fetchAllFeatures(urls[layerId].url).then((data) => {;
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
                        addGenericPopUp(map,layerId,urls[layerId].title);
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
