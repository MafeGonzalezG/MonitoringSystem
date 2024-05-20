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

function selectCoords(element) {
    let list = element.split(',');
    var coordinates = [parseFloat(list[1]),parseFloat(list[0])]
    return coordinates
}

async function apiFires() {
    try {
        const satellite = 'MODIS_NRT';
        const data = await getFires(satellite);
        var fires = data.split("\n");
        fires.shift();
        const total_coordinates = await Promise.all(fires.map(selectCoords));
        return total_coordinates;
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}
export default apiFires;
 