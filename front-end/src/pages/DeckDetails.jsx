import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

function DeckDetails() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);

  useEffect(() => {
    API.get(`/api/user/decks/${deckId}`)
      .then((res) => setDeck(res.data))
      .catch((err) => console.error(err));
  }, [deckId]);

  if (!deck) return <div>Loading...</div>;

  const cardDetails = deck.cardDetails || [];

  // faction distribution
  const factionCount = cardDetails.reduce((acc, card) => {
    acc[card.faction] = (acc[card.faction] || 0) + 1;
    return acc;
  }, {});

  // type distribution
  const typeCount = cardDetails.reduce((acc, card) => {
    acc[card.type] = (acc[card.type] || 0) + 1;
    return acc;
  }, {});

  // rarity breakdown
  const rarityCount = cardDetails.reduce((acc, card) => {
    acc[card.rarity] = (acc[card.rarity] || 0) + 1;
    return acc;
  }, {});

  // avg cost
  const totalCost = cardDetails.reduce((acc, card) => acc + card.buildCost, 0);
  const avgCost = cardDetails.length > 0 ? (totalCost / cardDetails.length).toFixed(1) : 0;

  return (
    <div className="page-container">
      <h1>{deck.name}</h1>
      <p>{deck.archetype} | Avg. Cost: {avgCost}</p>

      <button className="btn-primary" onClick={() => navigate(`/decks/${deckId}/edit`)}>
        Edit Deck ✏️
      </button>

      <h2>Cards in Deck</h2>
      <div className="card-list">
        {cardDetails.length === 0 && <p>No cards in this deck yet.</p>}
        {cardDetails.map((card) => (
          <div key={card._id} className="card-item">
            <img src={card.image} alt={card.name} className="card-image" />
            <div>
              <p className="card-name">{card.name}</p>
              <p className="card-type">{card.type}</p>
              <p className="card-text">{card.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="deck-stats">
        <h2>Deck Stats</h2>
        <p>Card Count: {deck.cards.length}</p>
        <p>Total Card Cost: {totalCost}</p>
        <p>Average Card Cost: {avgCost}</p>

        <h3>Faction Distribution</h3>
        {Object.entries(factionCount).map(([faction, count]) => (
          <p key={faction}>{faction}: {count} ({Math.round(count / cardDetails.length * 100)}%)</p>
        ))}

        <h3>Type Distribution</h3>
        {Object.entries(typeCount).map(([type, count]) => (
          <p key={type}>{type}: {count} ({Math.round(count / cardDetails.length * 100)}%)</p>
        ))}

        <h3>Rarity Breakdown</h3>
        {Object.entries(rarityCount).map(([rarity, count]) => (
          <p key={rarity}>{rarity}: {count}</p>
        ))}
      </div>
    </div>
  );
}

export default DeckDetails;