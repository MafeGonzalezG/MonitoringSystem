async function getRecordByName(name) {
    try {
        const url = `https://api.catalogo.biodiversidad.co/record_search/advanced_search?scientificName=${name}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}



async function BiodiversityApiCall() {
  let items = [
    { "id": 1, "name": "Podocnemis unifilis", "lat": 3.058644, "lon": -68.479359 },
    { "id": 2, "name": "Zamia ulei", "lat": 2.138444, "lon": -68.7793123 },
    { "id": 4, "name": "Egretta thula", "lat": 2.445036, "lon": -69.723805 },
    { "id": 5, "name": "Icterus nigrogularis", "lat": 3.306687, "lon": -70.040509 },
    { "id": 6, "name": "Saimiri sciureus", "lat": 2.208613, "lon": -69.377979 },
    { "id": 7, "name": "Lampropeltis triangulum", "lat": 1.855729, "lon": -69.956783 },
    { "id": 8, "name": "Aechmea politii", "lat": 2.455947, "lon": -67.576041 },
    { "id": 9, "name": "Hypsiboas punctatus", "lat": 3.67004, "lon": -68.61716 },
    { "id": 10, "name": "Tyrannus melancholicus", "lat": 3.121325, "lon": -67.52722 },
    { "id": 11, "name": "Anolis fuscoauratus", "lat": 1.855729, "lon": -68.938582 },
    { "id": 12, "name": "Attalea butyracea", "lat": 2.328648, "lon": -70.102394 },
    { "id": 13, "name": "Chelonoidis denticulatus", "lat": 1.781141, "lon": -70.135157 },
    { "id": 14, "name": "Uracentron azureum", "lat": 2.911911, "lon": -69.524218 },
    { "id": 15, "name": "Epistephium duckei", "lat": 2.391403, "lon": -68.092779 },
    { "id": 16, "name": "Uracis imbuta", "lat": 3.384349, "lon": -69.488282 },
    { "id": 17, "name": "Canthidium funebre", "lat": 1.433663, "lon": -66.990751 },
    { "id": 18, "name": "Lepidocaryum tenue", "lat": 3.432179, "lon": -69.218765 },
    { "id": 19, "name": "Ara chloropterus", "lat": 3.796798, "lon": -67.92508 },
    { "id": 20, "name": "Ara ararauna", "lat": 3.366412, "lon": -68.206576 },
    { "id": 21, "name": "Ichthyoelephas longirostris", "lat": 2.876021, "lon": -69.075022 },
    { "id": 22, "name": "Scarus guacamaia", "lat": 3.133206, "lon": -68.302404 }
  ];
  
  for (let i = 0; i < items.length; i++){
     let info = await getRecordByName( items[i].name.replace(/\s/g, '%20'));
     //  console.log(info)
     let description = info[0]?.fullDescriptionApprovedInUse?.fullDescription?.fullDescriptionUnstructured;
     let imageUrl = info[0]?.imageInfo?.thumbnailImage;
     items[i].imageUrl = imageUrl;
     items[i].description = description;
}
  return items;
}
export default BiodiversityApiCall;