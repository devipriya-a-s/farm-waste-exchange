import React from "react";

// Top menu. What you see depends on who is logged in.
function Header({ user, goTo, onLogout }) {
  const role = user && user.role;

  return (
    <header className="app-header">
      <h1 onClick={() => goTo("home")}>🌾 Farm Waste Exchange</h1>
      <nav className="nav">
        <button onClick={() => goTo("search")}>Browse</button>

        {!user && (
          <>
            <button onClick={() => goTo("login")}>Login</button>
            <button onClick={() => goTo("register")}>Register</button>
          </>
        )}

        {role === "farmer" && (
          <>
            <button onClick={() => goTo("add")}>Add Listing</button>
            <button onClick={() => goTo("mine")}>My Listings</button>
            <button onClick={() => goTo("received")}>Requests Received</button>
          </>
        )}

        {role === "buyer" && (
          <button onClick={() => goTo("sent")}>My Requests</button>
        )}

        {user && (
          <button onClick={onLogout}>Logout ({user.name || role})</button>
        )}
      </nav>
    </header>
  );
}

export default Header;
