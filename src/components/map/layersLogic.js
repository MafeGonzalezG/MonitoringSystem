import mapboxgl from "mapbox-gl";
import Layers from "./layers.js";
import apiFires from "../apis/firesApi.js";
import militaryApicall from "../apis/apiMilitaryZones.js";
import apiWaterQuality from "../apis/apiWaterQuality.js";
import getLocations from "../apis/hardCodedResguardos.js";
import resguardosApi from "../apis/apiResguardos.js";
import apiTempIdeam from "../apis/apiTempIDEAM.js";
import schoolAPiCall from "../apis/schoolApi.js";

import { useEffect, useState, useRef } from "react";
function sourceCallback(sourceName, map) {
  // assuming 'map' is defined globally, or you can use 'this'
  console.log("sourceName", sourceName);
  console.log("map get source", map.getSource(sourceName));
  console.log("map is source loaded", map.isSourceLoaded(sourceName));
  if (map.getSource(sourceName) && map.isSourceLoaded(sourceName)) {
    console.log("source loaded!");
  }
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
    const popupContent = Object.entries(properties)
      .map(([key, value]) => {
        if (key === MainKey) {
          return;
        } else {
          return `<p style="margin: 0;">${key}: ${value}</p>`;
        }
      })
      .join("");
    const popup = new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(`<h3>${MainKey} :  ${properties[MainKey]}</h3>` + popupContent)
      .addTo(map);
    map.on("closeAllPopups", () => {
      popup.remove();
    });
  });
}
function LayersLogic({
  setMax,
  lnglat,
  map,
  mapType,
  year,
  setShowBar,
  setPopUpview,
  setPopUpSettings,
  setSourceisLoading
}) {
  const [currentLayers, setCurrentLayers] = useState([]);
  const [currentSource, setCurrentSource] = useState(null);
  const [latLng, setLatLng] = useState([0, 0]);
  const preprocessing_geojsons = {
    Fires: { func: apiFires },
    "Military Zones": { func: militaryApicall },
    "Water Quality": { func: apiWaterQuality },
    Resguardos: { func: getLocations },
    "Temperatura Estaciones IDEAM": { func: apiTempIdeam },
    Communities: { func: resguardosApi },
    Education: { func: schoolAPiCall },
  };
  useEffect(() => {
    if (!map) return;
    if (!Layers(mapType)) return;
    setSourceisLoading(true);
    const layerdic = Layers(mapType);
    checkLayer(map, currentLayers);
    const baseSoure = {
      type: layerdic.sourcetype,
      id: layerdic.id,
    };
    let compSource = {};
    switch (layerdic.sourcetype) {
      case "raster":
        compSource = {
          tiles: [layerdic.url],
          tileSize: 256,
        };
        break;
      case "geojson":
        if (layerdic.preprocessing) {
          preprocessing_geojsons[mapType].func().then((data) => {
            compSource = {
              data: data,
            };
            map.addSource(layerdic.id, { ...baseSoure, ...compSource });
            map.addLayer(
              {
                id: layerdic.id,
                type: layerdic.layertype,
                source: layerdic.id,
                paint: { ...layerdic.paint },
              },
              "building"
            );
            setCurrentLayers([layerdic.id]);
          });
        } else {
          compSource = {
            data: layerdic.url,
          };
        }
        if (layerdic.temporal) {
          setShowBar(true);
          setMax(layerdic.max);
        }
        addGenericPopUp(map, layerdic.id, layerdic.title);
        break;
      case "image":
        const bbox = layerdic.bbox;
        const wmsRequestUrl = `${layerdic.url}&layers=${
          layerdic.layer
        }&bbox=${bbox.join(",")}&width=256&height=256&${
          layerdic.epsg
        }&styles=&format=image/png&transparent=true`;
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
      default:
        break;
    }
    if (!layerdic.preprocessing) {
      map.addSource(layerdic.id, { ...baseSoure, ...compSource });
      map.addLayer(
        {
          id: layerdic.id,
          type: layerdic.layertype,
          source: layerdic.id,
          paint: { ...layerdic.paint },
        },
        "building"
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
      });
    }
    setCurrentSource(layerdic.id);
  }, [mapType]);
  useEffect(() => {
    if (!map) return;
    if (!Layers(mapType)) return;
    const layerdic = Layers(mapType);
    if (!layerdic.temporal) return;
    const year_list = layerdic.year_list;
    map.setFilter(currentLayers[0], [
      "==",
      ["string", ["get", layerdic.year_name]],
      String(year_list[year]),
    ]);
    //remove popups
    map.fire("closeAllPopups");
    addGenericPopUp(map, layerdic.id, layerdic.title);
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
  }, [map, currentSource]);
  return null;
}

export default LayersLogic;
