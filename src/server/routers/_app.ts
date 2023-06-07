import { z } from 'zod';
import { procedure, router } from '../trpc';
import { PokemonClient } from 'pokenode-ts';

export const appRouter = router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
    
    getpokemonbyid: procedure.input(z.object({id: z.number()})).query(async ({input}) => {
      const api = new PokemonClient();
      const pokemonid = input.id;
      const pokemon =  await api.getPokemonById(pokemonid);
      return {name: pokemon.name, sprite: pokemon.sprites.front_default};
    }),

});

// export type definition of API
export type AppRouter = typeof appRouter;