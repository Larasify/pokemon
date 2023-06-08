import type { GetServerSideProps } from "next";
import { prisma } from "../server/utils/prisma";
import { AsyncReturnType } from "../utils/ts-bs";
import Image from "next/image";
import { get } from "http";
import Head from "next/head";

const getPokemonInOrder = async () => {
  return await prisma.pokemon.findMany({
    orderBy: {
      VoteFor: { _count: "desc" },
    },
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      _count: {
        select: { VoteFor: true, VoteAgainst: true },
      },
    },
  });
};

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>;

const generateCountPercent = (pokemon: PokemonQueryResult[number]) => {
  const totalVotes = pokemon._count.VoteFor + pokemon._count.VoteAgainst;
  if (totalVotes === 0) return 0;
  const percent = pokemon._count.VoteFor / totalVotes;
  return percent * 100;
};

const PokemonListing: React.FC<{ pokemon: PokemonQueryResult[number] }> = ({
  pokemon,
}) => {
  return (
    <div className="flex border-b p-2 items-center justify-between">
      <div className="flex items-center">
        <Image src={pokemon.spriteUrl} width={64} height={64} alt="" />
        <div className="capitalize">{pokemon.name}</div>
      </div>
      <div className="pr-3">{`${generateCountPercent(pokemon).toFixed(
        2
      )}%`}</div>
    </div>
  );
};

const ResultsPage: React.FC<{ pokemon: PokemonQueryResult }> = (props) => {
  return (
    <div className="flex flex-col items-center">
      <Head>
        <title>Cutest Pokemon Results</title>
      </Head>
      <h2 className="text-2xl p-4">Results</h2>
      <div className="flex flex-col w-full max-w-2xl border">
        {props.pokemon
          .sort((a, b) => generateCountPercent(b) - generateCountPercent(a))
          .map((currentPokemon, index) => {
            return <PokemonListing pokemon={currentPokemon} key={index} />;
          })}
      </div>
    </div>
  );
};

export default ResultsPage;

export const getStaticProps: GetServerSideProps = async () => {
  const pokemonOrdered = await getPokemonInOrder();
  const ONE_HOUR = 60 * 60 * 1;
  return { props: { pokemon: pokemonOrdered }, revalidate: ONE_HOUR };
};
