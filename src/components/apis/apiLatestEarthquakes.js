async function latestEarthquakes(){const url = 'https://global-earthquake-live-data.p.rapidapi.com/get/month';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'e57a249048msh69275347d615c71p1462c8jsn68945a7a6d31',
		'X-RapidAPI-Host': 'global-earthquake-live-data.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.json();
    const features = await Promise.all(result.map(async (earthquake)=> (
        {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [earthquake.coordinates[0],earthquake.coordinates[1]]
            },
            'properties': {
                "mag": earthquake.mag,
                "place": earthquake.place,
                "time": earthquake.time,
                "updated": earthquake.updated,
                "tz": earthquake.tz,
                "felt": earthquake.felt,
                "cdi": earthquake.cdi,
                "mmi": earthquake.mmi,
                "alert": earthquake.alert,
                "status": earthquake.status,
                "tsunami": earthquake.tsunami,
                "sig": earthquake.sig,
                "net": earthquake.net,
                "code": earthquake.code,
                "ids": earthquake.ids,
                "sources": earthquake.sources,
                "types": earthquake.types,
                "nst": earthquake.nst,
                "dmin": earthquake.dmin,
                "rms": earthquake.rms,
                "gap": earthquake.gap,
                "magType": earthquake.magType,
                "type": earthquake.type,
                "title": earthquake.title,
                "id": earthquake.id
            }
        })));
	const geojson = {
        'type': 'FeatureCollection',
        'features':  features.filter(feature => feature !== null)
    }
    return geojson;
} catch (error) {
	console.error(error);
}
}

export default latestEarthquakes;