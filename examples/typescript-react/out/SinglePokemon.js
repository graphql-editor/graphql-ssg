import React from "https://cdn.skypack.dev/react";
const DisplayCategory = ({
  title,
  textArray
}) => /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", null, title), textArray.map((m) => /* @__PURE__ */ React.createElement("span", {
  key: m
}, m)));
const SinglePokemon = ({
  number,
  name,
  image,
  weaknesses,
  resistant,
  types
}) => /* @__PURE__ */ React.createElement("a", {
  href: `./PokemonPage/${name}.html`,
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
export {
  SinglePokemon
};
