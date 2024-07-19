import * as turf from '@turf/turf';
import addGenericPopUp from './addGenericPopUp';
import Layers from './layers';
class FilterControl {
  onAdd(map) {
    this._map = map;
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

  filterLayers() {
    if (this._drawnFeatures.features.length === 0) {
      alert('No features drawn');
      return;
    }

    const drawnPolygons = this._drawnFeatures.features.filter(feature => feature.geometry.type === 'Polygon');
    if (drawnPolygons.length === 0) {
      alert('No polygons drawn');
      return;
    }

    this._layersToFilter.forEach(layerId => {
      const features = this._map.querySourceFeatures(layerId);
      const pointsInsidePolygons = features.filter(feature => {
        if (feature.geometry.type === 'Point') {
          return drawnPolygons.some(polygon => turf.booleanPointInPolygon(feature, polygon));
        }
        return false; // Other feature types are not considered
      });

      // Set the visibility of the original layer to 'none'
      this._map.setLayoutProperty(layerId, 'visibility', 'none');

      // Create a temporary layer with the points inside the polygon
      const temporaryLayerId = `${layerId}-filtered`;
      if (this._map.getLayer(temporaryLayerId)) {
        this._map.removeLayer(temporaryLayerId);
        this._map.removeSource(temporaryLayerId);
      }

      this._map.addSource(temporaryLayerId, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: pointsInsidePolygons
        }
      });

      this._map.addLayer({
        id: temporaryLayerId,
        type: 'circle',
        source: temporaryLayerId,
        paint: {
          'circle-radius': 5,
          'circle-color': '#FF0000'
        }
      });
      const name = (layerId.charAt(0).toUpperCase() + layerId.substring(1).toLowerCase()).replace(/_/g, ' ');
      addGenericPopUp(this._map, temporaryLayerId, Layers(name).title);
    });
  }

  // Call this method to reset the filter and remove the temporary layers
  resetFilter() {
    this._layersToFilter.forEach(layerId => {
      const temporaryLayerId = `${layerId}-filtered`;
      if (this._map.getLayer(temporaryLayerId)) {
        this._map.removeLayer(temporaryLayerId);
        this._map.removeSource(temporaryLayerId);
      }
      this._map.setLayoutProperty(layerId, 'visibility', 'visible');
    });
  }
}

export default FilterControl;
