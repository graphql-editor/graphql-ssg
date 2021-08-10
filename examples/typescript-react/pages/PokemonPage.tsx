import { Chain } from './ssg/pokemon/index.js';
import React from 'https://cdn.skypack.dev/react';
import ReactDOM from 'https://cdn.skypack.dev/react-dom';
import { SinglePokemon } from './SinglePokemon.js';
import { html } from './ssg/basic.js';

const PokemonApp = (staticData: any) => {
  return (
    <div>
      <SinglePokemon {...staticData} />
    </div>
  );
};

// Create your app
export const data = async () => {
  const Fetch = Chain(ssg.config.graphql.pokemon.url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return Fetch.query({
    pokemons: [
      { first: 5 },
      {
        number: true,
        name: true,
        image: true,
        types: true,
        resistant: true,
        weaknesses: true,
      },
    ],
  });
};

type DataType = ReturnType<typeof data> extends Promise<infer R> ? R : never;
type SingleData = Required<DataType>['pokemons'] extends Array<infer R>
  ? Required<R>
  : never;

export const hydrate = async (staticData: DataType) =>
  ReactDOM.hydrate(<PokemonApp {...staticData} />, document.body);

export const pages = (staticData: DataType) => {
  return staticData.pokemons?.map((p) => {
    const renderBody = document.createElement('div');
    ReactDOM.render(<PokemonApp {...p} />, renderBody);
    return {
      slug: p.name?.split(' ')[0],
      body: renderBody.innerHTML,
      data: p,
      head: html`
        <title>${p.name || ''}</title>
        <link href="../index.css" rel="stylesheet" type="text/css" />
      `,
    };
  });
};
