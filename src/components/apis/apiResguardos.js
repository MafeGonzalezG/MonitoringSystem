const getRandomShift = () => {
    return {
      latitudeShift: Math.random() * 0.1 - 0.001,
      longitudeShift: Math.random() * 0.1 - 0.001,
    };
  };
  
  async function resguardosApi() {
    const API = 'https://www.datos.gov.co/resource/epzt-64uw.json';
    try {
      const response = await fetch(API);
      const data = await response.json();
  
      const features = await Promise.all(data.map(async (element) => {
        if (element.nombre_del_departamento === 'GUAINÍA') {
          const mapboxResponse = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${element.nombre_del_departamento+' '+element.nombre_del_municipio}.json?proximity=ip&access_token=pk.eyJ1IjoiYWNtb3JhIiwiYSI6ImNsdHlnbGszMDBpMGUyaG8wMHNzd3NvcTAifQ.Ger587FmqVP5qcFPz7mwqg`
          );
          const mapboxData = await mapboxResponse.json();
  
          if (mapboxData && mapboxData.features && mapboxData.features.length > 0) {
            const coordinates = mapboxData.features[0].geometry.coordinates;
            const { latitudeShift, longitudeShift } = getRandomShift();
  
            return {
              type: 'Feature',
              properties: {
                nombre_del_resguardo: element.nombre_del_resguardo,
                nombre_del_departamento: element.nombre_del_departamento,
                nombre_del_municipio: element.nombre_del_municipio,
                total_poblaci_n_proyecci: element.total_poblaci_n_proyecci,
              },
              geometry: {
                type: 'Point',
                coordinates: [
                  coordinates[0] + longitudeShift,
                  coordinates[1] + latitudeShift,
                ],
              },
            };
          } else {
            console.warn(
              `No coordinates found for municipio: ${element.nombre_del_municipio}`
            );
            console.log(`Mapbox response: ${JSON.stringify(mapboxData)}`); // Debugging statement
            return null;
          }
        } else {
          return null;
        }
      }));
  

      const returnedFeatures = features.filter(feature => feature !== null);
      return returnedFeatures;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
  
  export default resguardosApi;
  