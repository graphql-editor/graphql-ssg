import {Chain} from "./ssg/pokemon/index.js";
import React from "https://cdn.skypack.dev/react";
import ReactDOM from "https://cdn.skypack.dev/react-dom";
import {SinglePokemon} from "./SinglePokemon.js";
import {html} from "./ssg/basic.js";
const head = async () => html`
    <title>Pokemon</title>
  `;
const PokemonApp = ({response}) => {
  return /* @__PURE__ */ React.createElement("div", null, response?.pokemons.map((p) => /* @__PURE__ */ React.createElement(SinglePokemon, {
    key: p.name,
    ...p
  })));
};
const data = async () => {
  const Fetch = Chain(ssg.config.graphql.pokemon.url, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  return Fetch.query({
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
};
const hydrate = async (staticData) => ReactDOM.hydrate(/* @__PURE__ */ React.createElement(PokemonApp, {
  response: staticData
}), document.body);
var stdin_default = async (staticData) => {
  const renderBody = document.createElement("div");
  ReactDOM.render(/* @__PURE__ */ React.createElement(PokemonApp, {
    response: staticData
  }), renderBody);
  return renderBody.innerHTML;
};
export {
  data,
  stdin_default as default,
  head,
  hydrate
};
