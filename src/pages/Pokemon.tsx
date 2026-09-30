// @ts-nocheck
import { useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Wrapper from "../sections/Wrapper";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setCurrentPokemon } from "../app/slices/PokemonSlice";
import { setPokemonTab, setToast } from "../app/slices/AppSlice";
import Loader from "../components/Loader";
import { pokemonRoute, pokemonTabs, regions } from "../utils/Constant";
import Description from "./PokemonPages/Description";
import Evolution from "./PokemonPages/Evolution";
import CapableMoves from "./PokemonPages/CapableMoves";
import Locations from "./PokemonPages/Locations";
import { defaultImages, images } from "../utils";

function Pokemon() {  
  const params = useParams();
  const dispatch = useAppDispatch();
  const currentPokemonTab = useAppSelector(
    ({ app: { currentPokemonTab } }) => currentPokemonTab
  );
  const currentPokemon = useAppSelector(
    ({ pokemon: { currentPokemon } }) => currentPokemon
  );

  useEffect(() => {
    dispatch(setPokemonTab(pokemonTabs.description));
  }, [dispatch]);

  const getRecursiveEvolution = useCallback(
    (evolutionChain, level, evolutionData) => {
      if (!evolutionChain.evolves_to.length) {
        return evolutionData.push({
          pokemon: {
            ...evolutionChain.species,
            url: evolutionChain.species.url.replace(
              "pokemon-species",
              "pokemon"
            ),
          },
          level,
        });
      }
      evolutionData.push({
        pokemon: {
          ...evolutionChain.species,
          url: evolutionChain.species.url.replace("pokemon-species", "pokemon"),
        },
        level,
      });
      return getRecursiveEvolution(
        evolutionChain.evolves_to[0],
        level + 1,
        evolutionData
      );
    },
    []
  );

  const getEvolutionData = useCallback(
    (evolutionChain) => {
      const evolutionData = [];
      getRecursiveEvolution(evolutionChain, 1, evolutionData);
      return evolutionData;
    },
    [getRecursiveEvolution]
  );

  const getPokemonInfo = useCallback(
    async (image, signal) => {
      const { data } = await axios.get(`${pokemonRoute}/${params.id}`, { signal });
      // species.url, not /pokemon-species/{id}: form ids (10001+) have no species of their own.
      const [{ data: dataEncounters }, { data: species }] = await Promise.all([
        axios.get(data.location_area_encounters, { signal }),
        axios.get(data.species.url, { signal }),
      ]);
      const { data: evolutionData } = await axios.get(species.evolution_chain.url, { signal });
      const pokemonAbilities = {
        abilities: data.abilities.map(({ ability }) => ability.name),
        moves: data.moves.map(({ move }) => move.name),
      };
      const evolution = getEvolutionData(evolutionData.chain);
      const english = ({ language }) => language.name === "en";
      const types = data.types.map(({ type: { name } }) => name);
      document.documentElement.dataset.type = types[0]; // drives --accent-color
      dispatch(
        setCurrentPokemon({
          id: data.id,
          name: data.name,
          types,
          image,
          stats: data.stats.map(({ stat, base_stat }) => ({ name: stat.name, value: base_stat })),
          encounters: dataEncounters.map((encounter) =>
            encounter.location_area.name.toUpperCase().split("-").join(" ")
          ),
          evolutionLevel: evolution.find(({ pokemon }) => pokemon.name === species.name)?.level,
          evolution,
          pokemonAbilities,
          height: data.height / 10,
          weight: data.weight / 10,
          genus: species.genera.find(english)?.genus,
          description: species.flavor_text_entries.find(english)?.flavor_text.replace(/\s+/g, " "),
          japaneseName: species.names.find(({ language }) => language.name === "ja-hrkt")?.name,
          region: regions[species.generation.name.split("-")[1]],
        })
      );
    },
    [params.id, dispatch, getEvolutionData]
  );

  useEffect(() => {
    // Abort on id change so a slow response for the previous Pokémon can't land last.
    const controller = new AbortController();
    getPokemonInfo(images[params.id] || defaultImages[params.id], controller.signal).catch((err) => {
      if (axios.isCancel(err)) return;
      console.error(err);
      dispatch(setToast("Couldn't load this Pokémon. Check your connection and try again."));
    });
    return () => controller.abort();
  }, [params.id, getPokemonInfo, dispatch]);

  // A revisit shows the stored entry at once (the refetch above refreshes it); App keeps the lid shut until then.
  return currentPokemon?.id === Number(params.id) ? (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentPokemonTab}
        className="tab"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.18 }}
      >
        {currentPokemonTab === pokemonTabs.description && <Description key={currentPokemon.id} />}
        {currentPokemonTab === pokemonTabs.evolution && <Evolution />}
        {currentPokemonTab === pokemonTabs.locations && <Locations/>}
        {currentPokemonTab === pokemonTabs.moves && <CapableMoves />}
      </motion.div>
    </AnimatePresence>
  ) : (
    <Loader />
  );
}

export default Wrapper(Pokemon);
