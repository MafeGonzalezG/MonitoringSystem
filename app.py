
from typing import Tuple

from h3converter import h3converter
import h3pandas


import geopandas as gpd
import pandas as pd

import matplotlib.pyplot as plt
import folium

import streamlit as st
from streamlit_folium import st_folium

#Components
from components.Login import *
from components.AccountSettings import *
from components.Mapview import *


st.set_page_config(page_title = "PlanetAI Monitoring", 
                   page_icon = ":earth_americas:", 
                   menu_items={"Get Help": None, 
                         "Report a bug": None,
                         "About": "https://www.planetainature.org/"})
# Define the central point
def app():
    
    # Authentication object and login page
    authenticator, config = authentication()
    
    # Check if the user is authenticated
    if st.session_state['authentication_status'] is False:
        login_page_options(authenticator, config)
        st.error('Username/password is incorrect')
    elif st.session_state['authentication_status'] is None:
        login_page_options(authenticator, config)
        st.warning('Please enter your username and password')
    elif st.session_state['authentication_status']:
        account_settings(authenticator, config)
        
        ############################################################################################################
        # Main app
        ############################################################################################################
        with st.spinner("Loading maps..."):
            
            # Sidebar widgets
            zoom, feature_group_to_add = sidebar_widgets()
            
            # Load the data
            first_n_rows = 10000
            cacahual_gdfh3 = charge_df(file_path="./db/cacahual_db.csv", 
                                    resolution = zoom - 3,
                                    first_n_rows = first_n_rows)
            
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
            folium.plugins.Fullscreen(
                position="topright",
                title="Expand me",
                title_cancel="Exit me",
                force_separate_button=True,
            ).add_to(m)
            
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

############################################################################################################
# Data and map functions
############################################################################################################



# In-app account settings   
   
if __name__ == "__main__":
    app()


