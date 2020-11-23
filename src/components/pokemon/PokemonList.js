import React, { useState, useEffect } from 'react';
import PokemonCard from './PokemonCard';
import axios from 'axios';
import Pokemon from './Pokemon';

//Url da PokeAPI pra pegar as informações
const url = 'https://pokeapi.co/api/v2/pokemon?limit=151&offset=0';

export default function PokemonList() {
  const [pokemon, setPokemon] = useState([]);

  //Requisitando as Informações para a API
  useEffect(async () => {
    const res = await axios.get(url);
    const list = res.data.results;
    setPokemon(list);
  }, []);

  return (
    <React.Fragment>
      {pokemon ? (
        <div className="row">
          {pokemon.map((pokemon) => (
            <PokemonCard
              key={pokemon.name}
              url={pokemon.url}
              name={pokemon.name}
            />
          ))}
        </div>
      ) : (
        <div class="text-center text-primary">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
