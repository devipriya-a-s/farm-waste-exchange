import React from "react";

function Home({ user, goTo }) {
  const role = user && user.role;

  return (
    <div className="page">
      <h2>Turn agricultural waste into value</h2>
      <p>Farmers list crop waste. Buyers find it and contact them directly.</p>

      <div className="home-buttons">
        {!user && (
          <>
            <button className="btn btn-primary" onClick={() => goTo("register")}>
              Create an account
            </button>
            <button className="btn btn-secondary" onClick={() => goTo("login")}>
              Login
            </button>
          </>
        )}
        {role === "farmer" && (
          <button className="btn btn-primary" onClick={() => goTo("add")}>
            🧑‍🌾 List my waste
          </button>
        )}
        <button className="btn btn-secondary" onClick={() => goTo("search")}>
          🔍 Browse listings
        </button>
      </div>
    </div>
  );
}

export default Home;
