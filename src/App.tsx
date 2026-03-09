import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { PokemonProvider } from "./context/PokemonContext";
import {LandingPage} from "./components/LandingPage";
import {PokemonList}from "./components/PokemonList";
import {PokemonDetail}from "./components/PokemonDetail";
import {PixelBg} from "./components/PixelBg";
import "../src/styles/App.scss";

const AppContent: React.FC = () => {
  const location = useLocation();
  const isDetailPage = location.pathname.startsWith('/pokemon/');

  return (
    <>
      {isDetailPage && <PixelBg />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pokemons" element={<PokemonList />} />
        <Route path="/pokemon/:id" element={<PokemonDetail />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <PokemonProvider>
      <Router>
        <AppContent />
      </Router>
    </PokemonProvider>
  );
};

export default App;
