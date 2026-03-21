import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Collection from "./pages/Collection";
import Decks from "./pages/Decks";
import DeckDetails from "./pages/DeckDetails";
import EditDeck from "./pages/EditDeck";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/collection" element={<PrivateRoute><Collection /></PrivateRoute>} />
        <Route path="/decks" element={<PrivateRoute><Decks /></PrivateRoute>} />
        <Route path="/decks/:deckId" element={<PrivateRoute><DeckDetails /></PrivateRoute>} />
        <Route path="/decks/:deckId/edit" element={<PrivateRoute><EditDeck /></PrivateRoute>} />
      </Routes>
    </>
  );
}

export default App;