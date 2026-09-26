import React, { useEffect, useCallback, useMemo, useRef, useState } from 'react';
import { getInitialPokemonData } from '../app/reducers/getInitialPokemonData';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getPokemonsData } from '../app/reducers/getPokemonsData';
import PokemonCardGrid from '../components/PokemonCardGrid';
import Wrapper from '../sections/Wrapper';
import { debounce } from '../utils/Debounce';
import Loader from '../components/Loader';
import { generatedPokemonType, genericPokemonType } from '../utils/Types';

const PAGE_SIZE = 20;
const shuffled = (pokemons: genericPokemonType[]) =>
  [...pokemons].sort(() => Math.random() - Math.random());

function Search() {
  const dispatch = useAppDispatch();
  const allPokemon = useAppSelector((state) => state.pokemon.allPokemon);
  const isLoading = useAppSelector((state) => state.app.isLoading);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<generatedPokemonType[]>();
  const [hasMore, setHasMore] = useState(false);
  const matches = useRef<genericPokemonType[]>([]); // everything the current search matches, in display order
  const loaded = useRef(0); // how many of `matches` have been requested
  const lastRequest = useRef<{ abort(): void }>(undefined);
  const sentinel = useRef<HTMLDivElement>(null);

  // Fetches the next page of `matches` (or the first, on reset). Aborting the previous
  // request keeps an older, slower search from landing after a newer one.
  const loadPage = useCallback((reset = false) => {
    lastRequest.current?.abort();
    if (reset) {
      loaded.current = 0;
      setResults(undefined);
    }
    const page = matches.current.slice(loaded.current, loaded.current + PAGE_SIZE);
    loaded.current += page.length;
    const request = dispatch(getPokemonsData(page));
    lastRequest.current = request;
    request
      .unwrap()
      .then((pokemons) => {
        setResults((shown) => (reset || !shown ? pokemons : [...shown, ...pokemons]));
        setHasMore(loaded.current < matches.current.length);
        setError(null);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('Failed to fetch Pokemon data:', err);
        setError('Failed to load Pokemon details. Please try again later.');
      });
  }, [dispatch]);

  // An empty search browses the whole Pokédex in random order.
  const search = useCallback((value: string) => {
    if (!allPokemon?.length) return;
    const term = value.trim().toLowerCase();
    matches.current = term
      ? allPokemon.filter((pokemon) => pokemon.name.includes(term))
      : shuffled(allPokemon);
    loadPage(true);
  }, [allPokemon, loadPage]);

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
    search("");
  }, [search]);

  const handleChange = useMemo(() => debounce(search, 400), [search]);

  // Infinite scroll: load the next page once the sentinel after the cards comes within
  // 600px of the bottom of the grid's scroll container.
  useEffect(() => {
    const el = sentinel.current;
    if (!el || !hasMore || isLoading) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && loadPage(),
      { root: el.parentElement, rootMargin: '0px 0px 600px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isLoading, loadPage]);

  // Guests can browse; the cards' Add / Compare buttons ask them to log in.
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
        ) : !results ? (
          <Loader />
        ) : results.length > 0 ? (
          <PokemonCardGrid pokemons={results}>
            <div ref={sentinel} className="search-sentinel">{hasMore && isLoading && <Loader />}</div>
          </PokemonCardGrid>
        ) : (
          <p className="no-results">No Pokémon found</p>
        )}
      </div>
    </div>
  );
}

export default Wrapper(Search);
