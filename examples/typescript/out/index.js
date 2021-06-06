import {Chain} from "./ssg/pokemon/index.js";
import {html} from "./ssg/basic.js";
import "./components.js";
const SinglePokemon = ({
  number,
  name,
  image,
  weaknesses,
  resistant,
  types
}) => html`
  <hstack class="Pokemon ${types.join(" ")}">
    <vstack spacing="xs">
      <img title="${name}" src="${image}" />
      <span class="Name">${number}.${name}</span>
    </vstack>
    ${DisplayCategory({title: "Types", textArray: types})}
    ${DisplayCategory({title: "Weaknesses", textArray: weaknesses})}
    ${DisplayCategory({title: "Resistance", textArray: resistant})}
    <star-pokemon name="${name}"></star-pokemon>
  </hstack>
`;
const DisplayCategory = ({title, textArray}) => html`
  <vstack spacing="xs">
    <span>${title}</span>${textArray.map((m) => html`
          <span>${m}</span>
        `).join("")}
  </vstack>
`;
const head = async () => {
  return html`
    <title>Pokemon</title>
  `;
};
const PokemonApp = async () => {
  const Fetch = Chain(ssg.config.graphql.pokemon.url, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  const response = await Fetch.query({
    pokemons: [
      {first: 151},
      {
        number: true,
        name: true,
        image: true,
        types: true,
        resistant: true,
        weaknesses: true
      }
    ]
  });
  return html`
    <div>
      <starred-pokemon-list></starred-pokemon-list>
      ${response.pokemons.map((p) => SinglePokemon(p)).join("")}
    </div>
  `;
};
var stdin_default = async () => {
  return html`
    ${await PokemonApp()}
  `;
};
export {
  stdin_default as default,
  head
};
