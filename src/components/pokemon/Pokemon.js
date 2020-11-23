import React, { useState, useEffect } from 'react';

import axios from 'axios';

const TYPE_COLORS = {
  bug: 'B1C12E',
  dark: '4F3A2D',
  dragon: '755EDF',
  electric: 'FCBC17',
  fairy: 'F4B1F4',
  fighting: '823551D',
  fire: 'E73B0C',
  flying: 'A3B3F7',
  ghost: '6060B2',
  grass: '74C236',
  ground: 'D3B357',
  ice: 'A3E7FD',
  normal: 'C8C4BC',
  poison: '934594',
  psychic: 'ED4882',
  rock: 'B9A156',
  steel: 'B5B5C3',
  water: '3295F6',
};

export default function Pokemon(props) {
  const [pokemonStats, setPokemonStats] = useState({});
  const [pokemonDesc, setPokemonDesc] = useState({});
  const [pokemonTypes, setPokemonTypes] = useState([]);

  const { pokemonIndex } = props.match.params;

  //Função pra ajustar como as strings vão ser exibidas
  const adjustStrings = (name) => {
    let adjusted = name
      .toLowerCase()
      .split('-')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ');
    return adjusted;
  };

  async function getData() {
    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}`;
    const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}`;

    const pokemonRes = await axios.get(pokemonUrl);

    let name = pokemonRes.data.name;
    name = adjustStrings(name);

    const imageUrl = pokemonRes.data.sprites.front_default;

    let { hp, attack, defense, speed, specialAttack, specialDefense } = '';

    pokemonRes.data.stats.map((stat) => {
      switch (stat.stat.name) {
        case 'hp':
          hp = stat['base_stat'];
          break;
        case 'attack':
          attack = stat['base_stat'];
          break;
        case 'defense':
          defense = stat['base_stat'];
          break;
        case 'speed':
          speed = stat['base_stat'];
          break;
        case 'special-attack':
          specialAttack = stat['base_stat'];
          break;
        case 'special-defense':
          specialDefense = stat['base_stat'];
          break;
      }
    });

    const height = Math.round(pokemonRes.data.height * 10);
    const weight = Math.round(pokemonRes.data.weight * 100);

    const types = pokemonRes.data.types.map((type) => type.type.name);
    setPokemonTypes(types);

    const abilities = pokemonRes.data.abilities.map((ability) => {
      return adjustStrings(ability.ability.name);
    });

    const evs = pokemonRes.data.stats
      .filter((stat) => {
        if (stat.effort > 0) {
          return true;
        }
        return false;
      })
      .map((stat) => {
        return `${stat.effort} ${adjustStrings(stat.stat.name)}`;
      })
      .join(' ');

    //Obter descrição do pokemon, catch Rate, eggGroups, Gender ratio
    await axios.get(pokemonSpeciesUrl).then((res) => {
      let description = '';
      res.data.flavor_text_entries.some((flavor) => {
        if (flavor.language.name === 'en') {
          description = flavor.flavor_text;
          return;
        }
      });

      const femaleRate = res.data['gender_rate'];
      const genderRatioFemale = 12.5 * femaleRate;
      const genderRatioMale = 12.5 * (8 - femaleRate);

      const catchRate = Math.round((100 / 255) * res.data['capture_rate']);

      const eggGroups = res.data['egg_groups']
        .map((group) => {
          return adjustStrings(group.name);
        })
        .join(', ');

      const hatchSteps = 255 * (res.data['hatch_counter'] + 1);

      setPokemonDesc({
        description,
        genderRatioFemale,
        genderRatioMale,
        catchRate,
        eggGroups,
        hatchSteps,
      });
    });

    setPokemonStats({
      imageUrl,
      pokemonIndex,
      name,
      id: pokemonRes.data.id,
      stats: {
        hp,
        attack,
        defense,
        speed,
        specialAttack,
        specialDefense,
      },
      abilities,
      weight,
      height,
      evs,
    });
  }

  useEffect(() => {
    getData();
  }, [pokemonStats.id]);

  return (
    <div>
      {!pokemonStats.id ? (
        <div className="d-flex justify-content-center text-primary">
          <div className="spinner-grow" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="col">
          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="col-5">
                  <h5>{pokemonStats.pokemonIndex}</h5>
                </div>
                <div className="col-7">
                  <div className="float-right">
                    {pokemonTypes.map((type) => (
                      <span
                        key={type}
                        className="badge badge-primary badge-pill mr-1"
                        style={{
                          backgroundColor: `#${TYPE_COLORS[type]}`,
                          color: 'white',
                        }}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-3">
                  <img
                    src={pokemonStats.imageUrl}
                    className="card-img-top rounded mx-auto mt-2"
                  ></img>
                </div>
                <div className="col-md-9">
                  <h4 className="mx-auto">{pokemonStats.name}</h4>
                  <div className="row align-items-center">
                    <div className="col-12 col-md-3">HP</div>
                    <div className="col-12 col-md-9">
                      <div className="progress">
                        <div
                          className="progress-bar"
                          role="progressBar"
                          style={{ width: `${pokemonStats.stats.hp}%` }}
                          area-value="25"
                          area-valuemin="0"
                          area-valuemax="100"
                        >
                          <small>{pokemonStats.stats.hp}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row align-items-center">
                    <div className="col-12 col-md-3">Attack</div>
                    <div className="col-12 col-md-9">
                      <div className="progress">
                        <div
                          className="progress-bar"
                          role="progressBar"
                          style={{ width: `${pokemonStats.stats.attack}%` }}
                          area-value="25"
                          area-valuemin="0"
                          area-valuemax="100"
                        >
                          <small>{pokemonStats.stats.attack}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row align-items-center">
                    <div className="col-12 col-md-3">Defense</div>
                    <div className="col-12 col-md-9">
                      <div className="progress">
                        <div
                          className="progress-bar"
                          role="progressBar"
                          style={{ width: `${pokemonStats.stats.defense}%` }}
                          area-value="25"
                          area-valuemin="0"
                          area-valuemax="100"
                        >
                          <small>{pokemonStats.stats.defense}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row align-items-center">
                    <div className="col-12 col-md-3">Speed</div>
                    <div className="col-12 col-md-9">
                      <div className="progress">
                        <div
                          className="progress-bar"
                          role="progressBar"
                          style={{ width: `${pokemonStats.stats.speed}%` }}
                          area-value="25"
                          area-valuemin="0"
                          area-valuemax="100"
                        >
                          <small>{pokemonStats.stats.speed}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row align-items-center">
                    <div className="col-12 col-md-3">Special Attack</div>
                    <div className="col-12 col-md-9">
                      <div className="progress">
                        <div
                          className="progress-bar"
                          role="progressBar"
                          style={{
                            width: `${pokemonStats.stats.specialAttack}%`,
                          }}
                          area-value="25"
                          area-valuemin="0"
                          area-valuemax="100"
                        >
                          <small>{pokemonStats.stats.specialAttack}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row align-items-center">
                    <div className="col-12 col-md-3">Special defense</div>
                    <div className="col-12 col-md-9">
                      <div className="progress">
                        <div
                          className="progress-bar"
                          role="progressBar"
                          style={{
                            width: `${pokemonStats.stats.specialDefense}%`,
                          }}
                          area-value="25"
                          area-valuemin="0"
                          area-valuemax="100"
                        >
                          <small>{pokemonStats.stats.specialDefense}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mt-1">
                  <div className="col">
                    <p className="p-2">{pokemonDesc.description}</p>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="card-body">
              <h5 class="card-title text-center">Profile</h5>
              <div className="row">
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-6">
                      <h6 className="float-right">Height:</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-left">{pokemonStats.height} ft.</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-right">Weight:</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-left">{pokemonStats.weight} lbs</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-right">Catch Rate:</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-left">{pokemonDesc.catchRate}%</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-right">Gender Ratio:</h6>
                    </div>
                    <div className="col-6">
                      <div className="progress">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${pokemonDesc.genderRatioFemale}%`,
                            backgroundColor: '#c2185b',
                          }}
                          aria-valuenow="15"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          <small>{pokemonDesc.genderRatioFemale}</small>
                        </div>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${pokemonDesc.genderRatioMale}%`,
                            backgroundColor: '#1976d2',
                          }}
                          aria-valuenow="30"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          <small>{pokemonDesc.genderRatioMale}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-6">
                      <h6 className="float-right">Egg Groups:</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-left">{pokemonDesc.eggGroups} </h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-right">Hatch Steps:</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-left">{pokemonDesc.hatchSteps}</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-right">Abilities:</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-left">{pokemonStats.abilities}</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-right">EVs:</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-left">{pokemonDesc.evs}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer text-muted">
              Data From{' '}
              <a
                href="https://pokeapi.com"
                target="_blank"
                className="card-link"
              >
                PokeAPI.co
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
