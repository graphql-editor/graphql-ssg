const { render } = await import(
  'https://cdn.skypack.dev/preact-render-to-string'
);

const { html: htm, h } = await import(
  'https://unpkg.com/htm/preact/index.mjs?module'
);
html = htm;

const response = await Gql.query({
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
const app = html`
  <${App} response=${response} />
`;
return render(app);
