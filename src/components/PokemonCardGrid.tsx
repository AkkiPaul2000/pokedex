import React, { memo } from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { IoGitCompare } from "react-icons/io5";
import { FaCheck, FaLock, FaPlus, FaTrash } from "react-icons/fa";
import { userPokemonType } from '../utils/Types'
import { addToCompare, removeFromCompare } from '../app/slices/PokemonSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setToast } from '../app/slices/AppSlice';
import { addPokemonToList } from '../app/reducers/addPokemonToList';
import { removePokemon } from '../app/reducers/removePokemonFromUserLists';
import { login } from '../auth/Login';
import PokemonArt from './PokemonArt';
import TypePill from './TypePill';

const tap = { scale: 0.9 };

// Memoised with narrow selectors: appending a page of results doesn't re-render the cards already shown.
const PokemonCard = memo(function PokemonCard({ poke, index, removable }: { poke: userPokemonType; index: number; removable: boolean }) {
  const dispatch = useAppDispatch();
  const guest = useAppSelector(({ app }) => !app.userInfo);
  const inList = useAppSelector(({ pokemon }) => pokemon.userPokemons.some(({ id }) => id === poke.id));
  const inCompare = useAppSelector(({ pokemon }) => pokemon.compareQueue.some(({ id }) => id === poke.id));
  const typeName = Object.keys(poke.types[0] ?? {})[0];
  const dex = `#${String(poke.id).padStart(3, '0')}`;

  const compare = () => {
    if (guest) return dispatch(login());
    if (inCompare) return dispatch(removeFromCompare(poke));
    dispatch(addToCompare(poke));
    dispatch(setToast(`${poke.name} added to compare.`));
  };

  return (
    <motion.div
      className='pokemon-card-cell'
      layout={removable}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut', delay: (index % 20) * 0.04 } }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
    >
      <div className='pokemon-card tilt' data-type={typeName}>
        <Link to={`/pokemon/${poke.id}`} className='pokemon-card-link'>
          <span className='pokemon-card-id' style={{ '--chars': dex.length } as React.CSSProperties}>{dex}</span>
          <h3 className='pokemon-card-title'>{poke.name}</h3>
          <PokemonArt id={poke.id} className='pokemon-card-image' loading='lazy' decoding='async' />
          <div className='pokemon-card-types'>
            {poke.types.map((type) => {
              const [name] = Object.keys(type);
              return <TypePill key={name} type={name} />;
            })}
          </div>
        </Link>
        <div className='pokemon-card-actions'>
          {removable ? (
            <motion.button whileTap={tap} className='card-action card-action--remove' title='Remove from your list'
              onClick={() => dispatch(removePokemon({ id: poke.firebaseId!, name: poke.name }))}>
              <FaTrash /><span>Remove</span>
            </motion.button>
          ) : (
            <motion.button whileTap={tap} className={`card-action card-action--add${inList ? ' done' : ''}`}
              title={guest ? 'Log in to add to your list' : inList ? 'Already in your list' : 'Add to your list'}
              onClick={() => dispatch(addPokemonToList(poke))}>
              {guest ? <FaLock /> : inList ? <FaCheck /> : <FaPlus />}<span>{inList ? 'Added' : 'Add'}</span>
            </motion.button>
          )}
          <motion.button whileTap={tap} className={`card-action card-action--compare${inCompare ? ' done' : ''}`}
            title={guest ? 'Log in to compare' : inCompare ? 'Remove from compare' : 'Compare'}
            onClick={compare}>
            {guest ? <FaLock /> : <IoGitCompare />}<span>{inCompare ? 'Comparing' : 'Compare'}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});

// `lead` renders as the grid's first cell (Search's quiz); `children` render inside the scroll container,
// after the cards (Search puts its load-more sentinel there).
function PokemonCardGrid({ pokemons, lead, children }: { pokemons?: userPokemonType[]; lead?: React.ReactNode; children?: React.ReactNode }) {
  const { pathname } = useLocation();
  // Search and a Pokémon's evolutions offer "Add"; My List offers "Remove" (and animates removals).
  const removable = !(pathname.startsWith("/pokemon") || pathname.startsWith("/search"));
  return (
    <div className='pokemon-card-grid-container'>
      {pokemons && pokemons.length > 0 ? (
        <div className='pokemon-card-grid'>
          {lead}
          <AnimatePresence>
            {pokemons.map((poke, index) => <PokemonCard key={poke.id} poke={poke} index={index} removable={removable} />)}
          </AnimatePresence>
        </div>
      ) : (
        <p className='pokemon-card-grid-empty'>Your list is empty. Add Pokémon from Search.</p>
      )}
      {children}
    </div>
  )
}

export default PokemonCardGrid
