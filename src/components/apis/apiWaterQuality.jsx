async function apiWaterQuality(){
    const API = 'https://www.datos.gov.co/resource/5dpu-htqu.json';
    try {
        const response = await fetch(API);
        const data = await response.json();
        const features  = await Promise.all(data.map(async (element) => {
            return {
                type: 'Feature',
                properties: element,
                geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(element.longitud),parseFloat(element.latitud)]
                }
            }
        }));
        const geojson = {'type': 'FeatureCollection',
                        'features': features};
        return geojson;
    } catch (error) {
        console.error('Error fetching data school:', error);
        throw error;
    }
}
export default apiWaterQuality;