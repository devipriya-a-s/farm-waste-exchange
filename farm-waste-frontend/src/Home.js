import React from "react";

function Home({ user, goTo }) {
  const role = user && user.role;

  return (
    <div className="page">
      <div className="hero">
        <h2>Turn agricultural waste into value</h2>
        <p>Farmers list crop waste. Buyers find it nearby and contact them directly.</p>

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

      <div className="steps">
        <div className="step">
          <div className="icon">📝</div>
          <h3>1. Farmers list waste</h3>
          <p>Add the waste type, quantity, price and location in under a minute.</p>
        </div>
        <div className="step">
          <div className="icon">🗺️</div>
          <h3>2. Buyers search the map</h3>
          <p>Filter by waste type or place and see listings pinned on the map.</p>
        </div>
        <div className="step">
          <div className="icon">🤝</div>
          <h3>3. Connect directly</h3>
          <p>Buyers send a request and the farmer sees it right away.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
