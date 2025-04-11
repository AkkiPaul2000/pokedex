import React, { useEffect, useCallback, useState } from 'react';
import { getInitialPokemonData } from '../app/reducers/getInitialPokemonData';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getPokemonsData } from '../app/reducers/getPokemonsData';
import PokemonCardGrid from '../components/PokemonCardGrid';
import Wrapper from '../sections/Wrapper';
import { debounce } from '../utils/Debounce';
import Loader from '../components/Loader';

function Search() {
  const dispatch = useAppDispatch();
  const { allPokemon, randomPokemons } = useAppSelector((state) => state.pokemon);
  const isLoading = useAppSelector((state) => state.app.isLoading);
  const userInfo = useAppSelector((state) => state.app.userInfo);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!allPokemon || allPokemon.length === 0) {
      dispatch(getInitialPokemonData())
        .unwrap()
        .catch((err) => console.error('Failed to fetch initial Pokemon data:', err));
    }
  }, [dispatch, allPokemon]);

  useEffect(() => {
    if (allPokemon && allPokemon.length > 0 && userInfo) {
      const cloned = [...allPokemon];
      const randomSample = cloned.sort(() => Math.random() - Math.random()).slice(0, 20);
      dispatch(getPokemonsData(randomSample))
        .unwrap()
        .catch((err) => console.error('Failed to fetch Pokemon data:', err));
    }
  }, [allPokemon, dispatch, userInfo]);

  const handlePokemon = useCallback(
    (value: string) => {
      if (!allPokemon || allPokemon.length === 0) return;

      if (value.length) {
        const filtered = allPokemon.filter((pokemon: any) =>
          pokemon.name.toLowerCase().includes(value.toLowerCase())
        );
        
        if (filtered.length > 0) {
          dispatch(getPokemonsData(filtered));
        } else {
          dispatch(getPokemonsData([]));
        }
      } else {
        const cloned = [...allPokemon];
        const randomSample = cloned
          .sort(() => Math.random() - Math.random())
          .slice(0, 20);
        dispatch(getPokemonsData(randomSample));
      }
    },
    [allPokemon, dispatch]
  );

  const handleChange = debounce((value: string) => handlePokemon(value), 2500);

  if (!userInfo) {
    return (
      <div className='search'>
        <p>Please log in to view Pokémon data.</p>
      </div>
    );
  }

  return (
    <div className='search'>
      <input
        className='bar'
        type='text'
        placeholder='Search Pokemon'
        onChange={(e) => handleChange(e.target.value)}
      />
      {isLoading ? (
        <div className="search-content">
          <Loader />
        </div>
      ) : (
        <div className="search-content">
          {isSearching ? (
            <div className="searching-indicator">Searching...</div>
          ) : randomPokemons && randomPokemons.length > 0 ? (
            <PokemonCardGrid pokemons={randomPokemons} />
          ) : (
            <p>No Pokémon found</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Wrapper(Search);
