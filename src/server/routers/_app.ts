import { z } from "zod";
import { procedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { prisma } from "../utils/prisma";
import { getOptionsForVote } from "@/src/utils/getRandomPokemonHelper";


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
      const pokemonid = input.id;
      if (pokemonid < 1 || pokemonid > 898) return null;
      const pokemon = await prisma.pokemon.findUnique({where:{id: pokemonid}});
      if (!pokemon) throw new TRPCError({ code: "NOT_FOUND", message: "Pokemon not found" });
      return pokemon;
    }),

    getpokemonpair: procedure.query(async () => {
      const [first, second] = getOptionsForVote();
      const firstPokemon = await prisma.pokemon.findUnique({where:{id: first}});
      const secondPokemon = await prisma.pokemon.findUnique({where:{id: second}});
      if (!firstPokemon || !secondPokemon) throw new TRPCError({ code: "NOT_FOUND", message: "Pokemon not found" });
      return {firstPokemon, secondPokemon};
    }),

  castvote: procedure.input(z.object({votedFor:z.number(), votedAgainst:z.number()})).mutation(async ({input}) => {
    const voteInDb = await prisma.vote.create({
      data:{
        votedForId: input.votedFor,
        votedAgainstId: input.votedAgainst
      }
    })
    return {success: true, vote: voteInDb};
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
