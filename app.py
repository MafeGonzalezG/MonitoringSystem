import h3
import folium
import streamlit as st
from streamlit_folium import st_folium
import random
from h3converter import h3converter

import geopandas as gpd
import pandas as pd
import matplotlib.pyplot as plt
import branca
import h3pandas

# Define the central point
def main():
    
    # Sidebar widgets
    zoom, feature_group_to_add = sidebar_widgets()
    
    # Load the data
    first_n_rows = 10000
    cacahual_gdfh3 = charge_df(file_path="./db/cacahual_db.csv", 
                               resolution = zoom - 3,
                               first_n_rows = first_n_rows)
    print(cacahual_gdfh3)
    
    # Create the feature groups and the colormaps
    fg_cm_dic = {"Carbon removals mean value": create_feature_group(gdf=cacahual_gdfh3, 
                                                                   data_to_plot="carbon_removals_mean_value", 
                                                                   label_to_plot="Carbon removals mean value (m.u.)", 
                                                                   feature_group_name="Carbon removals mean value"),
                 "Tropical tree cover mean value": create_feature_group(gdf=cacahual_gdfh3, 
                                                                       data_to_plot="tropical_tree_cover_mean_value", 
                                                                       label_to_plot="Tropical tree cover mean value (m.u.)", 
                                                                       feature_group_name="Tropical tree cover mean value"),
                 "None": [None, None]}
    
    # Create the map
    m = folium.Map(location=[3.5252777777778, -67.415833333333],
                   max_bounds = True)
    
    # Add the colormap to the map
    if fg_cm_dic[feature_group_to_add][1]:
        colormap = fg_cm_dic[feature_group_to_add][1]
        colormap.add_to(m)
    
    # Obtain the feature group to add
    fg = fg_cm_dic[feature_group_to_add][0]
        
    # Display the map
    st_folium(m, 
              feature_group_to_add=fg, 
              zoom = st.session_state["zoom"])

def create_feature_group(gdf, data_to_plot, label_to_plot, feature_group_name):
    
    # Create a feature group
    st.write(feature_group_name)
    fg = folium.FeatureGroup(name=feature_group_name)
    
    # Create a colormap
    colormap = branca.colormap.LinearColormap(
        vmin=gdf[data_to_plot].quantile(0.0),
        vmax=gdf[data_to_plot].quantile(1),
        colors=["red", "orange", "lightblue", "green", "darkgreen"],
        caption=label_to_plot,
    )
    
    # Create a popup and a tooltip
    popup = folium.GeoJsonPopup(
        fields=["region", data_to_plot],
        aliases=["region", label_to_plot],
        localize=True,
        labels=True,
        style="background-color: yellow;",
    )
    tooltip = folium.GeoJsonTooltip(
        fields=["latitude", "longitude", data_to_plot],
        aliases=["Latitude", "Longitude", label_to_plot],
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
    #import json
    #st.write(json.loads(gdf.to_json())["features"])
    folium.GeoJson(
        gdf,
        style_function=lambda x: {
            "fillColor": colormap(x["properties"][data_to_plot])
            if x["properties"][data_to_plot] is not None
            else "transparent",
            "color": "black",
            "fillOpacity": 0.4,
            "weight": 1
        },
        tooltip=tooltip,
        popup=popup,
    ).add_to(fg)
    
    return [fg, colormap]

@st.cache_data
def charge_df(file_path, resolution, first_n_rows = None ):
    df =  pd.read_csv(file_path)
    if first_n_rows:
        h3df = df\
            .head(first_n_rows)\
            .h3.geo_to_h3(resolution, 
                        lat_col = "latitude", 
                        lng_col = "longitude")
    else:
        h3df = df\
            .h3.geo_to_h3(resolution, 
                        lat_col = "latitude", 
                        lng_col = "longitude")
        
    resolution_column = h3df.index.name
    h3df = h3df.groupby(resolution_column).mean(numeric_only=True).reset_index().set_index(resolution_column)
    gdfh3 = h3df.h3.h3_to_geo_boundary()
    st.write(gdfh3.columns)
    return gdfh3

def sidebar_widgets():
    
    st.sidebar.title("Settings")
    
    # Zoom slider
    zoom = st.sidebar.slider(label = "Zoom",
                             min_value = 3, 
                             max_value = 18, 
                             value = 8,
                             step = 1)
    st.session_state["zoom"] = zoom
    
    # Feature group selectbox
    fg_to_add = st.sidebar.selectbox(label = "Data to add",
                                     options = ["None",
                                                "Carbon removals mean value", 
                                                "Tropical tree cover mean value"])
    
    return zoom, fg_to_add
    
    

if __name__ == "__main__":
    main()


