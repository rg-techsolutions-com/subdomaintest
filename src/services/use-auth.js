import React, { useState, useContext, createContext } from "react";
import axios from 'axios';
import settings from './settings';

const authContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}

export function useAuth() {
  return useContext(authContext);
}

export function useProvideAuth() {
  const [user, setUser] = useState(null);
 
  const profile = JSON.parse(localStorage.getItem('auth_code'));
  if (profile) {
    if (user === null) {
      setUser(profile);
    }
  }

  //Data that will be sent when logging in a new user.
  const login = (email, password) => {
    return axios
    .post(settings.base_url + "login", {
        email,
        password,
    })
    .then((response) => {
        if (response.data.auth_code) {
            localStorage.setItem('auth_code', JSON.stringify(response.data));
            setUser(response.data);
            return response.data;
        }
    });
  };
 
  const logout = cb => {
    localStorage.removeItem('auth_code');
    if (! localStorage.getItem('redirectURL')) {
      localStorage.setItem('redirectURL', 'logout');
    }
    setUser(null);
    return false;
  };
  
  const updateProfile = (display_name) => {
    let current_profile = JSON.parse(localStorage.getItem('auth_code'));
    if (current_profile) {
      current_profile['display_name'] = display_name;
      localStorage.setItem('auth_code', JSON.stringify(current_profile));
      setUser(current_profile);
      return current_profile;
    }
    return null;
  };
  
  return {
    user,
    login,
    logout,
    updateProfile
  };
}
