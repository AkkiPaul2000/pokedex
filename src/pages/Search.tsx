import React, { useEffect, useCallback, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { IoClose, IoSearch } from 'react-icons/io5';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import { getInitialPokemonData } from '../app/reducers/getInitialPokemonData';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getPokemonsData } from '../app/reducers/getPokemonsData';
import PokemonCardGrid from '../components/PokemonCardGrid';
import WhosThatPokemon from '../components/WhosThatPokemon';
import Wrapper from '../sections/Wrapper';
import { debounce } from '../utils/Debounce';
import Loader from '../components/Loader';
import { pokemonApi } from '../utils/Constant';
import { pokemonTypes } from '../utils/pokemonTypes';
import { idOf, spriteOf } from '../utils/pokemonImage';
import { generatedPokemonType, genericPokemonType } from '../utils/Types';

const PAGE_SIZE = 20;
const shuffled = (pokemons: genericPokemonType[]) =>
  [...pokemons].sort(() => Math.random() - Math.random());
// The grid skips Pokémon without local art, so filters and counts do too.
const hasArt = (pokemon: genericPokemonType) => !!spriteOf(idOf(pokemon));

// Each type's members, fetched once per app visit.
// ponytail: a failed fetch stays cached until reload (the error's Retry reloads); evict on reject if that bites.
const typeMembers: Record<string, Promise<genericPokemonType[]>> = {};
const membersOf = (type: string) =>
  (typeMembers[type] ??= axios
    .get(`${pokemonApi}/type/${type}`)
    .then(({ data }) => data.pokemon.map(({ pokemon }: { pokemon: genericPokemonType }) => pokemon).filter(hasArt)));

// "25" or "#025" matches dex numbers from the start; anything else matches names.
const matcher = (term: string) => {
  const number = term.replace(/^#/, '');
  return /^\d+$/.test(number)
    ? (pokemon: genericPokemonType) => String(idOf(pokemon)).startsWith(String(Number(number)))
    : (pokemon: genericPokemonType) => pokemon.name.includes(term);
};

function Search() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const allPokemon = useAppSelector((state) => state.pokemon.allPokemon);
  const isLoading = useAppSelector((state) => state.app.isLoading);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [term, setTerm] = useState(""); // searchText, debounced
  const [type, setType] = useState<string>();
  const [total, setTotal] = useState<number>();
  const [results, setResults] = useState<generatedPokemonType[]>();
  const [hasMore, setHasMore] = useState(false);
  const matches = useRef<genericPokemonType[]>([]); // everything the current filters match, in display order
  const loaded = useRef(0); // how many of `matches` have been requested
  const lastRequest = useRef<{ abort(): void }>(undefined);
  const sentinel = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

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

  // Everything the grid can show; also the pool for "Surprise me" and the quiz.
  const withArt = useMemo(() => allPokemon?.filter(hasArt) ?? [], [allPokemon]);

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

  // A type narrows the pool and the search term narrows it further; with neither, browse it all shuffled.
  useEffect(() => {
    if (!withArt.length) return;
    let current = true;
    const query = term.trim().toLowerCase();
    lastRequest.current?.abort(); // the old filter's page must not land while the new pool loads
    setResults(undefined);
    (type ? membersOf(type) : Promise.resolve(withArt))
      .then((pool) => {
        if (!current) return;
        matches.current = query ? pool.filter(matcher(query)) : type ? pool : shuffled(pool);
        setTotal(matches.current.length);
        loadPage(true);
      })
      .catch((err) => {
        if (!current) return;
        console.error('Failed to fetch Pokemon type:', err);
        setError('Failed to load Pokemon data. Please try again later.');
      });
    return () => { current = false; };
  }, [withArt, term, type, loadPage]);

  const debouncedSetTerm = useMemo(() => debounce(setTerm, 400), []);
  const change = (value: string) => {
    setSearchText(value);
    debouncedSetTerm(value);
  };

  // "/" anywhere on the page jumps to the search box.
  useEffect(() => {
    const focus = (e: KeyboardEvent) => {
      if (e.key !== '/' || (e.target as Element).closest('input, textarea')) return;
      e.preventDefault();
      input.current?.focus();
    };
    window.addEventListener('keydown', focus);
    return () => window.removeEventListener('keydown', focus);
  }, []);

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

  const surprise = () => navigate(`/pokemon/${idOf(withArt[Math.floor(Math.random() * withArt.length)])}`);

  // Guests can browse; the cards' Add / Compare buttons ask them to log in.
  return (
    <div className='search'>
      <div className='search-console'>
        <div className='search-row'>
          <div className='search-field'>
            <IoSearch aria-hidden />
            <input
              ref={input}
              type='search'
              placeholder='Search by name or No.'
              aria-label='Search Pokémon by name or number'
              value={searchText}
              onChange={(e) => change(e.target.value)}
            />
            {total !== undefined && <span className='count'>{total} Pokémon</span>}
            {searchText ? (
              <button type='button' className='clear' aria-label='Clear search' onClick={() => { change(''); input.current?.focus(); }}>
                <IoClose />
              </button>
            ) : (
              <kbd title='Press / to search'>/</kbd>
            )}
          </div>
          <motion.button whileTap={{ scale: 0.92 }} className='surprise' onClick={surprise} disabled={!withArt.length} title='Open a random Pokémon'>
            <GiPerspectiveDiceSixFacesRandom /><span>Surprise me</span>
          </motion.button>
        </div>
        <div className='type-chips' role='group' aria-label='Filter by type'>
          <button className='type-chip' aria-pressed={!type} onClick={() => setType(undefined)}>All</button>
          {Object.entries(pokemonTypes).map(([name, { image }]) => (
            <button key={name} className='type-chip' data-type={name} aria-pressed={type === name}
              onClick={() => setType(type === name ? undefined : name)}>
              <img src={image} alt='' />{name}
            </button>
          ))}
        </div>
      </div>
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
          <PokemonCardGrid pokemons={results} lead={!term.trim() && !type && <WhosThatPokemon pool={withArt} />}>
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
