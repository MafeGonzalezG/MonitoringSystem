import { useEffect } from "react";
import shp from "shpjs";
import geojsonLayer from "./geojsonLayerFromInputFile.js";
import checkLayer from "./checkLayer.js";
/**
  Adds the file to the map. This function is called when the inputFile prop changes. The function reads the file and adds it to the map as a geojson source with geojsonLayer function.
    If the file is a zip file, the function reads the file and adds it to the map as a geojson source. The function also sets the current source and the source loading state, when the file is added to the map.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {text} inputFile -    The file to be added to the map.
 * @param {Object} map -          The map object.
 * @param {Function} setCurrentSource -   The current source, this prop is managed from the map component.
 * @param {Function} setSourceisLoading - The source loading state, this prop is managed from the map component.
 * @param {Function} setPopUpview -       The popup view state, this prop is managed from the main component.
 * @param {Function} setPopUpSettings -   The p opup settings, this prop is managed from the main component.
 * @returns {null} - The function does not return anything, it modified the map component.
 *
 * @example
 * // Render a map component with a countryfocus.
 * <Map country='colombia' />
 */
function AddFileToMap({inputFile,map,setCurrentSource,setSourceisLoading,setPopUpview,setPopUpSettings}) {
    useEffect(() => {
        if (inputFile) {
          setSourceisLoading(true);
          if (inputFile.name.split(".").pop() === "geojson") {
            const reader = new FileReader();
            reader.onload = function (e) {
              const data = JSON.parse(e.target.result);
              if (map) {
                checkLayer(map, inputFile.name);
                map.addSource(inputFile.name, {
                  type: "geojson",
                  data: data,
                });
                geojsonLayer(map, data, inputFile.name);
                setCurrentSource(inputFile.name);
              }
            };
            reader.readAsText(inputFile);
          } else if (inputFile.name.split(".").pop() === "zip") {
            async function readShp(file) {
              try {
                const arrayBuffer = await file.arrayBuffer();
                const geojson = await shp(arrayBuffer);
                return geojson;
              } catch (error) {
                console.error("Error reading file:", error);
                setSourceisLoading(false);
                setPopUpview(true);
                setPopUpSettings({
                  type: "directInput",
                  title: "Error reading file",
                  content: "Error reading file",
                });
              }
            }
            readShp(inputFile).then((data) => {
              if (!Array.isArray(data)) {
                if (map) {
                  checkLayer(map, data.fileName);
                  map.addSource(data.fileName, {
                    type: "geojson",
                    data: data,
                  });
                  geojsonLayer(map, data, data.fileName);
                  setCurrentSource(data.fileName);
                }
              } else {
                data.forEach((element) => {
                  if (map) {
                    checkLayer(map, element.fileName);
                    map.addSource(element.fileName, {
                      type: "geojson",
                      data: element,
                    });
                    geojsonLayer(map, element, element.fileName);
                    setSourceisLoading(false);
                  }
                });
              }
            });
          } else {
            console.error("Error reading file no geojson");
            setSourceisLoading(false);
            setPopUpview(true);
            setPopUpSettings({
              type: "directInput",
              title: "Error reading file",
              content: "Expected .geojson file",
            });
          }
        }
      }, [inputFile, map, setSourceisLoading]);
}
export default AddFileToMap;