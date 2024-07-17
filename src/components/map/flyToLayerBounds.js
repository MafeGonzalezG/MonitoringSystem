import mapboxgl from "mapbox-gl";
/**
  * This function flies to the bounds of a layer. The function is called when the user clicks on a layer in the layer list or adds an input file to the map.
  * @param {string} layerId - The layer id as appears in the map component.
  * @param {Object} map - The map object.
  * @returns {null} - The function does not return anything, it flies to the bounds of a layer.
  * @example
  * flyToLayerBounds('layerId',mapRef);
  * @example
  * map.on('load', () => {
  * flyToLayerBounds('layerId',mapRef);
  * }
 */
function flyToLayerBounds(layerId,map) {
    var source = map.getSource(layerId);
    if (!source) return;
    if(source.type === 'geojson'){
      if(typeof source._data === 'string'){
        async function fetchGeojson(url){
          const response = await fetch(url);
          const data = await response.json();
          return data;
        }
        fetchGeojson(source._data).then((data)=>{
          const features = data.features;
          const bounds = new mapboxgl.LngLatBounds();
          for (const feature of features) {
            if (feature.geometry.type === 'Point') {
            bounds.extend(feature.geometry.coordinates);
            }
            else if (feature.geometry.type === 'Polygon'|| feature.geometry.type==='MultiPolygon') {
              feature.geometry.coordinates[0].forEach((coord) => {
                bounds.extend(coord);
              });
            }
          }
          map.fitBounds(bounds, {
            padding: 20
          });}
        );
      }else if (source._data.type === 'FeatureCollection') {
          const features = source._data.features;
          const bounds = new mapboxgl.LngLatBounds();
          for (const feature of features) {
            if (feature.geometry.type === 'Point') {
            bounds.extend(feature.geometry.coordinates);
            }
            else if (feature.geometry.type === 'Polygon'|| feature.geometry.type==='MultiPolygon') {
              feature.geometry.coordinates[0].forEach((coord) => {
                bounds.extend(coord);
              });
            }
          }
          map.fitBounds(bounds, {
            padding: 20
          });
      }
    }else if (source.type === 'raster' || source.type === 'image') {
      try{
      map.fitBounds([source.coordinates[1],source.coordinates[3]]);
      }catch{
        map.fitBounds([[-82.818167,4],[-65.106741,12.887742]]);
      }
    }
  }
export default flyToLayerBounds;