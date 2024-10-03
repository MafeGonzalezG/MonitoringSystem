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

def create_feature_group(gdf:gpd.GeoDataFrame, 
                         data_to_plot:str, 
                         label_to_plot:str, 
                         feature_group_name:str
                         )->list[folium.FeatureGroup, branca.colormap.LinearColormap]:
    """
    Function to create a feature group with a colormap and a popup, along with a tooltip.
    
    Args:
        gdf (gpd.GeoDataFrame): GeoDataFrame with the data to plot.
        data_to_plot (str): Column to plot.
        label_to_plot (str): Label to plot.
        feature_group_name (str): Name to give to the feature group.
    Returns:
        [folium.FeatureGroup, branca.colormap.LinearColormap]: Feature group and colormap to add to the map.
    """
    # Create a feature group
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
def charge_df(file_path: str, 
              resolution: int, 
              first_n_rows: int | None = None 
              ) -> gpd.GeoDataFrame:
    """Charges a DataFrame and converts it to a GeoDataFrame with H3 hexagons.

    Args:
        file_path (str): Path to the data file.
        resolution (int): Resolution of the H3 hexagons.
        first_n_rows (int | None, optional): Number of rows to read. Defaults to None.

    Returns:
        gpd.GeoDataFrame: GeoDataFrame with the H3 hexagons.
    """
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
    
    old_h3df = h3df.copy()
    
    # With the following groupby process, the "hex id" column is lost, which will not affect due
    # to the change on resolution.
    resolution_column = h3df.index.name
    h3df = h3df.groupby(resolution_column).mean(numeric_only=True).reset_index().set_index(resolution_column)
    h3df["region"] = old_h3df.groupby(resolution_column).max().reset_index()["region"].to_numpy(dtype=str)
    gdfh3 = h3df.h3.h3_to_geo_boundary()
    del old_h3df
    
    return gdfh3

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
    
    """ # Feature group selectbox
    fg_to_add = st.sidebar.selectbox(label = "Data to add",
                                     options = ["None",
                                                "Carbon removals mean value", 
                                                "Tropical tree cover mean value"])
     """
     
     # Feature group selectbox
    fg_to_add = st.sidebar.selectbox(label = "Data to add",
                                     options = ["None",
                                                "Precipitation"])
    return zoom, fg_to_add