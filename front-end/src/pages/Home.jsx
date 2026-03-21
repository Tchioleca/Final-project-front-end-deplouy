import { useState, useEffect } from "react";
import API from "../api/axios";

function Home() {
  const [decks, setDecks] = useState([]);
  const [archetype, setArchetype] = useState("");
  const [deckName, setDeckName] = useState("");
  const [sortByLikes, setSortByLikes] = useState(false);

  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async (params = {}) => {
    try {
      const res = await API.get("/api/decks", { params });
      setDecks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeckSearch = (e) => {
    e.preventDefault();
    fetchDecks({ archetype, name: deckName, sortByLikes });
  };

  return (
    <div className="page-container">
      <h1>Home</h1>

      <div className="deck-search">
        <h2>Popular Deck Search Filters</h2>
        <form onSubmit={handleDeckSearch}>
          <input
            type="text"
            placeholder="Archetype"
            value={archetype}
            onChange={(e) => setArchetype(e.target.value)}
            className="search-input"
          />
          <input
            type="text"
            placeholder="Deck Name"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            className="search-input"
          />
          <div className="toggle-row">
            <label>Filter by Likes</label>
            <input
              type="checkbox"
              checked={sortByLikes}
              onChange={(e) => setSortByLikes(e.target.checked)}
            />
          </div>
          <button type="submit">Search</button>
        </form>

        <div className="deck-list">
          {decks.map((deck) => (
            <div key={deck._id} className="deck-item">
              <p>{deck.name}</p>
              <p>{deck.archetype}</p>
              <p>❤️ {deck.likes}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;