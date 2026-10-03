import React, { ImgHTMLAttributes, useState } from 'react';
import { IoSparkles } from 'react-icons/io5';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setShiny } from '../app/slices/AppSlice';
import { defaultImages, images } from '../utils/pokemonImage';

// PokeAPI's HOME renders (shiny and normal) on a CDN.
const CDN = 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/home';

// Props for an <img> (or motion.img) showing a dex id: the shiny render when Shiny is on, else the bundled
// render, else PokeAPI's render (the newest Pokémon aren't bundled).
export function useArt(id: number | string) {
  const shiny = useAppSelector(({ app }) => app.shiny);
  // URLs this picture couldn't load (some forms have no shiny render). Per picture, so a network blip
  // doesn't strip the shiny from every copy for the rest of the visit.
  const [failed, setFailed] = useState<string[]>([]);
  const sources = [shiny && `${CDN}/shiny/${id}.png`, images[id] || defaultImages[id], `${CDN}/${id}.png`].filter(
    (url): url is string => !!url
  );
  const src = sources.find((url) => !failed.includes(url)) ?? sources[sources.length - 1];
  return { src, onError: () => setFailed((urls) => [...urls, src]) };
}

// `id` is the dex id here, so the <img>'s own id attribute is left out.
function PokemonArt({ id, ...img }: { id: number | string } & Omit<ImgHTMLAttributes<HTMLImageElement>, 'id'>) {
  return <img alt='' {...img} {...useArt(id)} />;
}

// Shiny colours for every Pokémon picture in the app, remembered across visits.
export function ShinyToggle() {
  const shiny = useAppSelector(({ app }) => app.shiny);
  const dispatch = useAppDispatch();
  const flip = () => {
    dispatch(setShiny(!shiny));
    try {
      localStorage.setItem('shiny', String(!shiny));
    } catch {
      // Storage blocked: the switch still works for this visit.
    }
  };
  return (
    <button type='button' className='shiny-toggle' aria-pressed={shiny} onClick={flip} title='Shiny colours'>
      <IoSparkles /><span>Shiny</span>
    </button>
  );
}

export default PokemonArt;
