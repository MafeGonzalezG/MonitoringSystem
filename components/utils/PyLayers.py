import requests
import json

import streamlit as st

# Custom imports
from components.utils.JsLayers import jsLayers


def py_layers(map_type: str):
    layersDict = jsLayers(map_type)
    
    response = requests.get(layersDict["url"])
    data = response.json()
    st.write(data)
    
    if layersDict["layertype"] == "raster":
        st.write("Raster Layer")
    if layersDict["layertype"] == "geojson":
        st.write("GeoJSON")