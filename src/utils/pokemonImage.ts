//@ts-nocheck
const fetchImages=(context:string):Record<string,string>=>{
    const images={};
    const cache={}
    function importAll(r){
        r.keys().forEach((key)=>(cache[key]=r(key)))
    } 
    importAll(context)
    Object.entries(cache).forEach((module:string[])=>{
        let key=module[0].split("")
        key.splice(0,2)
        key.splice(-4,4)
        images[[key.join("")]]=module[1]
    })
    return images;
}

export const images=fetchImages(
    require.context("../assets/pokemons/shiny",false,/\.(png|jpe?g|svg)$/)
);
export const defaultImages=fetchImages(
    require.context("../assets/pokemons/default",false,/\.(png|jpe?g|svg)$/)
);

// Local art for a dex id, shiny first as the cards show it; undefined when there is none.
export const spriteOf = (id: number | string): string | undefined => images[id] || defaultImages[id];
// Dex id of a PokeAPI list entry (".../pokemon/25/").
export const idOf = ({ url }: { url: string }): number => Number(url.split("/").slice(-2)[0]);
