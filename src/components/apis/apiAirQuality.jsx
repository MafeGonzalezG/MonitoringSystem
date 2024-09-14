async function AirQualityMap(lat,lon) {

    const API_key ='81951b48765f92b240133d040298e4e9'
    const api = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_key}`
    try {
        const response = await fetch(api);
        const data = await response.json();
        // console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching air quality data:', error);
        throw error;
    }
}
export default AirQualityMap;