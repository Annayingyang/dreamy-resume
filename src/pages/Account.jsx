import React from "react";
import { useApp } from "../context/AppContext";

export default function Account() {
  const { user, favourites, removeFavourite } = useApp();

  return (
    <section className="prose card">
      <h1>My Account</h1>
      <p>Welcome back, {user?.name ?? "Guest"}.</p>

      <h2>Favourites</h2>
      {favourites.length === 0 ? (
        <p>No favourites yet. Add some from the Home/Templates page.</p>
      ) : (
        <ul>
          {favourites.map((f) => (
            <li key={f.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span>{f.name}</span>
              <button className="btn btn-sm" onClick={() => removeFavourite(f.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
