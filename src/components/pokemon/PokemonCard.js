import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Sprite = styled.img`
  width: 5em;
  height: 5em;
  display: none;
`;

const Card = styled.div`
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transaction: all 0.3 cubic-bezier(0.25, 0.8, 0.25, 1);
  &:hover {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  }
  -moz-user-select: none;
  -website-user-select: none;
  user-select: none;
  -o-user-select: none;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
  &:focus,
  &:hover &:viseted &:link,
  &active {
    text-decoration: none;
  }
`;

export default function PokemonCard(props) {
  const { name, url } = props;

  const [pokemonCard, setPokemonCard] = useState({});
  const [imageLoading, setImageLoading] = useState(true);
  const [toManyRequests, setToManyRequests] = useState(false);

  const adjustName = (name) => {
    const adjustedName = name
      .toLowerCase()
      .split(' ')
      .map((letra) => letra.charAt(0).toUpperCase() + letra.substring(1))
      .join(' ');

    return adjustedName;
  };

  useEffect(() => {
    const pokemonIndex = url.split('/')[url.split('/').length - 2];
    const imgUrl = `https://github.com/PokeAPI/sprites/blob/master/sprites/pokemon/${pokemonIndex}.png?raw=true`;

    const names = adjustName(name);

    setPokemonCard({ name: names, imgUrl, pokemonIndex });
  }, []);

  return (
    <div className="col-md-3 col-sm-6 mb-5">
      <StyledLink to={`pokemon/${pokemonCard.pokemonIndex}`}>
        <Card className="card">
          <h5 className="card-header">{pokemonCard.pokemonIndex}</h5>
          {imageLoading ? (
            <div className="d-flex justify-content-center text-primary">
              <div className="spinner-grow" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : null}
          <Sprite
            className="card-img-top rounded mx-auto mt-2"
            src={pokemonCard.imgUrl}
            onLoad={() => setImageLoading(false)}
            onError={() => setToManyRequests(true)}
            style={
              toManyRequests
                ? { display: 'none' }
                : imageLoading
                ? null
                : { display: 'block' }
            }
          ></Sprite>
          {toManyRequests ? (
            <h6 className="mx-auto">
              <span className="badge badge-danger mt-2">To Many Request</span>
            </h6>
          ) : null}
          <div className="card-body mx-auto">
            <h6 className="card-title">{pokemonCard.name}</h6>
          </div>
        </Card>
      </StyledLink>
    </div>
  );
}
