import mapboxgl from "mapbox-gl";
async function elevation(lng,lat){
    const query = await fetch(
        `https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/${lng},${lat}.json?layers=contour&limit=50&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
      );
      if (query.status !== 200) return;
      const data = await query.json();
      const allFeatures = data.features;
      const elevations = allFeatures.map((feature) => feature.properties.ele);
      const highestElevation = Math.max(...elevations);
      return highestElevation;
}
class LatLngControl {
    onAdd(map) {
        this._map = map;
        this._container = document.createElement('div');
        this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
        this._container.style.padding = '5px';
        this._container.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        this._container.style.fontFamily = 'Arial, sans-serif';
        this._container.style.fontSize = '12px';

        map.on('mousemove', this._updateLatLng.bind(this));

        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map.off('mousemove', this._updateLatLng);
        this._map = undefined;
    }
    async _updateLatLng(e) {
        const lngLat = e.lngLat;
        const elevation_current = await elevation(lngLat.lng,lngLat.lat);
        this._container.innerHTML = `Longitude: ${lngLat.lng.toFixed(4)}<br>
        Latitude: ${lngLat.lat.toFixed(4)} <br> Elevation: ${elevation_current} m`;
    }
    
}
export default LatLngControl;
