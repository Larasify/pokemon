import { prisma } from "../src/server/utils/prisma";
import { PokemonClient } from "pokenode-ts";

const doBackFill = async () => {
  const pokeApi = new PokemonClient();
  const allPokemon = await pokeApi.listPokemons(0, 151);
  const formattedPokemon = allPokemon.results.map((p, index) => ({
    id: index + 1,
    name: (p as { name: string }).name,
    spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index+1}.png`,
  }));
  const creation = await prisma.pokemon.createMany({
    data: formattedPokemon,
  });
};
doBackFill();
