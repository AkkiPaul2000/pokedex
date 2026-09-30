import React from 'react';
import { pokemonTypes } from '../utils/pokemonTypes';
import { pokemonElementType } from '../utils/Types';

// A type as the games label it: a badge in the type's colour with its icon and name. `children` is an
// optional note after the name (a matchup's "×4").
function TypePill({ type, children }: { type: string; children?: React.ReactNode }) {
  return (
    <span className='type-pill' data-type={type}>
      <img src={pokemonTypes[type as pokemonElementType].image} alt='' />
      {type}
      {children && <b>{children}</b>}
    </span>
  );
}

// One labelled row of badges (a Pokémon's types, or a matchup from matchupsOf); "None" when empty.
export function TypeRow({ label, entries }: { label: string; entries: [string, string?][] }) {
  return (
    <div className='type-row'>
      <h4>{label}</h4>
      <div className='type-row-pills'>
        {entries.length
          ? entries.map(([type, note]) => <TypePill key={type} type={type}>{note}</TypePill>)
          : <span className='type-row-none'>None</span>}
      </div>
    </div>
  );
}

export default TypePill;
