import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

function EditDeck() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [name, setName] = useState("");
  const [favourite, setFavourite] = useState(false);
  const [cards, setCards] = useState([]);
  const [allCards, setAllCards] = useState([]);
  const [showCardPicker, setShowCardPicker] = useState(false);
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    API.get(`/api/user/decks/${deckId}`)
      .then((res) => {
        setDeck(res.data);
        setName(res.data.name);
        setFavourite(res.data.valid);
        setCards(res.data.cards);
      })
      .catch((err) => console.error(err));

    API.get("/api/cards")
      .then((res) => setAllCards(res.data))
      .catch((err) => console.error(err));
  }, [deckId]);

  const handleSave = async () => {
    try {
      await API.patch(`/api/user/decks/${deckId}/name`, { name });
      await API.patch(`/api/user/decks/${deckId}/valid`, {});
      navigate(`/decks/${deckId}`);
    } catch (err) {
      setErrorMessage("Failed to save deck");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this deck?")) return;
    try {
      await API.delete(`/api/user/decks/${deckId}`);
      navigate("/decks");
    } catch (err) {
      setErrorMessage("Failed to delete deck");
    }
  };

  const handleAddCard = async (cardId) => {
    try {
      const res = await API.post(`/api/user/decks/${deckId}/cards`, { cardId });
      setCards(res.data.cards);
    } catch (err) {
      setErrorMessage(err.response?.data?.errorMessage || "Failed to add card");
    }
  };

  const handleRemoveCard = async (cardId) => {
    try {
      const res = await API.delete(`/api/user/decks/${deckId}/cards`, { data: { cardId } });
      setCards(res.data.cards);
    } catch (err) {
      setErrorMessage("Failed to remove card");
    }
  };

  const getCardDetails = (cardId) => allCards.find((c) => c.id === cardId);

  const filteredCards = allCards.filter((card) =>
    card.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!deck) return <div>Loading...</div>;

  return (
    <div className="page-container">
      <h1>Create/Edit Deck</h1>

      <label>Deck Name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="search-input"
        placeholder="Enter deck name"
      />

      <div className="toggle-row">
        <label>Favourite Deck</label>
        <input
          type="checkbox"
          checked={favourite}
          onChange={(e) => setFavourite(e.target.checked)}
        />
      </div>

      {errorMessage && <p className="error">{errorMessage}</p>}

      <h2>Cards in Deck</h2>
      <div className="card-list">
        {cards.length === 0 && <p>No cards in this deck yet.</p>}
        {cards.map((cardId, index) => {
          const card = getCardDetails(cardId);
          return card ? (
            <div key={index} className="card-item">
              <img src={card.image} alt={card.name} className="card-image" />
              <div>
                <p className="card-name">{card.name}</p>
                <p className="card-type">{card.type}</p>
              </div>
              <button className="btn-remove" onClick={() => handleRemoveCard(cardId)}>
                Remove
              </button>
            </div>
          ) : null;
        })}
      </div>

      <button className="btn-primary" onClick={() => setShowCardPicker(!showCardPicker)}>
        Add Cards
      </button>

      {showCardPicker && (
        <div className="card-picker">
          <input
            type="text"
            placeholder="Search card..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <div className="card-list">
            {filteredCards.map((card) => {
              const count = cards.filter((id) => id === card.id).length;
              return (
                <div key={card._id} className="card-item">
                  <img src={card.image} alt={card.name} className="card-image" />
                  <div>
                    <p className="card-name">{card.name}</p>
                    <p className="card-type">{card.type}</p>
                  </div>
                  <div className="card-controls">
                    <button className="btn-remove" onClick={() => handleRemoveCard(card.id)}>-</button>
                    <span>{count}</span>
                    <button className="btn-add" onClick={() => handleAddCard(card.id)}>+</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="edit-deck-actions">
        <button className="btn-primary" onClick={handleSave}>Save Deck</button>
        <button className="btn-danger" onClick={handleDelete}>Delete Deck</button>
      </div>
    </div>
  );
}

export default EditDeck;