import Layers from "./layers.js";
import apiFires from "../apis/firesApi.js";
import apiWaterQuality from "../apis/apiWaterQuality.js";
import getLocations from "../apis/hardCodedResguardos.js";
import resguardosApi from "../apis/apiResguardos.js";
import apiTempIdeam from "../apis/apiTempIDEAM.js";
import schoolAPiCall from "../apis/schoolApi.js";
import AirQualityMap from "../apis/apiAirQuality.js";
import flyToLayerBounds from "./flyToLayerBounds.js";
import addGenericPopUp from "./addGenericPopUp.js";
import { useEffect, useState } from "react";
import checkLayer from "./checkLayer.js";
import fetchAllFeatures from "./fetchAllFeatures.js";
/**
 * This function is the logic for the layers in the map. It adds the layers to the map, and sets the source loading state, the popup view state, and the popup settings.
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.setYearList - The year list, this prop is managed from the main component.
 * @param {Array} props.lnglat - The longitude and latitude, this prop is managed from the main component.
 * @param {Object} props.map - The map object.
 * @param {string} props.mapType - The map type, this prop is managed from the main component.
 * @param {number} props.year - The year, this prop is managed from the main component.
 * @param {string} props.currentSource - The current source, this prop is managed from the map component.
 * @param {Function} props.setShowBar - The show bar state, this prop is managed from the main component.
 * @param {Function} props.setPopUpview - The popup view state, this prop is managed from the main component.
 * @param {Function} props.setPopUpSettings - The popup settings, this prop is managed from the main component.
 * @param {Function} props.setSourceisLoading - The source loading state, this prop is managed from the main component.
 * @param {Function} props.setCurrentSource - The current source, this prop is managed from the map component.
 * @returns {null} - The function does not return anything, it adds the layers to the map.
 */
function LayersLogic({
  setYearList,
  lnglat,
  map,
  mapType,
  year,
  currentSource,
  currentLayers,
  setShowBar,
  setPopUpview,
  setPopUpSettings,
  setSourceisLoading,
  setCurrentSource,
  setCurrentLayers
}) {
  const [switcher, setSwitcher] = useState(false);
  const [clickLocation, setClickLocation] = useState([]);
  const preprocessing_geojsons = {
    Fires: { func: apiFires },
    "Water Quality": { func: apiWaterQuality },
    Reserves: { func: getLocations },
    "IDEAM Station Temperatures": { func: apiTempIdeam },
    Communities: { func: resguardosApi },
    Education: { func: schoolAPiCall },
    "Air Quality": { func: AirQualityMap },
  };
  if (map) {
    map.on("click", (e) => {
      setClickLocation([e.lngLat.lng, e.lngLat.lat]);
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
            const beforeLayer = map.getLayer("building")
              ? "building"
              : undefined;
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
        } else {
          compSource = {
            data: layerdic.url,
          };
        }
        if (layerdic.large && layerdic.preprocessing) {
          fetchAllFeatures(layerdic.url).then((data) => {
            map.addSource(layerdic.id, { ...baseSoure, ...compSource });
            const beforeLayer = map.getLayer("building")
              ? "building"
              : undefined;
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
        var wmsRequestUrl = "";
        if (year) {
          wmsRequestUrl = `${layerdic.url}${
            layerdic.temporal
              ? `${layerdic.year_list[year]}/MapServer/WMSServer?service=WMS&version=1.1.0&request=GetMap`
              : ""
          }&layers=${layerdic.layer}&bbox=${bbox.join(
            ","
          )}&width=256&height=256&${
            layerdic.epsg
          }&styles=&format=image/png&transparent=true`;
        } else {
          wmsRequestUrl = `${layerdic.url}${
            layerdic.temporal
              ? `${layerdic.year_list[0]}/MapServer/WMSServer?service=WMS&version=1.1.0&request=GetMap`
              : ""
          }&layers=${layerdic.layer}&bbox=${bbox.join(
            ","
          )}&width=256&height=256&${
            layerdic.epsg
          }&styles=&format=image/png&transparent=true`;
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
      case "event-driven":
        setSourceisLoading(false);
        setPopUpview(true);
        setPopUpSettings([{
          type: "directInput",
          title: "Air quality indicator",
          content: "Click anywhere on the map to see air quality indicators",
        }]);
        break;
      default:
        break;
    }

    if (!layerdic.preprocessing) {
      try{
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
      }catch(e){
        console.log(e)
        setPopUpview(true);
        setPopUpSettings([{
          type: "directInput",
          title: "There was an error loading the layer",
          content: "Error loading the layer",
        }]);
      }
    }
    if (layerdic.legend) {
      setPopUpview(true);
      setPopUpSettings(layerdic.legendSettings);
    }
    if (layerdic.sourcetype !== "event-driven") {
      setCurrentSource(layerdic.id);
      map.on("error", function (e) {
        console.error("Error in map:", e.error);
        setSourceisLoading(false);
        setPopUpview(true);
        setPopUpSettings([{
          type: "directInput",
          title: "There was an error loading the layer",
          content: "Error loading the layer",
        }]);
      });
    }
  }, [mapType, switcher]);
  useEffect(() => {
    if (!map) return;
    if (!Layers(mapType)) return;
    const layerdic = Layers(mapType);
    if (!layerdic.temporal) return;
    console.log("year", year);
    const year_list = layerdic.year_list;
    if (layerdic.sourcetype === "geojson") {
      console.log("geojson");
      map.setFilter(currentLayers[0], [
        "==",
        ["string", ["get", layerdic.year_name]],
        String(year_list[year]),
      ]);
      //remove popups
      map.fire("closeAllPopups");
      addGenericPopUp(map, layerdic.id, layerdic.title);
    }
    if (layerdic.sourcetype === "image") {
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
          flyToLayerBounds(currentSource, map);
          // Correct flytolayers bounds for multiple polygons the async is not working
          console.log("source loaded");
          map.off("sourcedata", onSourceLoaded); // Clean up the event listener
        }
      };

      map.on("sourcedata", onSourceLoaded);

      // Clean up the event listener on component unmount
      return () => {
        map.off("sourcedata", onSourceLoaded);
      };
    }
  }, [map, currentSource, switcher, setSourceisLoading]);

  useEffect(() => {
    if (!map) return;
    if (!Layers(mapType)) return;
    const layerdic = Layers(mapType);
    if (layerdic.sourcetype === "event-driven") {
      preprocessing_geojsons[mapType]
        .func(clickLocation[1], clickLocation[0])
        .then((data) => {
          const popupContent = Object.entries(data.list[0].components)
            .map(([key, value]) => {
              return `<p style="margin: 0;"><strong>${key}</strong>: ${value}</p>`;
            })
            .join("");
          setPopUpSettings([{
            tittle: layerdic.title,
            type: "directInput",
            content: popupContent,
          }]);
        });
    }
  }, [clickLocation]);
  return null;
}

export default LayersLogic;
