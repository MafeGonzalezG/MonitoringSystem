import requests
import json

import folium

import streamlit as st

# Custom imports
from components.utils.JsLayers import jsLayers


def py_layers(map_type: str, year: int) -> folium.FeatureGroup:
    
    st.write("PyLayers")
    layersDict = jsLayers(map_type)
    fg = folium.FeatureGroup(name = layersDict["id"])
    st.write(layersDict["url"])
    
    if layersDict["sourcetype"] == "raster":
        folium.raster_layers.WmsTileLayer(
            url=layersDict["url"],
            name=layersDict["name"],
            fmt=layersDict["format"] if "format" in layersDict else "image/png",
            layers=layersDict["layer"] if "layer" in layersDict else None,  # Adjust the layer ID if needed
            maxcc = layersDict["maxcc"] if "maxcc" in layersDict else None,
            version = layersDict["version"] if "version" in layersDict else "1.1.1",
            bbox = layersDict["bbox"] if "bbox" in layersDict else None,
            crs = layersDict["crs"] if "crs" in layersDict else None,
            srs = layersDict["srs"] if "srs" in layersDict else None,
            attr=layersDict["attributions"],
            transparent=True,
            styles='',
        ).add_to(fg)
                
    if layersDict["sourcetype"] == "geojson":
        st.write("GeoJSON")
        
        
        # Popup
        tooltip = folium.GeoJsonTooltip(
            fields=layersDict["fields"],
            aliases=layersDict["aliases"],
            localize=True,
            sticky=False,
            labels=True,
            style="""
                background-color: #F0EFEF;
                border: 2px solid black;
                border-radius: 3px;
                box-shadow: 3px;
            """,
            max_width=800,
        )
        
        # Add the GeoJson to the feature group
        folium.GeoJson(
            layersDict["url"],
            marker=folium.Marker(icon=folium.Icon(icon='star')),
            tooltip=tooltip,
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