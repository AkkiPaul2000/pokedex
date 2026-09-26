import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheck, FaLock, FaPlus } from "react-icons/fa";
import { defaultImages, images, pokemonTypes } from "../utils";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addPokemonToList } from "../app/reducers/addPokemonToList";
import { setPokemonTab } from "../app/slices/AppSlice";
import { pokemonTabs } from "../utils/Constant";
import { currentPokemonType, pokemonElementType, pokemonStatType } from "../utils/Types";

const dexNumber = (id: number) => `#${String(id).padStart(3, "0")}`;
const press = { whileHover: { y: -2 }, whileTap: { scale: 0.95 } };

export default function PokeInfo({ data }: { data: currentPokemonType }) {
  const dispatch = useAppDispatch();
  const guest = useAppSelector(({ app }) => !app.userInfo);
  const inList = useAppSelector(({ pokemon }) => pokemon.userPokemons.some(({ id }) => id === data.id));
  const matchups = (statType: pokemonStatType) =>
    Array.from(new Set(data.types.flatMap((type) => pokemonTypes[type][statType])));
  const typeRows: [string, string[]][] = [
    ["Type", data.types],
    ["Strengths", matchups("strength")],
    ["Weakness", matchups("weakness")],
    ["Resistant", matchups("resistance")],
    ["Vulnerable", matchups("vulnerable")],
  ];
  const total = data.stats.reduce((sum, stat) => sum + Number(stat.value), 0);
  // Only link neighbours we have art for; the local sprite set doubles as the id range.
  const neighbours = [data.id - 1, data.id + 1].filter((id) => images[id] || defaultImages[id]);

  return (
    <>
      <div className="details">
        <span className="number">{dexNumber(data.id)}</span>
        <h1 className="name">{data.name}</h1>
        {data.genus && <h4 className="genus">{data.genus}</h4>}
        {data.description && <p className="description">{data.description}</p>}
        <ul className="facts">
          <li><span>Height</span>{data.height} m</li>
          <li><span>Weight</span>{data.weight} kg</li>
          {data.region && <li><span>Region</span>{data.region}</li>}
          {data.evolutionLevel && <li><span>Evolution</span>Stage {data.evolutionLevel}</li>}
        </ul>
        <div className="abilities">
          {data.pokemonAbilities.abilities.map((ability) => <span key={ability}>{ability}</span>)}
        </div>
        <motion.button {...press} onClick={() => dispatch(setPokemonTab(pokemonTabs.evolution))}>
          See evolution
        </motion.button>
      </div>
      <div className="battle-stats">
        {typeRows.map(([label, types]) => (
          <div className="type-row" key={label}>
            <h4>{label}</h4>
            <div className="type-icons">
              {types.map((type) => (
                <img key={type} src={pokemonTypes[type as pokemonElementType].image} alt={type} title={type} />
              ))}
            </div>
          </div>
        ))}
        <motion.button {...press} onClick={() => dispatch(addPokemonToList(data))}
          className={`add-pokemon${inList ? " done" : ""}`} title={guest ? "Log in to add to your list" : undefined}>
          {guest ? <FaLock /> : inList ? <FaCheck /> : <FaPlus />} {inList ? "In your list" : "Add Pokemon"}
        </motion.button>
      </div>
      <ul className="stats">
        <li className="stats-title"><span>Base stats</span><b>{total}</b></li>
        {data.stats.map((stat) => (
          <li key={stat.name} style={{ "--v": stat.value } as React.CSSProperties}>
            <span>{stat.name.replace("special-", "sp. ")}</span>
            <b>{stat.value}</b>
            <i />
          </li>
        ))}
      </ul>
      <div className="poke-nav">
        {neighbours.map((id) => (
          <Link key={id} to={`/pokemon/${id}`} className={id < data.id ? "prev" : "next"}>
            <img src={images[id] || defaultImages[id]} alt="" />
            {dexNumber(id)}
          </Link>
        ))}
      </div>
    </>
  );
}
