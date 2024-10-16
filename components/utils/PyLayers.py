import requests
import json

import pandas as pd
import geopandas as gpd
import branca

import folium

import streamlit as st

# Custom imports
from components.utils.JsLayers import jsLayers


def py_layers(map_type: str, year: int, zoom: int | None = None) -> folium.FeatureGroup:
    
    layersDict = jsLayers(map_type)
    fg = folium.FeatureGroup(name = layersDict["id"])
    #st.write(layersDict["url"])
    
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
        
        if layersDict["layertype"] == "circle":
            # tooltip
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
            ).add_to(fg)
            
        if layersDict["layertype"] == "line":
            folium.GeoJson(
                layersDict["url"],
            ).add_to(fg)
        if layersDict["layertype"] == "multipolygon":
            # tooltip
            tooltip = folium.GeoJsonTooltip(
                fields=layersDict["fields"],
                aliases=layersDict["aliases"],
                localize=True,
                sticky=True,
                labels=True,
                style="""
                    background-color: #F0EFEF;
                    border: 2px solid black;
                    border-radius: 3px;
                    box-shadow: 3px;
                """,
                max_width=800,
            )
            folium.GeoJson(
                layersDict["url"],
                tooltip=tooltip,
            ).add_to(fg)
        if layersDict["layertype"] == "hexagons":
            first_n_rows = 1000
            cacahual_gdfh3 = charge_df(file_path=layersDict["url"], 
                                    resolution = zoom - 3,
                                    first_n_rows = first_n_rows)
            
            fg, cm = create_feature_group(gdf=cacahual_gdfh3, 
                                        data_to_plot=layersDict["id"],
                                        label_to_plot=layersDict["label_to_plot"], 
                                        feature_group_name=layersDict["name"])
        
    if cm:
        return fg, cm
    else:
        return fg, False


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
