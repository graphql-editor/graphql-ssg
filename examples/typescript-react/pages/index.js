import {Chain} from "./ssg/pokemon/index.js";
import React from "https://cdn.skypack.dev/react";
import ReactDOM from "https://cdn.skypack.dev/react-dom";
const SinglePokemon = ({
  number,
  name,
  image,
  weaknesses,
  resistant,
  types
}) => /* @__PURE__ */ React.createElement("div", {
  onClick: () => alert("hello"),
  className: `Pokemon ${types.join(" ")}`
}, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("img", {
  title: name,
  src: image
}), /* @__PURE__ */ React.createElement("span", {
  className: "Name"
}, number, ".", name)), /* @__PURE__ */ React.createElement(DisplayCategory, {
  title: "Types",
  textArray: types
}), /* @__PURE__ */ React.createElement(DisplayCategory, {
  title: "Weaknesses",
  textArray: weaknesses
}), /* @__PURE__ */ React.createElement(DisplayCategory, {
  title: "Resistance",
  textArray: resistant
}));
const DisplayCategory = ({
  title,
  textArray
}) => /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", null, title), textArray.map((m) => /* @__PURE__ */ React.createElement("span", {
  key: m
}, m)));
export const head = async () => /* @__PURE__ */ React.createElement("title", null, "Pokemon");
const PokemonApp = ({response}) => {
  return /* @__PURE__ */ React.createElement("div", null, response?.pokemons.map((p) => /* @__PURE__ */ React.createElement(SinglePokemon, {
    key: p.name,
    ...p
  })));
};
export const data = async () => {
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
export const hydrate = async (staticData) => ReactDOM.hydrate(/* @__PURE__ */ React.createElement(PokemonApp, {
  response: staticData
}), document.body);
export default async (staticData) => {
  const renderBody = document.createElement("div");
  ReactDOM.render(/* @__PURE__ */ React.createElement(PokemonApp, {
    response: staticData
  }), renderBody);
  return renderBody.innerHTML;
};
