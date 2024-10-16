import streamlit as st
from streamlit_folium import st_folium

import pandas as pd

import folium
import branca

import geopandas as gpd


"""
=========================
Data and map functions
=========================
"""
def create_base_map() -> folium.Map:
    """
    Function to create a base map.
    
    Args:
    None
    Returns:
        folium.Map: Base map.
    """
    m = folium.Map(location=[3.5252777777778, -67.415833333333],
                   max_bounds = True,
                   zoom_start = 6)
    folium.plugins.Fullscreen(
        position="topright",
        title="Expand me",
        title_cancel="Exit me",
        force_separate_button=True,
    ).add_to(m)
    
    
    folium.TileLayer(
        "Stadia.AlidadeSatellite").add_to(m)
    folium.TileLayer(
        "OpenTopoMap").add_to(m)
    folium.TileLayer(
        "OpenStreetMap").add_to(m)
    
    
    folium.plugins.Draw(export = True).add_to(m)
    folium.plugins.Geocoder().add_to(m)
    folium.plugins.LocateControl().add_to(m)
    folium.plugins.MousePosition().add_to(m)
    
    return m

def sidebar_widgets() -> None:
    """Widgets to add to the sidebar for selecting the data to plot and the zoom level.
    Args:
    None
    Returns:
        None
    """
    
    st.sidebar.title("Settings")
    
    # Zoom slider
    zoom = st.sidebar.slider(label = "Zoom",
                             min_value = 3, 
                             max_value = 18, 
                             value = 8,
                             step = 1)
    st.session_state["zoom"] = zoom
    
    year = st.sidebar.slider(label = "Year",
                             min_value = 2000, 
                             max_value = 2024, 
                             value = 2020,
                             step = 1)
    st.session_state["year"] = year
    
    """ # Feature group selectbox
    fg_to_add = st.sidebar.selectbox(label = "Data to add",
                                     options = ["None",
                                                "Carbon removals mean value", 
                                                "Tropical tree cover mean value"])
     """
    
    fg_to_add = None
    # Feature group selectbox
    weather = st.sidebar.selectbox(label = "Weather",
                        options = ["Precipitation",
                                "Temperature",
                                "Wind",
                                "Pressure",
                                "Clouds"
                                ],
                        index=None,
                        placeholder="Select the weather data to add",
                        )
    
    risks = st.sidebar.selectbox(label = "Risks",
                                 options = [
                                      "Earthquakes",
                                      "NASA Events"
                                 ],
                                 index=None,
                                placeholder="Select the risk data to add",
                                )
    
    land_use = st.sidebar.selectbox(label = "Land Use",
                                    options = [
                                        #"Family Agriculture",
                                        "Mining", 
                                    ],
                                    index=None,
                                    placeholder="Select the land use data to add",
                                    )                     
    
    environment = st.sidebar.selectbox(label = "Environment",
                                        options = [
                                             "True Color",
                                             #"Cesar Aquifers",
                                             #"Mangroves",
                                             "Carbon removals mean value",
                                             "Tropical tree cover mean value"
                                        ],
                                        index=None,
                                        placeholder="Select the environment data to add",
                                        )    
    
    geological  = st.sidebar.selectbox(label = "Geological information",
                                       options = [
                                           "Tectonic Failures",
                                           "Hot Spots"
                                       ],
                                       index=None,
                                       placeholder="Select the geological data to add",
                                       )
    
    military = st.sidebar.selectbox(label = "Military",
                                    options = [
                                        "Military Zones",
                                    ],
                                    index=None,
                                    placeholder="Select the military data to add",
    )
    
    #geojson_data = st.sidebar.selectbox(label = "GeoJSON",
    #                    options = [
    #                               #"Black Communities",
    #                               #"Fires",
    #                               #"Water Quality",
    #                               #"Reserves",
    #                               #"IDEAM Station Temperatures",
    #                               #"Communities",
    #                               #"Education",
    #                               #"Indigenous Reserves",
    #                               #"Air Quality"
    #                            ],
    #                    index=None,
    #                    placeholder="Select the raster data to add",
    #                    )
    #                                  
    #
    st.session_state["feature_group_to_add"] = None
        
    if weather:
        fg_to_add = weather
    if risks:
        fg_to_add = risks
    if land_use:
        fg_to_add = land_use
    if environment:
        fg_to_add = environment
    if geological:
        fg_to_add = geological
    if military:
        fg_to_add = military
    
    
    
    
    st.session_state["feature_group_to_add"] = fg_to_add
    return zoom, year

