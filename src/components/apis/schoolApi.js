const departmentLatLon = 
{
    'Amazonas' : {'lat': -1.0197135999005231,"lon" : -71.9383333},
    'Antioquia' : {'lat': 6.244203,"lon" : -75.581211},
    'Arauca' : {'lat': 7.084071,"lon" : -70.755943},
    'Atlántico' : {'lat': 10.6417,"lon" : -74.8731},
    'Bolívar' : {'lat': 9.366047699411888,"lon":-74.8023636},
    'Boyacá' : {'lat': 5.45451,"lon" : -73.362},
    'Bogotá, D.C.' : {'lat': 4.60971,"lon" : -74.08175},
    'Bogotá, D,C,' : {'lat': 4.60971,"lon" : -74.08175},
    'Caldas' : {'lat': 5.07,"lon" : -75.5206},
    'Caquetá' : {'lat': 0.869992,"lon" : -73.8416},
    'Casanare' : {'lat': 5.75892,"lon" : -71.5724},
    'Cauca' : {'lat': 2.413,"lon" : -76.7038},
    'Cesar' : {'lat': 9.3373,"lon" : -73.6536},
    'Chocó' : {'lat': 5.252803,"lon" : -76.826141},
    'Córdoba' : {'lat': 8.884,"lon" : -75.7906},
    'Cundinamarca' : {'lat': 4.8143,"lon" : -74.354},
    'Guainía' : {'lat': 2.5854,"lon" : -68.5247},
    'Guaviare' : {'lat': 2.582,"lon" : -72.6459},
    'Huila' : {'lat': 2.5359,"lon" : -75.5277},
    'La Guajira' : {'lat': 11.3548,"lon" : -72.5205},
    'Magdalena' : {'lat': 9.2874,"lon" : -74.7661},
    'Meta' : {'lat': 4.0897,"lon" : -73.1719},
    'Nariño' : {'lat': 1.2136,"lon" : -77.2811},
    'Norte de Santander' : {'lat': 7.9463,"lon" : -72.8988},
    'Putumayo' : {'lat': 0.4359,"lon" : -75.5277},
    'Quindio' : {'lat': 4.461,"lon" : -75.6674},
    'Risaralda' : {'lat': 5.3158,"lon" : -75.9928},
    'Archipiélago de San Andrés, Providencia y Santa Catalina' : {'lat': 12.5567,"lon" : -81.7185},
    'Santander' : {'lat': 6.6346,"lon" : -73.1703},
    'Sucre' : {'lat': 9.3067,"lon" : -75.3978},
    'Tolima' : {'lat': 4.0925,"lon" : -75.1546},
    'Valle del Cauca' : {'lat': 3.8009,"lon" : -76.6413},
    'Vaupés' : {'lat': 0.8554,"lon" : -70.812},
    'Vichada' : {'lat': 4.4234,"lon" : -69.2878}
}
async function schoolAPiCall(year){
    const API = 'https://www.datos.gov.co/resource/ji8i-4anb.json';
    try {
        const response = await fetch(API);
        const data = await response.json();
        await Promise.all(data.filter(async el => el.ano === String(year)).map(async (element) => {
            const department = element.departamento;
            const lat = departmentLatLon[department]?.lat;
            const lon = departmentLatLon[department]?.lon;
            element.lat = lat;
            element.lon = lon;
        }));
        return data;
    } catch (error) {
        console.error('Error fetching data school:', error);
        throw error;
    }
}
export default schoolAPiCall;