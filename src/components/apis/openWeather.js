function openWeatherMap(type) {

    const API_key ='81951b48765f92b240133d040298e4e9'
    const api = `https://tile.openweathermap.org/map/${type}/{z}/{x}/{y}.png?appid=${API_key}`
    return api;
}
export default openWeatherMap;