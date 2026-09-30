import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { genericPokemonType } from '../utils/Types';
import { idOf, spriteOf } from '../utils/pokemonImage';

// Four different species, one of them the answer. Alternate forms (ids 10001+) are left out: their
// silhouettes match the base form's.
const newRound = (pool: genericPokemonType[]) => {
  const options = new Set<genericPokemonType>();
  while (options.size < 4) {
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (idOf(pick) < 10000) options.add(pick);
  }
  const list = Array.from(options);
  return { options: list, answer: list[Math.floor(Math.random() * list.length)] };
};

// Quiz tile at the head of the Search grid: name the silhouette to grow a streak.
function WhosThatPokemon({ pool }: { pool: genericPokemonType[] }) {
  const [{ options, answer }, setRound] = useState(() => newRound(pool));
  const [guess, setGuess] = useState<genericPokemonType>();
  const [streak, setStreak] = useState(0);

  const pick = (option: genericPokemonType) => {
    setGuess(option);
    setStreak(option === answer ? streak + 1 : 0);
  };
  const next = () => {
    setGuess(undefined);
    setRound(newRound(pool));
  };

  return (
    <div className={`whos-that${guess ? ' revealed' : ''}`}>
      <h3 className='whos-that-title'>Who's that Pokémon?</h3>
      <div className='whos-that-stage'>
        <motion.img
          key={answer.name}
          src={spriteOf(idOf(answer))}
          alt={guess ? answer.name : 'Mystery Pokémon'}
          draggable={false}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        />
      </div>
      <div className='whos-that-options'>
        {options.map((option) => (
          <button
            key={option.name}
            disabled={!!guess}
            onClick={() => pick(option)}
            className={guess && option === answer ? 'right' : option === guess ? 'wrong' : undefined}
          >
            {option.name.replace(/-/g, ' ')}
          </button>
        ))}
      </div>
      <div className='whos-that-footer'>
        <span className='streak'>Streak <b>{streak}</b></span>
        {guess && (
          <>
            <Link to={`/pokemon/${idOf(answer)}`}>Open entry</Link>
            <button onClick={next}>Next</button>
          </>
        )}
      </div>
    </div>
  );
}

export default WhosThatPokemon;
