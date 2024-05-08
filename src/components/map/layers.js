import openWeatherMap from "../apis/openWeather";

function Layers(mapType,layerId) {
    const commonObject = {
        'id': layerId,
        'type': 'raster',
        'source': {
            'type': 'raster',
            'tiles': [],
            'tileSize': 256
        }
    };

    if (mapType === 'Precipitation') {
        commonObject.source.tiles.push(openWeatherMap('precipitation_new'));
    } else if (mapType === 'Clouds') {
        commonObject.source.tiles.push(openWeatherMap('clouds_new'));
    } else if( mapType === 'Pressure'){
        commonObject.source.tiles.push(openWeatherMap('pressure_new'));
    } else if (mapType === 'Wind'){
        commonObject.source.tiles.push(openWeatherMap('wind_new'));
    } else if (mapType === 'Temperature'){
        commonObject.source.tiles.push(openWeatherMap('temp_new'));
    }

    return commonObject;
}
export default Layers;
//'https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=81951b48765f92b240133d040298e4e9'