import streamlit as st

def jsLayers(map_type: str) -> dict:
  """
  Function for organizing the information of the layers to be displayed in the map.
  Args:
    map_type: str. The type of map to be displayed.
  Returns:
    dict. Dictionary with the info of the layers of the map.
  """
  ##################################
  ### Raster
  ##################################
  
  # Weather
  Precipitation = {
    "id": "precipitation",
    "name": "Precipitation",
    "layertype": "raster",
    "sourcetype": "raster",
    "url": OpenWeatherMap("precipitation_new"),
    "attributions": "OpenWeatherMap",
    "legend": True,
    "legendSettings": [ {
    "legendType": "gradient",
    "legendTitle": "Precipitation (mm)",
    "legendPositions": [0, 0.1, 0.2, 0.5, 1, 10, 140],
    "legendColors": [
      "rgba(225, 200, 100, 0)",
      "rgba(200, 150, 150, 0)",
      "rgba(150, 150, 170, 0)",
      "rgba(120, 120, 190, 0)",
      "rgba(110, 110, 205, 0.3)",
      "rgba(80, 80, 225, 0.7)",
      "rgba(20, 20, 255, 0.9)",
    ],}],
  }
  Temperature = {
    "id": "temperature",
    "name": "Temperature",
    "layertype": "raster",
    "sourcetype": "raster",
    "url": OpenWeatherMap("temp_new"),
    "attributions": "OpenWeatherMap",
    "legend": True,
    "legendSettings": [ {
    "legendType": "gradient",
    "legendTitle": "Temperature °C",
    "legendPositions": [-65, -55, -45, -40, -30, -20, -10, 0, 10, 20, 25, 30],
    "legendColors": [
      "rgba(130, 22, 146, 1)",
      "rgba(130, 22, 146, 1)",
      "rgba(130, 22, 146, 1)",
      "rgba(130, 22, 146, 1)",
      "rgba(130, 87, 219, 1)",
      "rgba(32, 140, 236, 1)",
      "rgba(32, 196, 232, 1)",
      "rgba(35, 221, 221, 1)",
      "rgba(194, 255, 40, 1)",
      "rgba(255, 240, 40, 1)",
      "rgba(255, 194, 40, 1)",
      "rgba(252, 128, 20, 1)",
    ],}],
  }
  Wind = {
    "id": "wind",
    "name": "Wind",
    "layertype": "raster",
    "sourcetype": "raster",
    "url": OpenWeatherMap("wind_new"),
    "attributions": "OpenWeatherMap",
    "legend": True,
    "legendSettings": [ {
    "legendType": "gradient",
    "legendTitle": "Wind (m/s)",
    "legendPositions": [1, 5, 15, 15, 25, 50, 100, 200],
    "legendColors": [
      "rgba(255,255,255, 0)",
      "rgba(238,206,206, 0.4)",
      "rgba(179,100,188, 0.7)",
      "rgba(179,100,188, 0.7)",
      "rgba(63,33,59, 0.8)",
      "rgba(116,76,172, 0.9)",
      "rgba(70,0,175,1)",
      "rgba(13,17,38,1)",
    ],}],
  }
  Pressure = {
    "id": "pressure",
    "name": "Pressure",
    "layertype": "raster",
    "sourcetype": "raster",
    "url": OpenWeatherMap("pressure_new"),
    "attributions": "OpenWeatherMap",
    "legend": True,
    "legendSettings": [ {
    "legendType": "gradient",
    "legendTitle": "Pressure (Pa)",
    "legendPositions": [
      94000, 96000, 98000, 100000, 101000, 102000, 104000, 106000, 108000,
    ],
    "legendColors": [
      "rgba(0,115,255,1)",
      "rgba(0,170,255,1)",
      "rgba(75,208,214,1)",
      "rgba(141,231,199,1)",
      "rgba(176,247,32,1)",
      "rgba(240,184,0,1)",
      "rgba(251,85,21,1)",
      "rgba(243,54,59,1)",
      "rgba(198,0,0,1)",
    ],}],
  }
  Clouds = {
    "id": "clouds",
    "name": "Clouds",
    "layertype": "raster",
    "sourcetype": "raster",
    "url": OpenWeatherMap("clouds_new"),
    "attributions": "OpenWeatherMap",
    "legend": True,
    "legendSettings": [{
    "legendType": "gradient",
    "legendTitle": "Clouds (%)",
    "legendPositions": [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    "legendColors": [
      "rgba(255, 255, 255, 0.0)",
      "rgba(253, 253, 255, 0.1)",
      "rgba(252, 251, 255, 0.2)",
      "rgba(250, 250, 255, 0.3)",
      "rgba(249, 248, 255, 0.4)",
      "rgba(247, 247, 255, 0.5)",
      "rgba(246, 245, 255, 0.75)",
      "rgba(244, 244, 255, 1)",
      "rgba(243, 242, 255, 1)",
      "rgba(242, 241, 255, 1)",
      "rgba(240, 240, 255, 1)",
    ],
  }]
  }
  Cesar_Aquifers = {
    "id": "cesar_aquifers",
    "name": "Cesar Aquifers",
    "url": "https://geoservicios.upra.gov.co/arcgis/rest/services/adecuacion_tierras_rurales/acuiferos_cesar/MapServer/tile/{z}/{y}/{x}",
    "attributions": "UPRA",
    "metadata_url":
      "https://geoservicios.upra.gov.co/arcgis/services/adecuacion_tierras_rurales/acuiferos_cesar/MapServer/WMSServer?request=GetCapabilities&service=WMS",
    "layertype": "raster",
    "sourcetype": "raster",
    "legend": True,
    "legendSettings": [ {
    "legendType": "jsonsource",
    "legendSource":
      "https://geoservicios.upra.gov.co/arcgis/rest/services/adecuacion_tierras_rurales/acuiferos_cesar/MapServer/legend?f=pjson",
    "legendTitle": "Cesar Aquifers",
    "legendSourceMetadata": {
      'item':0,}
    }]
  }
  Family_Agriculture = {
    "id": "family_agriculture",
    "name": "Family Agriculture",
    "sourcetype": "raster",
    "layertype": "raster",
    "url": "https://geoservicios.upra.gov.co/arcgis/rest/services/uso_suelo_rural/areas_nameprobables_agricultura_familiar/MapServer/tile/{z}/{y}/{x}",
    "attributions": "UPRA",
  }
  Earthquakes = {
    "id": "earthquakes",
    "name": "Earthquakes",
    "layertype": "raster",
    "sourcetype": "raster",
    "url": "https://srvags.sgc.gov.co/arcgis/services/Amenaza_Sismica/Amenaza_Sismica_Nacional/MapServer/WMSServer",
    "version": "1.3.0",
    "attributions": "SGC",
    "epsg": "crs=CRS:84",
    "temporal": False,
    "layer": 5,
    "format": "image/png",
    "legend": True,
    "legendSettings": [ {
    "legendType": "jsonsource",
    "legendSource": "https://srvags.sgc.gov.co/arcgis/rest/services/Amenaza_Sismica/Amenaza_Sismica_Nacional/MapServer/legend?f=pjson",
    "legendTitle": "Earthquakes",
    "legendSourceMetadata": {
      'item':10,}},
    {
    "legendType": "xmlsource",
    "legendSource": "https://srvags.sgc.gov.co/arcgis/rest/services/Amenaza_Sismica/Amenaza_Sismica_Nacional/MapServer/info/metadata",
    "legendTitle": None,
    "legendSourceMetadata": {
      'abstract':'idAbs',
      'Proposito':'idPurp',
      'credito':'idCredit',}
    }
  ]
  }
  Cuencas = {
    "id": "cuencas",
    "name": "Cuencas",
    "layertype": "raster",
    "sourcetype": "raster",
    "url": "https://mapas.igac.gov.co/server/services/minasyenergia/cuencassedimentarias2010/MapServer/WMSServer",
    "version": "1.1.0",
    "format": "image/png",
    "attributions": "IGAC",
    "temporal": False,
    "epsg": "srs=epsg:4326",
    "layer": 0,
  } #maybe service is now blocked
  Informality = {
    "id": "informality",
    "name": "Informality",
    "url": "https://geoservicios.upra.gov.co/arcgis/services/formalizacion_propiedad/Indice_Informalidad_2014_Dep/MapServer/WMSServer?request=GetMap&service=WMS&bbox={bbox-epsg-3857}&styles=&format=image/png&transparent=True&width=265&height=256&layers=0&version=1.1.0&srs=epsg:3857",
    "metadata_url": "https://geoservicios.upra.gov.co/arcgis/services/formalizacion_propiedad/Indice_Informalidad_2014_Dep/MapServer/WMSServer?request=GetCapabilities&service=WMS",
    "sourcetype": "raster",
    "layertype": "raster",
    "legend": True,
    "legendSettings": [ {
    "legendType": "jsonsource",
    "legendSource":
      "https://geoservicios.upra.gov.co/arcgis/rest/services/formalizacion_propiedad/estimacion_informalidad/MapServer/legend?f=pjson",
    "legendTitle": "Informality",
    "legendSourceMetadata": {
      'item':0,}
    }]
  }
  Mangroves = {
    "id": "Mangroves",
    "name": "Mangroves",
    "url": "https://gis.invemar.org.co/arcgis/services/SIGMA/MANGLARES_COLOMBIA/MapServer/WMSServer",
    "version": "1.3.0",
    "format": "image/png",
    "layer": "0",
    "layertype": "raster",
    "sourcetype": "raster",
    "legend": True,
    "legendSettings": [ {
    "legendType": "xmlsource",
    "legendTitle": "Mangroves",
    "legendSource":
      "https://gis.invemar.org.co/arcgis/rest/services/SIGMA/MANGLARES_COLOMBIA/MapServer/info/metadata",
    "legendSourceMetadata": {
      'abstract':'idAbs',
      'Proposito':'idPurp',
      'credito':'idCredit',}
    }]
  }
  Deforestation = {
    "id": "deforestation",
    "name": "Deforestation",
    "sourcetype": "raster",
    "layertype": "raster",
    "temporal": True,
    "url": "https://gis.siatac.co/arcgis/services/MAC_DatosAbiertos/Cob_Region_100K_",
    "year_list" : [2002, 2007, 2012, 2014, 2016, 2028, 2020, 2021,2022],
    "bbox": [-77.670617,-4.225780,-66.847215,4.948186],
    "epsg": 'srs="epsg":4170',
    "layer": 0,
  }
  Carbon_Sequestration = {
    "id": "carbon_sequestration",
    "name": "Carbon Sequestration",
    "url": "https://mapas.igac.gov.co/server/services/ambiente/potencialsecuestrocarbonoorganico/MapServer/WMSServer?request=GetMap&version=1.3.0",
    "sourcetype": "raster",
    "layertype": "raster",
    "epsg": "crs=CRS:84",
    "bbox": [-82.240682, -4.323733, -66.483327, 16.181351],
    "layer": 0,
    "legend": True,
    "legendSettings": [ {
    "legendSource": "https://mapas.igac.gov.co/server/rest/services/ambiente/potencialsecuestrocarbonoorganico/MapServer/legend?f=pjson",
    "legendType": "jsonsource",
    "legendTitle": "Carbon Sequestration",
    "legendSourceMetadata": {
      'item':0,}
    }]
  }
  
  #Sentinel wms services
  instance_id = "6cfcff16-7d83-45c8-a78f-7b81488fd4a1"
  wms_url = f"https://sh.dataspace.copernicus.eu/ogc/wms/{instance_id}"
  True_Color = {
    "id": "true_color",
    "name": "True Color",
    "url": wms_url,
    "sourcetype": "raster",
    "layertype": "raster",
    "version": "1.1.1",
    "maxcc": 20,
    "layer": "TRUE_COLOR",
    "format": "image/jpeg",
    "attributions": "Copernicus",
    "srs": "EPSG:3857",
  }
  ##################################
  ### GeoJSON
  ##################################
  
  
  Black_Communities = {
    "id": "black_communities",
    "url": "https://services6.arcgis.com/CagbVUK5R9TktP2I/ArcGIS/rest/services/COMUNIDAD_NEGRA_TITULADA/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryPolygon&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&relationParam=&returnGeodetic=false&outFields=&returnGeometry=True&returnCentroid=false&returnEnvelope=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&defaultSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=True&quantizationParameters=&sqlFormat=none&f=pgeojson&token=",
    "sourcetype": "geojson",
    "preprocessing": False,
    "hexagons": False,
    "layertype": "fill",
    "title": "NOMBRE",
  } #now it requires a token :c
  Fires = {
    "id": "fires",
    "preprocessing": True,
    "hexagons": False,
    "sourcetype": "geojson",
    "layertype": "circle",
    "title": "satellite",
  }
  NASA_Events = {
    "id": "events",
    "fields": ["title", "date"],
    "aliases": ["Title", "Date"],
    "layertype": "circle",
    "sourcetype": "geojson",
    "preprocessing": False,
    "hexagons": False,
    "url": "https://eonet.gsfc.nasa.gov/api/v3/events/geojson?&days=20",
    "title": "title",
  }
  Military_Zones = {
    "id": "militaryzones",
    "fields": ["ciudad", "direccion", "telefono", "correo_electronico"],
    "aliases": ["City", "Direction", "Telephone number", "Email address"],
    "layertype": "circle",
    "sourcetype": "geojson",
    "preprocessing": False,
    "hexagons": False,
    "title": "zone",
    "temporal": False,
    "url" :"https://www.datos.gov.co/resource/ii2p-naes.geojson"
  }
  Water_Quality = {
    "id": "waterquality",
    "sourcetype": "geojson",
    "layertype": "circle",
    "preprocessing": True,
    "title": "departamento",
    "temporal": True,
    "year_list": [2018, 2019, 2020, 2021],
    "year_name": "ano",
  }
  Reserves = {
    "id": "reserves",
    "sourcetype": "geojson",
    "layertype": "circle",
    "preprocessing": True,
    "hexagons": False,
    "title": "name",
    "temporal": False,
  }
  IDEAM_Station_Temperatures = {
    "id": "ideamstationtemperatures",
    "sourcetype": "geojson",
    "layertype": "circle",
    "preprocessing": True,
    "hexagons": False,
    "title": "nombre",
    "temporal": True,
    "year_list": [
      2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016,
      2017, 2018, 2019,2020
    ],
    "year_name": "year",
    "paint": {
      "circle-radius": 7,
      "circle-stroke-width": 1,
      "circle-color": [
        "interpolate",
        ["linear"],
        ["to-number", ["get", "valorobservado"]], # Assuming temperature is the property in your data
        0,
        "blue",
        10,
        "green",
        20,
        "yellow",
        30,
        "orange",
        40,
        "red",
      ],
      "circle-stroke-color":'transparent'
    },
    "legend": True,
    "legendSettings": [ {
    "legendType": "gradient",
    "legendTitle": "Temperature (°C)",
    "legendPositions": [0, 10, 20, 30, 40],
    "legendColors": ["blue", "green", "yellow", "orange", "red"],
    }]
  }
  Tectonic_Failures = {
    "id": "failures",
    "name": "Tectonic Failures",
    "sourcetype": "geojson",
    "layertype": "line",
    "preprocessing": False,
    "hexagons": False,
    "url": "https://services1.arcgis.com/Og2nrTKe5bptW02d/arcgis/rest/services/MAPAGEOLOGIA/FeatureServer/1/query?where=1%3D1&outFields=*&outSR=4326&f=geojson",
    "title": "nombre",
    "paint": {
      "line-color": "red",
      "line-width": 2,
    },
    "legend": True,
    "legendSettings": [ {
    "legendSource":"https://www.arcgis.com/sharing/rest/content/items/c05c6dbf27f645eb883bae3a9cd0d08f/info/metadata/metadata.xml",
    "legendType": "xmlsource",
    "legendTitle": "Fallas",
    "legendSourceMetadata": {
      'abstract':'idAbs',
      'restrictions':'resConst >Consts > useLimit'}
    }]
  }
  Communities = {
    "id": "communities",
    "sourcetype": "geojson",
    "layertype": "circle",
    "preprocessing": True,
    "hexagons": False,
    "title": "nombre_del_resguardo",
    "temporal": False,
  }
  Hot_Spots = {
    "id": "hotspots",
    "sourcetype": "geojson",
    "layertype": "multipolygon",
    "fields": ["PATTERN", "Shape__Area", "Shape__Length"],
    "aliases": ["Pattern", "Area", "Length"],
    "preprocessing": False,
    "hexagons": False,
    "title": "PATTERN",
    "temporal": False,
    "url": "https://services2.arcgis.com/g8WusZB13b9OegfU/arcgis/rest/services/Emerging_Hot_Spots_2023/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson",
    "legend": True,
    "legendSettings": [ {
    "legendTitle": "Hot Spots",
    "legendType": "xmlsource",
    "legendSource": "https://services2.arcgis.com/g8WusZB13b9OegfU/ArcGIS/rest/services/Emerging_Hot_Spots_2023/FeatureServer/info/metadata",
    "legendSourceMetadata": {
      'abstract':'idAbs',
      'restrictions':'resConst >Consts > useLimit',}
    }]
  }
  Education = {
    "id": "education",
    "sourcetype": "geojson",
    "layertype": "circle",
    "preprocessing": True,
    "hexagons": False,
    "title": "departamento",
    "temporal": True,
    "year_list": [
      2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022,
    ],
    "year_name": "ano",
  }
  Mining = {
    "id": "mining",
    "sourcetype": "geojson",
    "layertype": "multipolygon",
    "fields": ["type", "company", "status", "area_ha"],
    "aliases": ["Type", "Company", "Status", "Area (ha)"],
    "preprocessing": True,
    "hexagons": False,
    "title": "status",
    "temporal": False,
    "url": "http://gis-gfw.wri.org/arcgis/rest/services/country_data/south_america/MapServer/7/query?outFields=*&where=1%3D1&f=geojson",
    "large":True,
  }
  Indigenous_Reserves ={
    "id": "indigenousreserves",
    "sourcetype": "geojson",
    "layertype": "fill",
    "preprocessing": True,
    "hexagons": False,
    "title": "NOMBRE",
    "temporal": False,
    "url": "https://services6.arcgis.com/CagbVUK5R9TktP2I/ArcGIS/rest/services/RESGUARDO_INDIGENA_LEGALIZADO/FeatureServer/0/query?where=1%3D1&outFields=*&f=geojson",
    "large":True,
  } #Token required
  Carbon_removals_mean_value = {
    "id": "carbon_removals_mean_value",
    "name": "Carbon removals mean value",
    "url": "data/cacahual_db.csv",
    "label_to_plot": "Carbon removals mean value (m.u.)",
    "sourcetype": "geojson",
    "layertype": "hexagons",
    "preprocessing": True,
    "hexagons": True,
  }
  Tropical_tree_cover_mean_value = {
    "id": "tropical_tree_cover_mean_value",
    "name": "Tropical tree cover mean value",
    "url": "data/cacahual_db.csv",
    "label_to_plot": "Tropical tree cover mean value (m.u.)",
    "sourcetype": "geojson",
    "layertype": "hexagons",
    "preprocessing": True,
    "hexagons": True,
  }
  
  ### Event-driven
  Air_Quality = {
    "id": 'airquality',
    "sourcetype": 'event-driven',
    "layertype": 'circle',
    "preprocessing":'True'
  }
  Test = {
    'id':'test',
    '"sourcetype"':'geojson',
    '"layertype"':'circle',
    'preprocessing':False,
    'title':'nombreestacion',
    'temporal':True,
    '"url"':'http://localhost:8080/geoserver/Temperatura/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Temperatura%3Atemperature&maxFeatures=100&outputFormat=application%2Fjson',
    'year_list':[2016,2017,2018,2019,2020,2021,2022,2023,2024],
    'year_name':'year',
    "paint": {
      "circle-radius": 7,
      "circle-stroke-width": 1,
      "circle-color": [
        "interpolate",
        ["linear"],
        ["to-number", ["get", "valorobservado"]], # Assuming temperature is the property in your data
        0,
        "blue",
        10,
        "green",
        20,
        "yellow",
        30,
        "orange",
        40,
        "red",
      ],
      "circle-stroke-color":'transparent'
    },
    "legend": True,
    "legendSettings": [ {
    "legendType": "gradient",
    "legendTitle": "Temperature (°C)",
    "legendPositions": [0, 10, 20, 30, 40],
    "legendColors": ["blue", "green", "yellow", "orange", "red"],
  }    ]}
  
  
  ##################################
  
  layers = {
    ########################################
    ### Raster
    ########################################
    "Precipitation": Precipitation,
    "Temperature": Temperature,
    "Wind": Wind,
    "Pressure": Pressure,
    "Clouds": Clouds,
    "Earthquakes": Earthquakes,
    "Cuencas": Cuencas,
    "Family Agriculture": Family_Agriculture,
    "Cesar Aquifers": Cesar_Aquifers,
    "Informality": Informality,
    "Mangroves": Mangroves,
    "Carbon Sequestration": Carbon_Sequestration,
    "True Color": True_Color,
    ########################################
    ### GeoJSON
    ########################################
    "Black Communities": Black_Communities,
    "Fires": Fires,
    "NASA Events": NASA_Events,
    "Military Zones": Military_Zones,
    "Water Quality": Water_Quality,
    "Reserves": Reserves,
    "IDEAM Station Temperatures": IDEAM_Station_Temperatures,
    "Tectonic Failures": Tectonic_Failures,
    "Communities": Communities,
    "Hot Spots": Hot_Spots,
    "Education": Education,
    "Deforestation": Deforestation,
    "Mining": Mining,
    "Indigenous Reserves": Indigenous_Reserves,
    "Air Quality": Air_Quality,
    "Test": Test,
    "Carbon removals mean value": Carbon_removals_mean_value,
    "Tropical tree cover mean value": Tropical_tree_cover_mean_value,
    }
  
  
  return layers[map_type]

def OpenWeatherMap(type:str) -> str:
    API_key ='81951b48765f92b240133d040298e4e9'
    api = f"https://tile.openweathermap.org/map/{type}"+"/{z}/{x}/{y}"+f".png?appid={API_key}"
    return api