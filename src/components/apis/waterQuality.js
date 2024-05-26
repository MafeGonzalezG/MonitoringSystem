async function oceanQualityApi(latitude, longitude){
    const url = `https://ocean-api1.p.rapidapi.com/rtofs?depth=30&longitude=${latitude}&latitude=${longitude}`;
    const options = {
        method: 'GET',
        headers: {
            'API-Key': '<REQUIRED>',
            'X-RapidAPI-Key': 'e57a249048msh69275347d615c71p1462c8jsn68945a7a6d31',
            'X-RapidAPI-Host': 'ocean-api1.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.text();
        console.log(result);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
export default oceanQualityApi;