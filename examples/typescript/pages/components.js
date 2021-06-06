import {html, define, store} from "https://cdn.skypack.dev/hybrids";
import {css} from "./ssg/basic.js";
const StarPokemon = {
  starred: false,
  name: "",
  render: ({name, starred}) => html`
      <div
        onclick="${(host) => {
    host.starred = !host.starred;
    const actualValue = store.get(StarredPokemon);
    store.set(StarredPokemon, {
      pokemons: host.starred ? [...actualValue.pokemons, name] : actualValue.pokemons.filter((p) => p !== name)
    });
  }}"
        class="hhh"
      >
        ${starred ? "Starred" : "Star"}
      </div>
    `
};
define("star-pokemon", StarPokemon);
const StarredPokemon = {pokemons: [""]};
const StarredPokemonList = {
  data: store(StarredPokemon),
  render: ({data}) => {
    return html`
      <div class="list">
        ${data.pokemons.map((name) => html`
              <div class="pokemon">${name}</div>
            `)}
      </div>
    `.style(css`
      .list {
        display: flex;
        padding: 10px;
        background: #ffe;
        position: fixed;
        z-index: 2;
      }
      .pokemon {
        margin-right: 10px;
      }
    `);
  }
};
define("starred-pokemon-list", StarredPokemonList);
