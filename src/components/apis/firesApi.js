async function getFires(satellite){
    try {
        const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/3765dd8f544a3bf019def9f860c963d2/${satellite}/world/2/`;
        const response = await fetch(url);
        const data = await response.text();
        // console.log(data);
        return data;
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}


async function apiFires() {
    try {
        const satellite = 'MODIS_NRT';
        const data = await getFires(satellite);
        var fires = data.split("\n");
        fires.shift();
        const total_coordinates = await Promise.all(fires.map(async (element) => {
            const [latitude,longitude,brightness,scan,track,acq_date,acq_time,satellite,instrument,confidence,version,bright_t31,frp,daynight] = element.split(',');
            const feature = {'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [parseFloat(longitude), parseFloat(latitude)],
                        
                    },
                'properties': {
                            'brightness': brightness,
                            'scan': scan,
                            'track': track,
                            'satellite': satellite,
                            'instrument': instrument,
                            'confidence': confidence,
                            'version': version,
                            'bright_t31': bright_t31,
                            'frp': frp,
                            'daynight': daynight,
                            'acq_date': acq_date,
                            'acq_time': acq_time
                        }};
            return feature;
        }));
        const geojson = {'type': 'FeatureCollection',
                        'features': total_coordinates};
        console.log(geojson);
        return geojson;
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}
export default apiFires;
 