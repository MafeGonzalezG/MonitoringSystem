import * as turf from '@turf/turf';
import addGenericPopUp from './addGenericPopUp';
import Layers from './layers';

class FilterControl {
  onAdd(map) {
    this._map = map;
    this._originalData = {};
    this._container = document.createElement('div');
    this._container.className = 'mapboxgl-ctrl';
    this._container.innerHTML = '<button id="filter-btn"><i class="bi bi-crop"></i></button>';
    this._container.querySelector('#filter-btn').addEventListener('click', () => this.filterLayers());
    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }

  setDrawnFeatures(features) {
    this._drawnFeatures = features;
  }
  setLayersToFilter(layers) {
    this._layersToFilter = layers;
  }
  async fetchData(url) {
    const response = await fetch(url);
    return response.json();
  }

  async loadLayerData(layerId) {
    const source = this._map.getSource(layerId);
    if (typeof source._data === 'object') {
      this._originalData[layerId] = source._data;
    } else {
      // Handle URL-based sources
      const url = this._map.getSource(layerId)._data;
      if (url) {
        this._originalData[layerId] = await this.fetchData(url);
      }
    }
  }

  async setDataForLayer(layerId, data) {
    const source = this._map.getSource(layerId);
    if (source) {
      source.setData(data);
    }
  }
  async filterLayers() {
    if (this._drawnFeatures.features.length === 0) {
      alert('No features drawn');
      return;
    }
  
    // Filter the drawn features to get polygons and multipolygons
    const drawnPolygons = this._drawnFeatures.features.filter(
      feature => feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon'
    );
    
    if (drawnPolygons.length === 0) {
      alert('No polygons or multipolygons drawn');
      return;
    }
  
    // Combine the drawn polygons into a single geometry
    let combinedPolygon;
    if (drawnPolygons.length === 1) {
      combinedPolygon = drawnPolygons[0];
    } else {
      combinedPolygon = turf.union(...drawnPolygons);
    }
  
    for (const layerId of this._layersToFilter) {
      if(this._map.getSource(layerId).type === 'geojson'){
        await this.loadLayerData(layerId);
        const originalData = this._originalData[layerId];
      
        // Determine how to filter based on feature type
        const updatedFeatures = originalData.features.map(feature => {
          switch (feature.geometry.type) {
            case 'Point':
              return {
                ...feature,
                properties: {
                  ...feature.properties,
                  within: turf.booleanPointInPolygon(feature, combinedPolygon)
                }
              };
    
            case 'Polygon':
            case 'LineString':
            case 'MultiPolygon':
              return {
                ...feature,
                properties: {
                  ...feature.properties,
                  within: turf.booleanIntersects(feature, combinedPolygon) // or turf.booleanContains
                }
              };
    
            default:
              return feature;
          }
        }
    );
  
      const updatedData = {
        type: 'FeatureCollection',
        features: updatedFeatures
      };
  
      this.setDataForLayer(layerId, updatedData);
      const filterExpression = ['==', ['get', 'within'], true];
      this._map.setFilter(layerId, filterExpression);
    }else if(this._map.getSource(layerId).type === 'raster'){
      console.log('raster layers are difficult to filter');
      // this._originalData[layerId] = this._map.getSource(layerId).bounds;
      // const newBounds = turf.bbox(combinedPolygon);
      // this._map.getSource(layerId).bounds = newBounds;
    }
  }}
  
  // Call this method to reset the filter and remove the temporary layers
  resetFilter() {
    this._layersToFilter.forEach(layerId => {
      // Reset the data to its original state
      this._map.getSource(layerId).setData(this._originalData[layerId]);
  
      // Remove the filter
      this._map.setFilter(layerId, null);
    });
  }
    
}
export default FilterControl;
