import OpenWeatherMap  from '../apis/openWeather';

function Layers(mapType) {
    const layers = {
        'Precipitation': {'id': 'precipitation','layertype':'raster','sourcetype':'raster', 'url': OpenWeatherMap('precipitation_new')},
        'Temperature': {'id': 'temperature','layertype':'raster', 'sourcetype':'raster','url': OpenWeatherMap('temp_new')},
        'Wind': {'id': 'wind','layertype':'raster', 'sourcetype':'raster','url': OpenWeatherMap('wind_new')},
        'Pressure': {'id': 'pressure','layertype':'raster','sourcetype':'raster', 'url': OpenWeatherMap('pressure_new')},
        'Clouds': {'id': 'clouds','layertype':'raster', 'sourcetype':'raster','url': OpenWeatherMap('clouds_new')},
        'Earthquakes': {'id': 'earthquakes','layertype':'raster','sourcetype':'image',
             'url':`https://srvags.sgc.gov.co/arcgis/services/Amenaza_Sismica/Amenaza_Sismica_Nacional/MapServer/WMSServer?request=GetMap&version=1.3.0`
             ,'epsg':'crs=CRS:84','bbox':[-84.764004,-4.998033,-66.003125,16.998958],'layer':5},
        'Cuencas' :{'id': 'cuencas','layertype':'raster','sourcetype':'image','url':`https://mapas.igac.gov.co/server/services/minasyenergia/cuencassedimentarias2010/MapServer/WMSServer?request=GetMap&version=1.1.0`
            ,'bbox':[-85.452541,-4.239657,-66.554113,16.238453],'epsg':'srs=EPSG:4326',layer:0},
        'Agricultura Familiar' : {'id':'agricultura_familiar','sourcetype':'raster','layertype':'raster','url':`https://geoservicios.upra.gov.co/arcgis/services/uso_suelo_rural/areas_probables_agricultura_familiar/MapServer/WMSServer?request=GetMap&service=WMS&bbox={bbox-epsg-3857}&styles=&format=image/png&width=265&height=256&layers=0&version=1.1.0&srs=EPSG:3857&transparent=true`},
        'Acuiferos Cesar':{'id':'acuiferos_cesar','url':`https://geoservicios.upra.gov.co/arcgis/services/adecuacion_tierras_rurales/acuiferos_cesar/MapServer/WMSServer?request=GetMap&service=WMS&bbox={bbox-epsg-3857}&styles=&format=image/png&width=265&height=256&layers=0&version=1.1.0&srs=EPSG:3857&transparent=true`,'metadata_url':'https://geoservicios.upra.gov.co/arcgis/services/adecuacion_tierras_rurales/acuiferos_cesar/MapServer/WMSServer?request=GetCapabilities&service=WMS',
            'layertype':'raster','sourcetype':'raster'},
        'Informalidad':{'id':'informalidad','url':`https://geoservicios.upra.gov.co/arcgis/services/formalizacion_propiedad/Indice_Informalidad_2014_Dep/MapServer/WMSServer?request=GetMap&service=WMS&bbox={bbox-epsg-3857}&styles=&format=image/png&transparent=true&width=265&height=256&layers=0&version=1.1.0&srs=EPSG:3857`,'metadata_url':`https://geoservicios.upra.gov.co/arcgis/services/formalizacion_propiedad/Indice_Informalidad_2014_Dep/MapServer/WMSServer?request=GetCapabilities&service=WMS`,'sourcetype':'raster'
            ,'layertype':'raster'},
        'Manglares':{'id':'manglares','url': 'https://gis.invemar.org.co/arcgis/services/SIGMA/MANGLARES_COLOMBIA/MapServer/WMSServer?request=GetMap&service=WMS&styles=&version=1.3.0&format=image/png&layers=0&crs=EPSG:3857&width=256&height=256&bbox={bbox-epsg-3857}&transparent=true',
            'layertype':'raster','sourcetype':'raster'},
        'Carbon Secuestro':{'id':'carbon_secuestro','url':'https://mapas.igac.gov.co/server/services/ambiente/potencialsecuestrocarbonoorganico/MapServer/WMSServer?request=GetMap&version=1.3.0',
            'sourcetype':'image','layertype':'raster','epsg':'crs=CRS:84','bbox':[-82.240682,-4.323733,-66.483327,16.181351],'layer':0},
        'Comunidades Negras':{'id':'comunidades_negras','url':'https://services6.arcgis.com/CagbVUK5R9TktP2I/ArcGIS/rest/services/COMUNIDAD_NEGRA_TITULADA/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryPolygon&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&relationParam=&returnGeodetic=false&outFields=&returnGeometry=true&returnCentroid=false&returnEnvelope=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&defaultSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token=',
            'sourcetype':'geojson','preprocessing':false,'layertype':'fill','title':'NOMBRE'},//now it requires a token :c
        'Fires': {'id':'fires','preprocessing':true,'sourcetype':'geojson','layertype':'circle','title':'satellite'},
        'Events':{'id':'events','layertype':'circle','sourcetype':'geojson','preprocessing':false,'url':'https://eonet.gsfc.nasa.gov/api/v3/events/geojson?&days=20','title':'title'},  
        'Military Zones':{'id':'militaryzones','layertype':'circle','sourcetype':'geojson','preprocessing':true,'title':'zone',temporal:false},
        'Water Quality' : {'id':'waterquality','sourcetype':'geojson','layertype':'circle','preprocessing':true,'title':'departamento','temporal':true,'max':3,'year_list':[2018,2019,2020,2021],'year_name':'ano'},
        'Resguardos':{'id':'resguardos','sourcetype':'geojson','layertype':'circle','preprocessing':true,'title':'name','temporal':false},
        'Temperatura Estaciones IDEAM' : {'id':'temperatura_estaciones_ideam','sourcetype':'geojson','layertype':'circle','preprocessing':true,'title':'nombre','temporal':true,'max':14,'year_list':[2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020],'year_name':'fechaobservacion','paint':{
            'circle-radius': 5,
            'circle-stroke-width': 1,
            'circle-color': [
              'interpolate',
              ['linear'],
              ['to-number',['get', 'valorobservado']], // Assuming temperature is the property in your data
              0, 'blue',
              10, 'green',
              20, 'yellow',
              30, 'orange',
              40, 'red'
            ],
            'circle-stroke-color': 'black'
          }},
        'Fallas':{'id':'fallas','sourcetype':'geojson','layertype':'line','preprocessing':false,'url':'https://services1.arcgis.com/Og2nrTKe5bptW02d/arcgis/rest/services/MAPAGEOLOGIA/FeatureServer/1/query?where=1%3D1&outFields=*&outSR=4326&f=geojson','title':'nombre','paint':{
            'line-color': 'red',
            'line-width': 2
        }},
        'Communities':{'id':'communities','sourcetype':'geojson','layertype':'circle','preprocessing':true,'title':'nombre_del_resguardo','temporal':false},
        'Hot Spots':{'id':'hotspots','sourcetype':'geojson','layertype':'fill','preprocessing':false,'title':'PATTERN','temporal':false,'url':'https://services2.arcgis.com/g8WusZB13b9OegfU/arcgis/rest/services/Emerging_Hot_Spots_2023/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson'
        },
        'Education':{'id':'education','sourcetype':'geojson','layertype':'circle','preprocessing':true,'title':'departamento','temporal':true,'max':12,'year_list':[2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],'year_name':'ano'},
    };
    return layers[mapType];
}
export default Layers;