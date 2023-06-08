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
      const pokemon = await prisma.pokemon.findUnique({
        where: { id: pokemonid },
      });
      if (!pokemon)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Pokemon not found",
        });
      return pokemon;
    }),

  getpokemonpair: procedure.query(async () => {
    const [first, second] = getOptionsForVote();
    //const firstPokemon = await prisma.pokemon.findUnique({where:{id: first}});
    //const secondPokemon = await prisma.pokemon.findUnique({where:{id: second}});
    const BothPokemon = await prisma.pokemon.findMany({
      where: { id: { in: [first, second] } },
    });
    const firstPokemon = BothPokemon.find((pokemon) => pokemon.id === first);
    const secondPokemon = BothPokemon.find((pokemon) => pokemon.id === second);
    if (!firstPokemon || !secondPokemon)
      throw new TRPCError({ code: "NOT_FOUND", message: "Pokemon not found" });
    return { firstPokemon, secondPokemon };
  }),

  castvote: procedure
    .input(z.object({ votedFor: z.number(), votedAgainst: z.number() }))
    .mutation(async ({ input }) => {
      const voteInDb = await prisma.vote.create({
        data: {
          votedForId: input.votedFor,
          votedAgainstId: input.votedAgainst,
        },
      });
      return { success: true, vote: voteInDb };
    }),

  //SMASH PASS API's
  getonepokemon: procedure.query(async () => {
    const [first, second] = getOptionsForVote();
    const pokemon = await prisma.pokemon.findUnique({ where: { id: first } });
    if (!pokemon)
      throw new TRPCError({ code: "NOT_FOUND", message: "Pokemon not found" });
    return pokemon;
  }),

  castsmashpassvote: procedure
    .input(z.object({ pokemonid: z.number(), smashpass: z.boolean() }))
    .mutation(async ({ input }) => {
      if (input.smashpass) {
        const result = await prisma.pokemon.update({
          where: {
            id: input.pokemonid,
          },
          data: {
            smashCount: {
              increment: 1,
            },
          },
        });
        return { success: true, vote: result };
      }
      else{
        const result = await prisma.pokemon.update({
          where: {
            id: input.pokemonid,
          },
          data: {
            passCount: {
              increment: 1,
            },
          },
        });
        return { success: true, vote: result };
      }
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
