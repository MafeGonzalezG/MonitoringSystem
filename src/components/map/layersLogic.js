import ApiManager from '../apis/apiCountryManager.js';
import Layers from './layers.js';
import { useEffect,useState} from 'react';
import BiodiversityApiCall from '../apis/biodiversityApi.js';
function checkLayer(map, layerId) {
    if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
        map.removeSource(layerId);
    }
}
function moveMap( countryInfo, map){
    
    const { latlng } = countryInfo;
    map.flyTo({
        center: [latlng[1], latlng[0]],
        zoom: 4,
        speed: 2,
        curve: 1,
        easing(t) {
        return t;
        },
    });
}
function LayersLogic({map,country,mapType}){
    const [currentLayer,setCurrentLayer] = useState(null);
    useEffect(() => {
        if (map && mapType === 'Precipitation') {
            const layerId = 'Precipitation';
            checkLayer(map, layerId);
            checkLayer(map, currentLayer);
            setCurrentLayer(layerId);
            map.addLayer(Layers(mapType,layerId));
        } else if (map && mapType === 'Clouds'){
            const layerId = 'Clouds';
            checkLayer(map, layerId);
            checkLayer(map, currentLayer);  
            map.addLayer(Layers(mapType,layerId));
        }else if (map && mapType === 'Temperature'){
            const layerId = 'Temperature';
            checkLayer(map, layerId);
            checkLayer(map, currentLayer);  
            setCurrentLayer(layerId);
            map.addLayer(Layers(mapType,layerId));
        }else if (map && mapType === 'Pressure'){
            const layerId = 'Pressure';
            checkLayer(map, layerId);
            checkLayer(map, currentLayer);  
            setCurrentLayer(layerId);
            map.addLayer(Layers(mapType,layerId));
        }
        else if (map && mapType === 'Wind'){
            const layerId = 'Wind';
            checkLayer(map, layerId);
            checkLayer(map, currentLayer);  
            setCurrentLayer(layerId);
            map.addLayer(Layers(mapType,layerId));
        }
        else if (map && mapType === 'Biodiversity'){
            const layerId = 'Biodiversity';
            BiodiversityApiCall().then((data) => {
                console.log(data);
            }
            );}
    }, [map,mapType]); 
      
    useEffect(() => {
        const getCountry = async () => {
            const countryInfo = await ApiManager.fetchInfo(country);
            if (map && countryInfo) {
              moveMap(countryInfo, map);
            }
          };
        getCountry();
     }, [country]);
    }
export default LayersLogic;