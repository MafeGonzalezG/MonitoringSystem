async function apiTempIdeam() {
    const API = 'https://www.datos.gov.co/resource/sbwg-7ju4.json';
    const limit = 1000;
    let offset = 0;

    try {
        const allData = [];

        while (true) {
            const response = await fetch(`${API}?$limit=${limit}&$offset=${offset}`);
            const data = await response.json();

            if (data.length === 0) {
                break;
            }
            if(offset > 10000) break;

            // console.log('Fetched data:', data.length);
            allData.push(...data);
            offset += limit;
        }

        console.log('Total data fetched:', allData.length);

        const features = await Promise.all(allData.map(async (element) => {
            element['year'] = String(new Date(element.fechaobservacion).getFullYear());
            return {
                type: 'Feature',
                properties: element,
                geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(element.longitud), parseFloat(element.latitud)]
                }
            };
        }));

        // console.log('Generated features:', features);

        const geojson = {
            type: 'FeatureCollection',
            features: features
        };

        // console.log('Generated GeoJSON:', geojson);

        return geojson;
    } catch (error) {
        console.error('Error fetching or processing data:', error);
        throw error;
    }
}

export default apiTempIdeam;
