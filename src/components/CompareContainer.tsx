import React from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import { generatedPokemonType } from '../utils/Types'
import { FaPlus } from 'react-icons/fa'
import { matchupsOf } from '../utils/pokemonTypes';
import { TypeRow } from './TypePill';
import { useAppDispatch } from '../app/hooks';
import { useNavigate } from 'react-router-dom';
import { removeFromCompare } from '../app/slices/PokemonSlice';
import { addPokemonToList } from '../app/reducers/addPokemonToList';

const tap = { scale: 0.95 };
const fade = { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.96 }, transition: { duration: 0.2 } };

function CompareContainer({ pokemon }: { pokemon?: generatedPokemonType }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const types = pokemon?.types.map((type) => Object.keys(type)[0]) ?? [];
  return (
    <div className='compare-container'>
      <AnimatePresence mode="wait">
        {pokemon ? (
          <motion.div className="compare-element" key={pokemon.id} {...fade}>
            <div className="compare-details tilt">
              <h3>{pokemon.name}</h3>
              <img src={pokemon.image} alt={pokemon.name} className="compare-image" />
            </div>
            <div className="pokemon-types-container">
              <TypeRow label="Type" entries={types.map((type): [string] => [type])} />
              {matchupsOf(types).map(([label, entries]) => <TypeRow key={label} label={label} entries={entries} />)}
            </div>
            <div className="compare-action-buttons">
              <motion.button whileTap={tap} className="compare-btn" onClick={() => dispatch(addPokemonToList(pokemon))}>
                Add
              </motion.button>
              <motion.button whileTap={tap} className="compare-btn" onClick={() => navigate(`/pokemon/${pokemon.id}`)}>
                View
              </motion.button>
              <motion.button whileTap={tap} className="compare-btn" onClick={() => dispatch(removeFromCompare(pokemon))}>
                Remove
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div className='empty' key="empty" {...fade} onClick={() => navigate('/search')}>
            <motion.button whileHover={{ scale: 1.06 }} whileTap={tap} aria-label="Add to compare"><FaPlus /></motion.button>
            <h3>Add to Compare</h3>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CompareContainer
