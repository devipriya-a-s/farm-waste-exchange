import React, { useState } from "react";
import { getUser, clearAuth } from "./api";
import Header from "./components/Header";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import AddListing from "./components/AddListing";
import MyListings from "./components/MyListings";
import Received from "./components/Received";
import Search from "./components/Search";
import ListingDetail from "./components/ListingDetail";
import MyRequests from "./components/MyRequests";
import "./App.css";

// App.js decides WHICH screen to show.
// "page" = current screen name, "user" = logged-in person ({role, name}) or null.
function App() {
  const [user, setUser] = useState(getUser());
  const [page, setPage] = useState("home");
  const [selected, setSelected] = useState(null);

  const goTo = (name) => setPage(name);

  const openListing = (listing) => {
    setSelected(listing);
    setPage("detail");
  };

  const handleLogin = () => {
    setUser(getUser());
    setPage("home");
  };

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    setPage("home");
  };

  return (
    <div className="app">
      <Header user={user} goTo={goTo} onLogout={handleLogout} />
      <main className="app-main">
        {page === "home" && <Home user={user} goTo={goTo} />}
        {page === "register" && <Register goTo={goTo} />}
        {page === "login" && <Login onLogin={handleLogin} goTo={goTo} />}
        {page === "add" && <AddListing goTo={goTo} />}
        {page === "mine" && <MyListings goTo={goTo} />}
        {page === "received" && <Received />}
        {page === "search" && <Search openListing={openListing} />}
        {page === "detail" && (
          <ListingDetail listing={selected} user={user} goTo={goTo} />
        )}
        {page === "sent" && <MyRequests />}
      </main>
    </div>
  );
}

export default App;
