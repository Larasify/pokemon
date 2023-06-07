import { z } from "zod";
import { procedure, router } from "../trpc";
import { PokemonClient } from "pokenode-ts";
import { TRPCError } from "@trpc/server";
import { prisma } from "../utils/prisma";


export const appRouter = router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),

  getpokemonbyid: procedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const api = new PokemonClient();
      const pokemonid = input.id;
      if (pokemonid < 1 || pokemonid > 898) return null;
      const pokemon = await api.getPokemonById(pokemonid);
      return { name: pokemon.name, sprite: pokemon.sprites.front_default };
    }),

  castvote: procedure.input(z.object({votedFor:z.number(), votedAgainst:z.number()})).mutation(async ({input}) => {
    const voteInDb = await prisma.vote.create({
      data:{
        votedFor: input.votedFor,
        votedAgainst: input.votedAgainst
      }
    })
    return {success: true, vote: voteInDb};
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
