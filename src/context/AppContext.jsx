// src/context/AppContext.jsx
import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState({ name: "Anna" });
  const [favourites, setFavourites] = useState([]);

  // NEW: preferences from the "Create CV" wizard
  const [cvPrefs, setCvPrefs] = useState({
    experience: "",
    student: "",   // "Yes" | "No"
    education: "", // one of the options
  });

  const addFavourite = (item) => {
    setFavourites((prev) =>
      prev.some((i) => i.id === item.id) ? prev : [...prev, item]
    );
  };
  const removeFavourite = (id) =>
    setFavourites((prev) => prev.filter((i) => i.id !== id));

  const resetCvPrefs = () => setCvPrefs({ experience: "", student: "", education: "" });

  return (
    <AppContext.Provider
      value={{ user, setUser, favourites, addFavourite, removeFavourite, cvPrefs, setCvPrefs, resetCvPrefs }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
