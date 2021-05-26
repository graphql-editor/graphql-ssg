import { html } from './ssg/basic.js';
import { Chain } from './ssg/feature-mole/index.js';

const Title = html`
  <h1 class="font-black">
    ✅ FeatureMole.com
  </h1>
`;
const Motto = html`
  <h2 class="text-gray-100">
    Resolve your issues immediatelyy
  </h2>
`;

const Header = html`
  <div class="mb-2 bg-sblue p-5 text-white">
    ${Title} ${Motto}
  </div>
`;

const WormIt = (worms) => html`
  <a
    class="
        text-blue-600
        border
        border-blue-600
        hover:bg-blue-600
        hover:text-white
        flex
        items-center
        justify-center
        cursor-pointer
        rounded
        font-bold
        px-5
        py-2
        text-xs
        ml-auto
    "
  >
    Try for ${worms}🐛
  </a>
`;

const Lang = (l) => html`
  <div
    class="
    bg-${l.colour}-600
    text-white
    text-xs
    p-1
"
  >
    ${l.name}
  </div>
`;

const Features = (features) => {
  return features
    .map(
      (f) => html`
        <div
          class="
        bg-white
        p-5
        rounded
        cursor-pointer
        hover:bg-gray-100
        transition
        duration-500 
        ease-in-out 
        hover:bg-blue-200 
        transform 
        hover:-translate-y-1 
        hover:scale-105
    "
        >
          <div
            class="
            flex
            flex-row
            items-start
        "
          >
            <div
              ${f.createdBy.avatar
                ? `style="background-image:url(${f.createdBy.avatar})";`
                : ''}
              class="
                    w-8
                    h-8
                    rounded
                    bg-contain
                    bg-gray-400
                    mr-4
                "
            ></div>
            <div
              class="
                flex-1
            "
            >
              <div class="text-xs text-gray-600">
                Created by ${f.createdBy.firstName} from ${f.createdBy.company}
                on ${new Date(f.createdAt).toDateString()}
              </div>
              <div class="text-xs font-bold text-gray-600">
                ${f.repositoryURL}
              </div>
              <div class="mb-4">${f.content}</div>
              <div
                class="
                    flex
                    flex-row
                    flex-wrap
                    space-x-1
                "
              >
                ${f.languages
                  .slice(0, 3)
                  .map((l) => Lang(l))
                  .join('')}
              </div>
              <div class="flex">
                ${WormIt(f.offeredWorms)}
              </div>
            </div>
          </div>
        </div>
      `,
    )
    .join('');
};

export const head = () => {
  return html`
    <title>Details page</title>
  `;
};

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
    bg-gray-200
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
