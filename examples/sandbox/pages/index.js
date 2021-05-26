import { Features } from './Features.js';
import { html } from './ssg/basic.js';
import { Chain } from './ssg/feature-mole/index.js';

const Title = html`
  <h1 class="font-black">
    ✅ FeatureMole.com
  </h1>
`;
const Motto = html`
  <h2 class="text-gray-400">
    Resolve your issues
  </h2>
`;

const Header = html`
  <div class="mb-2 bg-sblue p-5 text-white">
    ${Title} ${Motto}
  </div>
`;

export const head = () => html`
  <title>Hello world!</title>
`;
export default async () => {
  const response = await Chain(ssg.config.graphql['feature-mole'].url).query({
    home: {
      title: true,
      content: true,
      createdAt: true,
      offeredWorms: true,
      issueURL: true,
      repositoryURL: true,
      languages: {
        name: true,
        colour: true,
      },
      createdBy: {
        firstName: true,
        lastName: true,
        company: true,
        avatar: true,
      },
    },
  });

  return html`
    <div
      class="
    bg-gray-100
    font-noto
"
    >
      ${Header}
      <div class="container mx-auto space-y-5 p-5">
        ${Features(response.home)}
      </div>
    </div>
  `;
};
