import mapboxgl from "mapbox-gl";
/**
 * Add a generic popup to a layer.
 * @param {Object} map - The map object.
 * @param {string} layerId - The layer id as appears in the map component.
 * @param {string} MainKey - The main key that appears in the popup, it depends on the metadata
 * @returns {null} - The function does not return anything, it adds a popup to the map.
 * @example
 * addGenericPopUp(mapRef, 'Manglares_layer_id','titulo en metadata');
 */

function prettyFormat(value) {
    // This function is used to format the metadata values in the popup.
    if (typeof value === "string") {
      const newValue = value.replace(/_/g, " ");
      return newValue.charAt(0).toUpperCase() + newValue.slice(1).toLowerCase();
    }
    return value;
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
export default addGenericPopUp;