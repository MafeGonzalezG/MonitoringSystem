
from typing import Tuple

from h3converter import h3converter
import h3pandas


import geopandas as gpd
import pandas as pd

import matplotlib.pyplot as plt
import folium
import branca

import streamlit as st
import streamlit_authenticator as stauth
from streamlit_folium import st_folium

import yaml
from yaml.loader import SafeLoader


st.set_page_config(page_title = "PlanetAI Monitoring", 
                   page_icon = ":earth_americas:", 
                   menu_items={"Get Help": None, 
                         "Report a bug": None,
                         "About": "https://www.planetainature.org/"})
# Define the central point
def main():
    
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

def create_feature_group(gdf, data_to_plot, label_to_plot, feature_group_name):
    
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
    
    gdf.to_file(f"./db/{len(gdf)}_cacahual.geojson", driver="GeoJSON")
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
    
    old_h3df = h3df.copy()
    
    # With the following groupby process, the "hex id" column is lost, which will not affect due
    # to the change on resolution.
    resolution_column = h3df.index.name
    h3df = h3df.groupby(resolution_column).mean(numeric_only=True).reset_index().set_index(resolution_column)
    h3df["region"] = old_h3df.groupby(resolution_column).max().reset_index()["region"].to_numpy(dtype=str)
    gdfh3 = h3df.h3.h3_to_geo_boundary()
    del old_h3df
    
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

############################################################################################################
# Authentication functions
############################################################################################################

# In-app account settings   
def account_settings(authenticator: stauth.Authenticate, config: dict) -> None:
    # Logout button
        with st.sidebar:
            authenticator.logout()
            
        if st.sidebar.checkbox("Account settings", value=False):
            update_user_details(authenticator, config)
            reset_password(authenticator, config)
        
def reset_password(authenticator: stauth.Authenticate, config:dict) -> None:
    """
    Function to reset the password
    ----------------
    Args:
        authenticator (stauth.Authenticate): Authentication object to handle the authentication
    Returns:
        None
    """
    
    if st.sidebar.button("Reset password", type="secondary"):
        # Reset password
        try:
            if authenticator.reset_password(st.session_state['username']):
                update_config_file(config)
                st.success('Password modified successfully')
        except Exception as e:
            st.error(e)

def update_user_details(authenticator: stauth.Authenticate, config: dict) -> None:
    """    
    Function to update the user details
    ----------------
    Args:
        authenticator (stauth.Authenticate): Authentication object to handle the authentication
    Returns:
        None
    """
    if st.sidebar.button("Update user details", type="secondary"):
        try:
            if authenticator.update_user_details(st.session_state['username']):
                update_config_file(config)
                st.success('Entries updated successfully')
        except Exception as e:
            st.error(e)

# Login page settings

def login_page_options(authenticator: stauth.Authenticate, config: dict) -> None:
    """
    Function to handle the login page options such as the register button, the forgotten password
    and the forgotten username.
    ----------------
    Args:
        authenticator (stauth.Authenticate): Authentication object to handle the authentication
    Returns:
        None
    """
    with st.sidebar:
        #register(authenticator, config)
        forgot_username(authenticator, config)
        forgot_password(authenticator, config)
    
def forgot_username(authenticator: stauth.Authenticate, config: dict) -> Tuple[str, str]:
    """
    Function to handle the forgotten username
    ----------------
    Args:
        authenticator (stauth.Authenticate): Authentication object to handle the authentication

    Returns:
        Tuple[str, str]: username forgotten and the corresponding email to that username.
    """
    if st.button("Forgot username", type="secondary"):
        try:
            username_of_forgotten_username, email_of_forgotten_username = authenticator.forgot_username()
            if username_of_forgotten_username:
                st.success('Username to be sent securely')
                # The developer should securely transfer the username to the user.
            elif username_of_forgotten_username == False:
                st.error('Email not found')
        except Exception as e:
            st.error(e)
    
        return username_of_forgotten_username, email_of_forgotten_username

def forgot_password(authenticator: stauth.Authenticate, config: dict) -> Tuple[str, str, str]:
    """
    Function to handle the forgotten password
    ----------------
    Args:
        authenticator (stauth.Authenticate): Authentication object to handle the authentication
    Returns:
        Tuple[str, str, str]: username of the forgotten password, email of the forgotten password, new random password
    """
    if st.button("Forgot password", type="secondary"):
        try:
            username_of_forgotten_password, email_of_forgotten_password, new_random_password = authenticator.forgot_password()
            if username_of_forgotten_password:
                st.success('New password to be sent securely')
                # The developer should securely transfer the new password to the user.
            elif username_of_forgotten_password == False:
                st.error('Username not found')
        except Exception as e:
            st.error(e)
    
        return username_of_forgotten_password, email_of_forgotten_password, new_random_password

def register(authenticator: stauth.Authenticate, config: dict) -> None:
    """
    Register a new user
    ----------------
    Args:
        authenticator (stauth.Authenticate): Authentication object to handle the authentication
    Returns:
        None
    """
    if st.button("Register", type="secondary"):
        # Register new user
        try:
            email_of_registered_user, username_of_registered_user, name_of_registered_user = authenticator.register_user(pre_authorization=False)
            update_config_file(config)
            if email_of_registered_user:
                st.success('User registered successfully')
        except Exception as e:
            st.error(e)

def authentication() -> stauth.Authenticate:
    """
    Authenticate the user
    ----------------
    Args:
        None
    Returns:
        stauth.Authenticate: Authentication object to handle the authentication
    """
    with open('./config.yaml') as file:
        config = yaml.load(file, Loader=SafeLoader)

    
    # Pre-hashing all plain text passwords once
    stauth.Hasher.hash_passwords(config['credentials'])
    authenticator = stauth.Authenticate(
        config['credentials'],
        config['cookie']['name'],
        config['cookie']['key'],
        config['cookie']['expiry_days'],
        config['pre-authorized']
    )
    
    authenticator.login()
    return authenticator, config

def update_config_file(config: dict) -> None:
    """
    Update the config file
    ----------------
    Args:
        config (dict): Configuration file
    Returns:
        None
    """
    with open('./config.yaml', 'w') as file:
        yaml.dump(config, file, default_flow_style=False)
        
if __name__ == "__main__":
    main()


