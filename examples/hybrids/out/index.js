import { Chain } from './ssg/index.js';
import { html as hybridshtml, define } from 'https://cdn.skypack.dev/hybrids';
import { html } from './ssg/basic.js';

const StarPokemon = {
  starred: false,
  render: ({ name, starred }) =>
    hybridshtml`<div onclick="${(host) => {
      host.starred = !host.starred;
    }}" class="hhh">${starred ? 'Starred' : 'Star'}</div>`,
};

define('star-pokemon', StarPokemon);

const SinglePokemon = ({
  number,
  name,
  image,
  weaknesses,
  resistant,
  types,
}) => html`
  <hstack class="Pokemon ${types.join(' ')}">
    <vstack spacing="xs">
      <img title="${name}" src="${image}" />
      <span class="Name">${number}.${name}</span>
    </vstack>
    ${DisplayCategory({ title: 'Types', textArray: types })}
    ${DisplayCategory({ title: 'Weaknesses', textArray: weaknesses })}
    ${DisplayCategory({ title: 'Resistance', textArray: resistant })}
    <star-pokemon name=${name}></star-pokemon>
  </hstack>
`;

const DisplayCategory = ({ title, textArray }) => html`
  <vstack spacing="xs">
    <span>${title}</span>${textArray
      .map(
        (m) => html`
          <span>${m}</span>
        `,
      )
      .join('')}
  </vstack>
`;

export const head = async () => {
  return html`
    <title>Pokemon</title>
  `;
};

const PokemonApp = async () => {
  const Fetch = Chain('https://graphql-pokemon2.vercel.app/', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const response = await Fetch.query({
    pokemons: [
      { first: 151 },
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
  return html`
    <div>
      ${response.pokemons.map((p) => SinglePokemon(p)).join('')}
    </div>
  `;
};

// Create your app
export default async () => {
  return html`
    ${await PokemonApp()}
  `;
};
