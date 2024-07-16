import mapboxgl from "mapbox-gl";
import Layers from "./layers.js";
import apiFires from "../apis/firesApi.js";
import militaryApicall from "../apis/apiMilitaryZones.js";
import apiWaterQuality from "../apis/apiWaterQuality.js";
import getLocations from "../apis/hardCodedResguardos.js";
import resguardosApi from "../apis/apiResguardos.js";
import apiTempIdeam from "../apis/apiTempIDEAM.js";
import schoolAPiCall from "../apis/schoolApi.js";
import AirQualityMap from '../apis/apiAirQuality.js';
import shp from 'shpjs'; 


import { useEffect, useState} from "react";
function geojsonLayer(map,data,inputFileName){
  if(data.features[0].geometry.type === 'Point'){
    map.addLayer({
      id:inputFileName,
      type: 'circle',
      source:inputFileName,
      paint: {
        'circle-radius': 5,
        'circle-color': '#f00'
      }
    });
  }else if(data.features[0].geometry.type === 'Polygon'){
    map.addLayer({
      id:inputFileName,
      type: 'fill',
      source:inputFileName,
      paint: {
        'fill-color': '#088',
        'fill-opacity': 0.8
      }
    });}else if(data.features[0].geometry.type === 'LineString'){
      map.addLayer({
        id:inputFileName,
        type: 'line',
        source:inputFileName,
        paint: {
          'line-color': '#f00',
          'line-width': 2
        }
      });} else if(data.features[0].geometry.type === 'MultiPolygon'){
        map.addLayer({
          id:inputFileName,
          type: 'fill',
          source:inputFileName,
          paint: {
            'fill-color': '#088',
            'fill-opacity': 0.8
          }
        });
      } else if(data.features[0].geometry.type === 'MultiLineString'){
        map.addLayer({
          id:inputFileName,
          type: 'line',
          source:inputFileName,
          paint: {
            'line-color': '#f00',
            'line-width': 2
          }
        });
      } else if(data.features[0].geometry.type === 'MultiPoint'){
        map.addLayer({
          id:inputFileName,
          type: 'circle',
          source:inputFileName,
          paint: {
            'circle-radius': 5,
            'circle-color': '#f00'
          }
        });} else if(data.features[0].geometry.type === 'GeometryCollection'){
          map.addLayer({
            id:inputFileName,
            type: 'fill',
            source:inputFileName,
            paint: {
              'fill-color': '#088',
              'fill-opacity': 0.8
            }
          });
        } else if (data.features[0].geometry.type === 'FeatureCollection'){
          map.addLayer({
            id:inputFileName,
            type: 'fill',
            source:inputFileName,
            paint: {
              'fill-color': '#088',
              'fill-opacity': 0.8
            }
          });
        } else if (data.features[0].geometry.type === 'Feature'){
          map.addLayer({
            id:inputFileName,
            type: 'fill',
            source:inputFileName,
            paint: {
              'fill-color': '#088',
              'fill-opacity': 0.8
            }
          });
        }
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
function flyToLayerBounds(layerId,map) {
  var source = map.getSource(layerId);
        if (source.type === 'geojson') {
            var data = source._data; // Access the GeoJSON data
            var bounds = new mapboxgl.LngLatBounds();

            data.features.forEach(function(feature) {
                var coordinates = feature.geometry.coordinates;
                if (feature.geometry.type === 'Polygon') {
                    coordinates = coordinates[0].flat(1); // Use the outer ring for Polygon

                } else if (feature.geometry.type === 'MultiPolygon') {
                    coordinates = coordinates.flat(1); // Flatten the first level for MultiPolygon
                }else if ( feature.geometry.type === 'Point'){
                  coordinates = [feature.geometry.coordinates];
                }

                coordinates.forEach(function(coord) {
                    bounds.extend(coord);
                });
            });

            map.flyTo({
                center: bounds.getCenter(),
                zoom: map.getZoom(),
                essential: true // this animation is considered essential with respect to prefers-reduced-motion
            });
        }
}
function prettyFormat(value) {
  if (typeof value === "string") {
    const newValue = value.replace(/_/g, " ");
    return newValue.charAt(0).toUpperCase() + newValue.slice(1).toLowerCase();
  }
  return value;
}
function checkLayer(map, layerIds) {
  for (let i = 0; i < layerIds.length; i++) {
    if (map.getLayer(layerIds[i])) {
      map.removeLayer(layerIds[i]);
    }
    if (map.getSource(layerIds[i])) {
      map.removeSource(layerIds[i]);
    }
  }
  return;
}
function addGenericPopUp(map, layerId, MainKey) {
  map.on("mouseenter", layerId, () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("click", layerId, (e) => {
    const properties = e.features[0].properties;
    const baseCard = `
    <table>
  <thead>
    <tr>
      <th>Metadato</th>
      <th>Valor</th>
    </tr>
  </thead>
  <tbody>      
   `;
    const popupContent = Object.entries(properties)
      .map(([key, value]) => {
          return `<tr>
     <th scope="row">${prettyFormat(key)}</th>
     <td>  ${prettyFormat(value)}</td> </tr>`;
      })
      .join("");
    const popup = new mapboxgl.Popup({"maxWidth":"50vw"})
      .setLngLat(e.lngLat)
      .setHTML(baseCard+`<h5>${prettyFormat(layerId)} Metadata</h5>` + popupContent +`</tbody>
</table>`)
      .addTo(map);
    map.on("closeAllPopups", () => {
      popup.remove();
    });
  });
}
function LayersLogic({
  setYearList,
  lnglat,
  map,
  mapType,
  year,
  setShowBar,
  setPopUpview,
  setPopUpSettings,
  setSourceisLoading,
  inputFile
}) {
  const [currentLayers, setCurrentLayers] = useState([]);
  const [currentSource, setCurrentSource] = useState(null);
  const [switcher, setSwitcher] = useState(false);
  const [clickLocation, setClickLocation] = useState([]);
  const preprocessing_geojsons = {
    Fires: { func: apiFires },
    "Military Zones": { func: militaryApicall },
    "Water Quality": { func: apiWaterQuality },
    Resguardos: { func: getLocations },
    "Temperatura Estaciones IDEAM": { func: apiTempIdeam },
    Communities: { func: resguardosApi },
    Education: { func: schoolAPiCall },
    "Air Quality":{func:AirQualityMap}
  };
  if(map){
    map.on('click',(e)=>{
      setClickLocation([e.lngLat.lng,e.lngLat.lat]);
    });
  }
  useEffect(() => {
    if (!map) return;
    if (!Layers(mapType)) return;
    console.log("mapType", mapType);
    setSourceisLoading(true);
    setPopUpview(false);
    const layerdic = Layers(mapType);
    checkLayer(map, currentLayers);
    const baseSoure = {
      type: layerdic.sourcetype,
    };
    if (layerdic.temporal) {
      setShowBar(true);
      setYearList(layerdic.year_list);
    } else {
      setShowBar(false);
    }
    let compSource = {};
    switch (layerdic.sourcetype) {
      case "raster":
        compSource = {
          tiles: [layerdic.url],
          tileSize: 256,
        };
        break;
      
      case "geojson":
        if (layerdic.preprocessing && !layerdic.large) {
          preprocessing_geojsons[mapType].func().then((data) => {
            compSource = {
              data: data,
            };
            const beforeLayer = map.getLayer("building") ? "building" : undefined;
            map.addSource(layerdic.id, { ...baseSoure, ...compSource });
            map.addLayer(
              {
                id: layerdic.id,
                type: layerdic.layertype,
                source: layerdic.id,
                paint: { ...layerdic.paint },
              },
              beforeLayer
            );
            setCurrentLayers([layerdic.id]);

          });
        }else {
          compSource = {
            data: layerdic.url,
          };

        }
        if (layerdic.large && layerdic.preprocessing){
          fetchAllFeatures(layerdic.url).then((data) => {
            map.addSource(layerdic.id, { ...baseSoure, ...compSource });
            const beforeLayer = map.getLayer("building") ? "building" : undefined;
            map.addLayer(
              {
                id: layerdic.id,
                type: layerdic.layertype,
                source: layerdic.id,
                paint: { ...layerdic.paint },
              },
              beforeLayer
            );
            setCurrentLayers([layerdic.id]);
            addGenericPopUp(map, layerdic.id, layerdic.title);
          });
        }
        addGenericPopUp(map, layerdic.id, layerdic.title);
        break;
      case "image":
        const bbox = layerdic.bbox;
        var wmsRequestUrl='';
        if(year)
          {wmsRequestUrl = `${layerdic.url}${layerdic.temporal ? `${layerdic.year_list[year]}/MapServer/WMSServer?service=WMS&version=1.1.0&request=GetMap` : ''}&layers=${layerdic.layer}&bbox=${bbox.join(",")}&width=256&height=256&${layerdic.epsg}&styles=&format=image/png&transparent=true`;
          }
        else{
         wmsRequestUrl = `${layerdic.url}${layerdic.temporal ? `${layerdic.year_list[0]}/MapServer/WMSServer?service=WMS&version=1.1.0&request=GetMap` : ''}&layers=${layerdic.layer}&bbox=${bbox.join(",")}&width=256&height=256&${layerdic.epsg}&styles=&format=image/png&transparent=true`;
        }
        compSource = {
          url: wmsRequestUrl,
          coordinates: [
            [bbox[0], bbox[3]], // Top-left
            [bbox[2], bbox[3]], // Top-right
            [bbox[2], bbox[1]], // Bottom-right
            [bbox[0], bbox[1]], // Bottom-left
          ],
        };
        break;
      case 'event-driven':
       setSourceisLoading(false);
        setPopUpview(true);
        setPopUpSettings(
          {
            type:'directInput',
            title:'Air quality indicator',
            content:'Click anywhere on the map to see air quality indicators'
          }
        )
        break
      default:
        break;
      
    }
    if (!layerdic.preprocessing) {
      map.addSource(layerdic.id, { ...baseSoure, ...compSource });
      const beforeLayer = map.getLayer("building") ? "building" : undefined;
      map.addLayer(
        {
          id: layerdic.id,
          type: layerdic.layertype,
          source: layerdic.id,
          paint: { ...layerdic.paint },
        },
        beforeLayer
      );
      setCurrentLayers([layerdic.id]);
    }
    if (layerdic.legend && layerdic.legendType === "gradient") {
      setPopUpview(true);
      setPopUpSettings({
        type: "gradient",
        title: layerdic.legendTitle,
        legendPositions: layerdic.legendPositions,
        legendColors: layerdic.legendColors,
      });
    }
    if (layerdic.legend && layerdic.legendType === "xmlsource") {
      setPopUpview(true);
      setPopUpSettings({
        type: "xmlsource",
        title: layerdic.legendTitle,
        legendSource: layerdic.legendSource,
        legendSourceMetadata: layerdic.legendSourceMetadata,
      });
    }
    if (layerdic.legend && layerdic.legendType === "jsonsource") {
      setPopUpview(true);
      setPopUpSettings({
        type: "jsonsource",
        title: layerdic.legendTitle,
        legendSource: layerdic.legendSource,
        legendSourceMetadata: layerdic.legendSourceMetadata,
      });}
    if (layerdic.sourcetype!== 'event-driven'){
    setCurrentSource(layerdic.id);
    map.on('error', function(e) {
      console.error('Error in map:', e.error);
     setSourceisLoading(false);
      setPopUpview(true);
      setPopUpSettings({
        type: "directInput",
        title: "There was an error loading the layer",
        content: "Error loading the layer",
      });
    });
  }
  }, [mapType,switcher]);
  useEffect(() => {
    if(inputFile){
      console.log(inputFile);
      setSourceisLoading(true);
      if(inputFile.name.split('.').pop()==='geojson'){
        const reader = new FileReader();
        reader.onload = function(e) {
          const data = JSON.parse(e.target.result);
          console.log(data);
          if(map){
            
            if(map.getLayer(inputFile.name)){
              map.removeLayer(inputFile.name);
            }
            if(map.getSource(inputFile.name)){
              map.removeSource(inputFile.name);
            }
            map.addSource(inputFile.name, {
              type: 'geojson',
              data: data
            });
            geojsonLayer(map,data,inputFile.name);
            setCurrentSource(inputFile.name);
          }
        };
        reader.readAsText(inputFile);
      }else if(inputFile.name.split('.').pop()==='zip'){
        console.log('shp');
        async function readShp(file) {
          try {
              const arrayBuffer = await file.arrayBuffer();
              const geojson = await shp(arrayBuffer);
              console.log(geojson);
              return geojson;
          } catch (error) {
              console.error('Error reading file:', error);
              setSourceisLoading(false);
              setPopUpview(true);
              setPopUpSettings({
                type: "directInput",
                title: "Error reading file",
                content: "Error reading file",
              });
          }}
        readShp(inputFile).then((data)=>{
          if (!Array.isArray(data)){
          if(map){
            if(map.getLayer(data.fileName)){
              map.removeLayer(data.fileName);
            }
            if(map.getSource(data.fileName)){
              map.removeSource(data.fileName);
            }
            map.addSource(data.fileName, {
              type: 'geojson',
              data: data
            });
            geojsonLayer(map,data,data.fileName);
            setCurrentSource(data.fileName);
          }}else{
            console.log(Array.isArray(data));
            data.forEach((element)=>{
              console.log(element.fileName);
              console.log(element);
              if(map){
                if(map.getLayer(element.fileName)){
                  map.removeLayer(element.fileName);
                }
                if(map.getSource(element.fileName)){
                  map.removeSource(element.fileName);
                }
                map.addSource(element.fileName, {
                  type: 'geojson',
                  data: element
                });
                geojsonLayer(map,element,element.fileName);
                setSourceisLoading(false);
              }
            });
          }
        });
      }
      else{
        console.error('Error reading file no geojson');
        setSourceisLoading(false);
        setPopUpview(true);
        setPopUpSettings({
          type: "directInput",
          title: "Error reading file",
          content: "Expected .geojson file",
        });
      }
    }
     
  },[inputFile,map,setSourceisLoading]);
  useEffect(() => {
    if (!map) return;
    if (!Layers(mapType)) return;
    const layerdic = Layers(mapType);
    if (!layerdic.temporal) return;
    console.log('year',year)
    const year_list = layerdic.year_list;
    if(layerdic.sourcetype === 'geojson'){
      console.log('geojson');
      map.setFilter(currentLayers[0], [
        "==",
        ["string", ["get", layerdic.year_name]],
        String(year_list[year]),
      ]);
      //remove popups
      map.fire("closeAllPopups");
      addGenericPopUp(map, layerdic.id, layerdic.title);
    }
    if(layerdic.sourcetype === 'image'){
       setSwitcher(!switcher);
    }
  }, [year]);

  useEffect(() => {
    if (map && lnglat) {
      map.flyTo({
        center: lnglat,
        zoom: 5,
        speed: 2,
        curve: 1,
        easing(t) {
          return t;
        },
      });
    }
  }, [lnglat]);

  useEffect(() => {
    if (map && currentSource) {
      const onSourceLoaded = () => {
        if (map.isSourceLoaded(currentSource)) {
          setSourceisLoading(false);
          flyToLayerBounds(currentSource,map);
          console.log("source loaded");
          map.off('sourcedata', onSourceLoaded); // Clean up the event listener
        }
      };

      map.on('sourcedata', onSourceLoaded);

      // Clean up the event listener on component unmount
      return () => {
        map.off('sourcedata', onSourceLoaded);
      };
    }
  }, [map, currentSource,switcher,setSourceisLoading]);
  
  useEffect(()=>{
    if (!map) return;
    if (!Layers(mapType)) return;
    const layerdic = Layers(mapType);
    if(layerdic.sourcetype ==='event-driven'){
      preprocessing_geojsons[mapType].func(clickLocation[1],clickLocation[0]).then((data)=>{
        const popupContent = Object.entries(data.list[0].components)
      .map(([key, value]) => {
          return `<p style="margin: 0;"><strong>${key}</strong>: ${value}</p>`;
      })
      .join("");
        setPopUpSettings(
          {
            tittle:layerdic.title,
            type: 'directInput',
            content: popupContent
      })
    })
    }

  },[clickLocation]
  )
  
  return null;
}

export default LayersLogic;
