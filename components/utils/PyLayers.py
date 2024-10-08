import requests
import json

import folium

import streamlit as st

# Custom imports
from components.utils.JsLayers import jsLayers


def py_layers(map_type: str, year: int) -> folium.FeatureGroup:
    layersDict = jsLayers(map_type)
    fg = folium.FeatureGroup(name = layersDict["id"])
    st.write(layersDict["url"])
    
    if layersDict["sourcetype"] == "raster":
        folium.WmsTileLayer(
            url=layersDict["url"],
            layers=layersDict["id"],
            fmt='image/png',
            transparent=True,
            overlay=True,
            control=True,
        ).add_to(fg)
    
    if layersDict["sourcetype"] == "image":
        
        folium.WmsTileLayer(
            url=layersDict["url"],
            layers=layersDict["layer"],
            height=layersDict["height"],
            width=layersDict["width"],
            fmt=layersDict["format"],
            transparent=True,
            overlay=True,
            control=True,
            bbox = layersDict["bbox"],
        ).add_to(fg)
            
    if layersDict["sourcetype"] == "geojson":
        st.write("GeoJSON")
        # Add the GeoJson to the feature group
        folium.GeoJson(
            layersDict["url"],
            #gdf,
            #style_function=lambda x: {
            #    "fillColor": colormap(x["properties"][data_to_plot])
            #    if x["properties"][data_to_plot] is not None
            #    else "transparent",
            #    "color": "black",
            #    "fillOpacity": 0.4,
            #    "weight": 1
            #},
            #tooltip=tooltip,
            #popup=popup,
        ).add_to(fg)
        
        
    return fg