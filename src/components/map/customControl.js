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
    _updateLatLng(e) {
        const lngLat = e.lngLat;
        // const elevation = this._map.queryTerrainElevation(lngLat);
        this._container.innerHTML = `Longitude: ${lngLat.lng.toFixed(4)}<br>
        Latitude: ${lngLat.lat.toFixed(4)}`;
    }
}
export default LatLngControl;
