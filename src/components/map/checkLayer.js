/**
 * This function removes a layer from the map if it exists. It also removes the source of the layer if it exists.
 * the source has the same name as the layer as defined in layersLogic.js.
 * This is done because before adding a layer to the map, it is necessary to remove it if it already exists.
 * @param {Object} map - The map object.
 * @param {Array} layerIds - The layer ids as appears in the map component.
 * @returns {null} - The function does not return anything, it removes a layer from the map if it exists.
 * @example 
 * checkLayer(mapRef, ['layerId1','layerid2']);
 */
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
export default checkLayer;