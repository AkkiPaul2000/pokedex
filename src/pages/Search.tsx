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
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (!allPokemon || allPokemon.length === 0) {
      dispatch(getInitialPokemonData())
        .unwrap()
        .then(() => setError(null))
        .catch((err) => {
          console.error('Failed to fetch initial Pokemon data:', err);
          setError('Failed to load Pokemon data. Please try again later.');
        });
    }
  }, [dispatch, allPokemon]);

  useEffect(() => {
    if (allPokemon && allPokemon.length > 0 && userInfo) {
      const cloned = [...allPokemon];
      const randomSample = cloned.sort(() => Math.random() - Math.random()).slice(0, 20);
      dispatch(getPokemonsData(randomSample))
        .unwrap()
        .then(() => setError(null))
        .catch((err) => {
          console.error('Failed to fetch Pokemon data:', err);
          setError('Failed to load Pokemon details. Please try again later.');
        });
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

  const handleChange = debounce((value: string) => {
    handlePokemon(value);
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 3000);
  }, 1000);

  if (!userInfo) {
    return (
      <div className='search'>
        <div className="login-message">
          <p>Please log in to view Pokémon data.</p>
          <p className="error-hint">If the login popup was closed, please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='search'>
      <input
        className='bar'
        type='text'
        placeholder='Search Pokemon'
        onChange={(e) => {
          const value = e.target.value;
          setSearchText(value);
          handleChange(value);
        }}
        value={searchText}
      />
      <div className="search-content">
        {error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-button">
              Retry
            </button>
          </div>
        ) : (
          <>
            {isSearching ? (
              <div className="searching-indicator">Searching...</div>
            ) : isLoading ? (
              <Loader />
            ) : randomPokemons && randomPokemons.length > 0 ? (
              <PokemonCardGrid pokemons={randomPokemons} />
            ) : (
              <p className="no-results">No Pokémon found</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Wrapper(Search);
