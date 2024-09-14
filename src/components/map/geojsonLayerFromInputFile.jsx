/**
 * Add a layer to the map based on the input file type
 * @param {Object} map - The map object.
 * @param {Object} data - The data object.
 * @param {string} inputFileName - The name of the input file.
 * @returns {null} - The function does not return anything, it adds a layer to the map.
 * @example
 * geojsonLayer(map,data,inputFileName);
 * @example
 * map.on('load', () => {
 * geojsonLayer(map,data,inputFileName);
 * }
 */
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
export default geojsonLayer;