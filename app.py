
from typing import Tuple

from h3converter import h3converter
import h3pandas


import pandas as pd

import matplotlib.pyplot as plt
import folium

import streamlit as st
from streamlit_folium import st_folium

#Components
from components.Login import *
from components.AccountSettings import *
from components.Mapview import *
from components.utils.PyLayers import *


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
            zoom, year = sidebar_widgets()
            m = create_base_map()
            
            
            if st.session_state["feature_group_to_add"]:
                fg, cm = py_layers(map_type = st.session_state["feature_group_to_add"], year=year, zoom=zoom)
                fg.add_to(m)
                if cm:
                    cm.add_to(m)
            
            folium.LayerControl().add_to(m)
            
            st_folium(m, 
                      zoom = zoom)

############################################################################################################
# Data and map functions
############################################################################################################



# In-app account settings   
   
if __name__ == "__main__":
    app()


