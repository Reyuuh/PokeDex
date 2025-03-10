import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { PokemonProvider } from "./context/PokemonContext";
import {LandingPage} from "./components/LandingPage";
import {PokemonList}from "./components/PokemonList";
import {PokemonDetail}from "./components/PokemonDetail";
import "../src/styles/App.scss";

const App: React.FC = () => {
  return (
    <PokemonProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pokemons" element={<PokemonList />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
        </Routes>
      </Router>
    </PokemonProvider>
  );
};

export default App;
