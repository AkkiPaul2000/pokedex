import React from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import { generatedPokemonType, pokemonElementType, pokemonStatType, pokemonTypeInterface } from '../utils/Types'
import { FaPlus } from 'react-icons/fa'
import { pokemonTypes } from '../utils/pokemonTypes';
import { useAppDispatch } from '../app/hooks';
import { useNavigate } from 'react-router-dom';
import { removeFromCompare } from '../app/slices/PokemonSlice';
import { addPokemonToList } from '../app/reducers/addPokemonToList';

const statRows: [string, pokemonStatType][] = [
  ["Strength", "strength"],
  ["Resistance", "resistance"],
  ["Vulnerable", "vulnerable"],
  ["Weakness", "weakness"],
];
const tap = { scale: 0.95 };
const fade = { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.96 }, transition: { duration: 0.2 } };

// Every type the Pokémon's types are strong against / resist / etc., without duplicates.
const matchups = (types: pokemonTypeInterface[], statType: pokemonStatType) =>
  Array.from(new Set(types.flatMap((type) => Object.values(type)[0][statType])));

function TypeIcons({ title, names }: { title: string; names: string[] }) {
  return (
    <div className="pokemon-types">
      <h4 className='pokemon-type-title'>{title}</h4>
      <div className="pokemon-type-icons">
        {names.map((name) => (
          <div className="pokemon-type" key={name}>
            <img src={pokemonTypes[name as pokemonElementType].image} alt={name} title={name} className='pokemon-type-image' loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
}

function CompareContainer({ pokemon }: { pokemon?: generatedPokemonType }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
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
              <TypeIcons title="Type" names={pokemon.types.map((type) => Object.keys(type)[0])} />
              {statRows.map(([title, statType]) => (
                <TypeIcons key={statType} title={title} names={matchups(pokemon.types, statType)} />
              ))}
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
