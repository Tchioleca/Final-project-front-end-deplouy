import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Decks() {
  const [decks, setDecks] = useState([]);
  const [newDeckName, setNewDeckName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    try {
      const res = await API.get("/api/user/decks");
      setDecks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateDeck = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/api/user/decks", { name: newDeckName });
      setNewDeckName("");
      setShowForm(false);
      navigate(`/decks/${res.data._id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <h1>Your Decks</h1>

      <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
        Create New Deck
      </button>

      {showForm && (
        <form onSubmit={handleCreateDeck} className="create-deck-form">
          <input
            type="text"
            placeholder="Enter deck name"
            value={newDeckName}
            onChange={(e) => setNewDeckName(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn-primary">Create</button>
        </form>
      )}

      <div className="deck-list">
        {decks.map((deck) => (
          <div
            key={deck._id}
            className="deck-list-item"
            onClick={() => navigate(`/decks/${deck._id}`)}
          >
            <span className="deck-list-name">
              {deck.name} ({deck.archetype})
            </span>
            <span className="deck-list-count">{deck.cards.length} Cards</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Decks;