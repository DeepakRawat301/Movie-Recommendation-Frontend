import React, { useState } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;

  const movieIcons = ["🎥", "🍿", "🎬", "📽️", "🎞️", "🎦", "🎭", "📺", "🎧", "💿"];
  const colors = [
    "linear-gradient(135deg, #ff9a9e, #fad0c4)",
    "linear-gradient(135deg, #a1c4fd, #c2e9fb)",
    "linear-gradient(135deg, #f6d365, #fda085)",
    "linear-gradient(135deg, #fbc2eb, #a6c1ee)",
    "linear-gradient(135deg, #84fab0, #8fd3f4)",
    "linear-gradient(135deg, #ffecd2, #fcb69f)",
    "linear-gradient(135deg, #cfd9df, #e2ebf0)",
    "linear-gradient(135deg, #fddb92, #d1fdff)",
    "linear-gradient(135deg, #e0c3fc, #8ec5fc)",
    "linear-gradient(135deg, #f093fb, #f5576c)"
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setRecommendations([]);

    try {
      const response = await fetch(`${API_URL}/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: query }),
      });

      const data = await response.json();

      if (response.ok) {
        setRecommendations(data.recommended_movies);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🎬 Movie Recommendation System</h1>
        <p>Find movies similar to your favorites!</p>
      </header>

      <main className="main">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Enter a movie name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>

        {loading && <p className="loading">Loading recommendations...</p>}
        {error && <p className="error">{error}</p>}

        {recommendations.length > 0 && (
          <div className="recommendations">
            <h2>Recommended Movies</h2>
            <div className="movie-grid">
              {recommendations.map((movie, index) => (
                <div
                  key={index}
                  className="movie-card"
                  style={{ background: colors[index % colors.length] }}
                >
                  <div className="poster-placeholder">
                    {movieIcons[index % movieIcons.length]}
                  </div>
                  <h3>{movie}</h3>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Made with ❤️ using Flask + React</p>
        <p>Developed by Amit Singh Rawat</p>
      </footer>
    </div>
  );
}

export default App;
