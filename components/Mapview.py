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
                                        "Family Agriculture",
                                        "Mining", 
                                    ],
                                    index=None,
                                    placeholder="Select the land use data to add",
                                    )                     
    
    environment = st.sidebar.selectbox(label = "Environment",
                                        options = [
                                             "True Color",
                                             "Cesar Aquifers",
                                             "Mangroves"
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
    if military:
        fg_to_add = military
    #if geojson_data:
    #    fg_to_add = geojson_data
    
    
    
    
    st.session_state["feature_group_to_add"] = fg_to_add
    return zoom, year

