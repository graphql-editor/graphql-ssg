import { Chain } from './ssg/pokemon/index.js';
import React from 'https://cdn.skypack.dev/react';
import ReactDOM from 'https://cdn.skypack.dev/react-dom';
const SinglePokemon = ({ number, name, image, weaknesses, resistant, types, }) => (React.createElement("div", { onClick: () => alert('hello'), className: `Pokemon ${types.join(' ')}` },
    React.createElement("div", null,
        React.createElement("img", { title: name, src: image }),
        React.createElement("span", { className: "Name" },
            number,
            ".",
            name)),
    React.createElement(DisplayCategory, { title: "Types", textArray: types }),
    React.createElement(DisplayCategory, { title: "Weaknesses", textArray: weaknesses }),
    React.createElement(DisplayCategory, { title: "Resistance", textArray: resistant })));
const DisplayCategory = ({ title, textArray, }) => (React.createElement("div", null,
    React.createElement("span", null, title),
    textArray.map((m) => (React.createElement("span", { key: m }, m)))));
export const head = async () => React.createElement("title", null, "Pokemon");
const PokemonApp = ({ response }) => {
    return (React.createElement("div", null, response?.pokemons.map((p) => (React.createElement(SinglePokemon, { key: p.name, ...p })))));
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
};
export const hydrate = async (staticData) => ReactDOM.hydrate(React.createElement(PokemonApp, { response: staticData }), document.body);
export default async (staticData) => {
    const renderBody = document.createElement('div');
    ReactDOM.render(React.createElement(PokemonApp, { response: staticData }), renderBody);
    return renderBody.innerHTML;
};
