import streamlit as st
import streamlit_authenticator as stauth

import yaml
from yaml.loader import SafeLoader

"""+
=========================
Account settings functions
=========================
"""


def login_page_options(authenticator: stauth.Authenticate, 
                       config: dict
                       ) -> None:
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
    
def forgot_username(authenticator: stauth.Authenticate, 
                    config: dict
                    ) -> tuple[str, str]:
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

def forgot_password(authenticator: stauth.Authenticate, 
                    config: dict
                    ) -> tuple[str, str, str]:
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

def register(authenticator: stauth.Authenticate, 
             config: dict
             ) -> None:
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
 