async function militaryApicall(){
    const API = 'https://www.datos.gov.co/resource/ii2p-naes.json';
    try {
        const response = await fetch(API);
        const data = await response.json();
        const features  = await Promise.all(data.map(async (element) => {
            return {
                type: 'Feature',
                properties: {
                    address: element.direccion,
                    city: element.ciudad,
                    phone: element.telefono,
                    email: element.correo_electronico,
                    zone: element.zona,
                },
                geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(element.location.longitude),parseFloat(element.location.latitude)]
                }
            }
        }));
        const geojson = {
            type: 'FeatureCollection',
            features: features
        }
        return geojson;
    } catch (error) {
        console.error('Error fetching data school:', error);
        throw error;
    }
}
export default militaryApicall;