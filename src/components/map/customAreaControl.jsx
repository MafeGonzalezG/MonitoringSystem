class AreaControl {
    onAdd(map) {
      this._map = map;
      this._container = document.createElement('div');
      this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
      this._container.style.padding = '5px';
      this._container.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
      this._container.style.fontFamily = 'Arial, sans-serif';
      this._container.style.fontSize = '12px';
      this._container.textContent = 'Area: 0 sq meters';
      return this._container;
    }
  
    onRemove() {
      this._container.parentNode.removeChild(this._container);
      this._map = undefined;
    }
  
    updateArea(areas,lengths) {
      const areaTexts = areas.map((element,index) => `Area ${index}: ${element.toFixed(2)} m<sup>2</sup>`);
      const lengthTexts = lengths.map((element ,index)=> `Length ${index}: ${element.toFixed(2)} m`);
    
      const areaHTML = `<div class="area-section">${areaTexts.join('<br>')}</div>`;
      const lengthHTML = `<div class="length-section">${lengthTexts.join('<br>')}</div>`;
    
      this._container.innerHTML = areaHTML + '<div class="spacer"></div>' + lengthHTML;
    }
  }
export default AreaControl;  