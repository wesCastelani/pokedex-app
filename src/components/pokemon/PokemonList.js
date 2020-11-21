import React, { Component } from 'react';
import PokemonCard from './PokemonCard';
import axios from 'axios';

export default class PokemonList extends Component {
  state = {
    url: 'https://pokeapi.co/api/v2/pokemon?limit=151&offset=0',
    pokemon: null,
  };

  async componentDidMount() {
    const res = await axios.get(this.state.url);
    this.setState({ pokemon: res.data['results'] });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.pokemon ? (
          <div className="row">
            {this.state.pokemon.map((pokemon) => (
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
}
