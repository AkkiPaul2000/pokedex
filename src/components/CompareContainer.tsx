import React from 'react'
import { generatedPokemonType, pokemonStatType, pokemonTypeInterface, userPokemonType } from '../utils/Types'
import { FaPlus } from 'react-icons/fa'

function CompareContainer({pokemon=undefined,isEmpty=false}:{pokemon?:generatedPokemonType,isEmpty?:boolean}) {
  const createStatsArray=(types:pokemonTypeInterface[],statType:pokemonStatType)=>{
    const statArray:{name:string,value:string}[]=[];

    const statSet=new Set<string>();
    types.forEach((type:pokemonTypeInterface)=>{
      const key=Object.keys(type)[0];

    })
  }
  const getStats=()=>{
    const data=createStatsArray(pokemon?.types!,"strength")
    return<></>
  }
  return (
    <div className='compare-container'>
      {isEmpty && (
        <div className='empty'>
          <button><FaPlus/></button>
          <h3>Add to Compare</h3>
        </div>
      )}
      {pokemon&&(
        <div className="compare-element" key={pokemon?.id}>
          <div className="compare-info">
            <div className="compare-details">
              <h3>{pokemon?.name}</h3>
              <img
                src={pokemon?.image}
                alt="pokemon"
                className="compare-image"
              />
            </div>
            <div className="pokemon-types-container">
              <div className="pokemon-types">
                <h4 className="pokemon-type-title">Type</h4>
                <div className="pokemon-type-icons">
                  {pokemon?.types.map((type: pokemonTypeInterface) => {
                    const keys = Object.keys(type);
                    return (
                      <div className="pokemon-type">
                        <img
                          src={type[keys[0]].image}
                          alt="pokemon type"
                          className="pokemon-type-image"
                          loading="lazy"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              {getStats()}
            </div>
          </div>
          <div className="compare-action-buttons">
            <button
              className="compare-btn"
              
            >
              Add
            </button>
            <button
              className="compare-btn"
            >
              View
            </button>
            <button
              className="compare-btn"
            >
              Remove
            </button>
          </div>
        </div>
      )}
      </div>
  )
}

export default CompareContainer