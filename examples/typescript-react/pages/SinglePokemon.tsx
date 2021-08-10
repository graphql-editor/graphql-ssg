import React from 'https://cdn.skypack.dev/react';

const DisplayCategory = ({
  title,
  textArray,
}: {
  title: string;
  textArray: string[];
}) => (
  <div>
    <span>{title}</span>
    {textArray.map((m: string) => (
      <span key={m}>{m}</span>
    ))}
  </div>
);

export const SinglePokemon = ({
  number,
  name,
  image,
  weaknesses,
  resistant,
  types,
}: {
  number: number;
  name: string;
  image: string;
  weaknesses: string[];
  resistant: string[];
  types: string[];
}) => (
  <a
    href={`./PokemonPage/${name}.html`}
    className={`Pokemon ${types.join(' ')}`}
  >
    <div>
      <img title={name} src={image} />
      <span className="Name">
        {number}.{name}
      </span>
    </div>
    <DisplayCategory title="Types" textArray={types} />
    <DisplayCategory title="Weaknesses" textArray={weaknesses} />
    <DisplayCategory title="Resistance" textArray={resistant} />
  </a>
);
