import { useState, useEffect } from "react";
import API from "../api/axios";

function Collection() {
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async (params = {}) => {
    try {
      const res = await API.get("/api/cards", { params });
      setCards(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);
    if (value === "") {
      fetchCards();
    } else {
      const [key, val] = value.split(":");
      fetchCards({ [key]: val });
    }
  };

  const filteredCards = cards.filter((card) =>
    card.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <h1>Card Collection</h1>

      <input
        type="text"
        placeholder="Search card text..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <select
        value={filter}
        onChange={handleFilterChange}
        className="filter-select"
      >
        <option value="">All Filters</option>
        <optgroup label="Faction">
          <option value="faction:Faction 1">Faction 1</option>
        </optgroup>
        <optgroup label="Type">
          <option value="type:Construct">Construct</option>
          <option value="type:Program">Program</option>
          <option value="type:Loop">Loop</option>
          <option value="type:Malware">Malware</option>
          <option value="type:Software">Software</option>
          <option value="type:MainFrame">MainFrame</option>
        </optgroup>
        <optgroup label="Rarity">
          <option value="rarity:Common">Common</option>
          <option value="rarity:Uncommon">Uncommon</option>
          <option value="rarity:Rare">Rare</option>
          <option value="rarity:Super rare">Super Rare</option>
          <option value="rarity:Mythic">Mythic</option>
        </optgroup>
      </select>

      <div className="card-list">
        {filteredCards.map((card) => (
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
    </div>
  );
}

export default Collection;