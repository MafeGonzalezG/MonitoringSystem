def layers(map_type):
    
    return {
        "Precipitation": {
    "id" "precipitation",
    "layertype": "raster",
    "sourcetype": "raster",
    "url": OpenWeatherMap("precipitation_new"),
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
  },
    }