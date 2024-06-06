async function apiTempIdeam(){
    const API = 'https://www.datos.gov.co/resource/sbwg-7ju4.json';
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
        return features;
    } catch (error) {
        console.error('Error fetching data ideam temp:', error);
        throw error;
    }
}
export default apiTempIdeam;