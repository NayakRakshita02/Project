
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();
const API = process.env.REACT_APP_BASEURL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const res = await axios.get(`${API}/auth/me`);
        setUser(res.data.user);
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      const { token: t, user: u } = res.data;
      localStorage.setItem("token", t);
      axios.defaults.headers.common["Authorization"] = `Bearer ${t}`;
      setToken(t);
      setUser(u);
      return u;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Login failed";
      throw new Error(msg);
    }
  };

  const register = async (data) => {
    try {
      const res = await axios.post(`${API}/auth/register`, data);
      const { token: t, user: u } = res.data;
      localStorage.setItem("token", t);
      axios.defaults.headers.common["Authorization"] = `Bearer ${t}`;
      setToken(t);
      setUser(u);
      return u;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Registration failed";
      throw new Error(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setToken("");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
