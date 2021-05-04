import { render as r } from 'https://cdn.skypack.dev/preact-render-to-string';
import { html as htm, h } from 'https://unpkg.com/htm/preact/index.mjs?module';

const Fetch = Chain('https://graphql-pokemon2.vercel.app/', {
  'Content-Type': 'application/json',
});

html = htm;

const Pokemon = ({ number, name, image, weaknesses, resistant, types }) => {
  return html`
    <hstack class="Pokemon ${types.join(' ')}">
      <vstack spacing="xs">
        <img title="${name}" src="${image}" />
        <span class="Name">${number}.${name}</span>
      </vstack>
      <${DisplayCategory} title="Types" textArray=${types} />
      <${DisplayCategory} title="Weaknesses" textArray=${weaknesses} />
      <${DisplayCategory} title="Resistance" textArray=${resistant} />
    </hstack>
  `;
};

const DisplayCategory = ({ title, textArray }) => html`
  <vstack spacing="xs">
    <span>${title}</span>${textArray.map(
      (m) => html`
        <span>${m}</span>
      `,
    )}
  </vstack>
`;

function App({ response }) {
  return html`
    <vstack>
      <list id="Pokemons">
        ${response.pokemons.map(Pokemon)}
      </list>
    </vstack>
  `;
}

// Create your app
export default async () => {
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
  const app = html`
    <${App} response=${response} />
  `;
  return r(app);
};
