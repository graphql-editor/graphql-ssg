import {Chain} from "./ssg/pokemon/index.js";
import React from "https://cdn.skypack.dev/react";
import ReactDOM from "https://cdn.skypack.dev/react-dom";
import {SinglePokemon} from "./SinglePokemon.js";
import {html} from "./ssg/basic.js";
const PokemonApp = (staticData) => {
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(SinglePokemon, {
    ...staticData
  }));
};
const data = async () => {
  const Fetch = Chain(ssg.config.graphql.pokemon.url, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  return Fetch.query({
    pokemons: [
      {first: 5},
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
  ...staticData
}), document.body);
const pages = (staticData) => {
  return staticData.pokemons?.map((p) => {
    const renderBody = document.createElement("div");
    ReactDOM.render(/* @__PURE__ */ React.createElement(PokemonApp, {
      ...p
    }), renderBody);
    return {
      slug: p.name?.split(" ")[0],
      body: renderBody.innerHTML,
      data: p,
      head: html`
        <title>${p.name || ""}</title>
        <link href="../index.css" rel="stylesheet" type="text/css" />
      `
    };
  });
};
export {
  data,
  hydrate,
  pages
};
