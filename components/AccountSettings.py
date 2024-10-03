import streamlit as st
import streamlit_authenticator as stauth

#Components
from components.Login import update_config_file

"""
=========================
Authentication functions
=========================
"""


def account_settings(authenticator: stauth.Authenticate, 
                     config: dict
                     ) -> None:
    """Displays the account settings

    Args:
        authenticator (stauth.Authenticate): Authentication object to handle the authentication.
        config (dict): Configuration dictionary with the users' details.
        
    Returns:
        None
    """
    # Logout button
    with st.sidebar:
        authenticator.logout()
    
    # Update and reset password
    if st.sidebar.checkbox("Account settings", value=False):
        update_user_details(authenticator, config)
        reset_password(authenticator, config)
        
def reset_password(authenticator: stauth.Authenticate, 
                   config:dict
                   ) -> None:
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

def update_user_details(authenticator: stauth.Authenticate, 
                        config: dict
                        ) -> None:
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
    