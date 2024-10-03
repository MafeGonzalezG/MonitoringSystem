import requests
import json

import folium

import streamlit as st

# Custom imports
from components.utils.JsLayers import jsLayers


def py_layers(map_type: str) -> folium.FeatureGroup:
    layersDict = jsLayers(map_type)
    fg = folium.FeatureGroup(name = layersDict["id"])
    st.write(layersDict["url"])
    
    if layersDict["layertype"] == "raster":
        folium.WmsTileLayer(
            url=layersDict["url"],
            layers='planetai:carbon_removals_mean_value',
            fmt='image/png',
            transparent=True,
            overlay=True,
            control=True,
        ).add_to(fg)
        
        
    if layersDict["layertype"] == "geojson":
        st.write("GeoJSON")
        
    return fg