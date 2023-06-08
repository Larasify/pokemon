import type { GetServerSideProps } from "next";
import { prisma } from "../server/utils/prisma";
import { AsyncReturnType } from "../utils/ts-bs";
import Image from "next/image";
import Head from "next/head";

const getPokemonInOrder = async () => {
  return await prisma.pokemon.findMany({
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      smashCount: true,
      passCount: true,
    },
  });
};

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>;

const PokemonListing: React.FC<{ pokemon: PokemonQueryResult[number] }> = ({
  pokemon,
}) => {
  return (
    <div className="flex border-b p-2 items-center justify-between">
      <div className="flex items-center">
        <Image src={pokemon.spriteUrl} width={64} height={64} alt="" />
        <div className="capitalize">{pokemon.name}</div>
      </div>
      <div className="pr-3">{`Smash: ${pokemon.smashCount} Pass: ${pokemon.passCount}`}</div>
    </div>
  );
};

const SmashResultsPage: React.FC<{ pokemon: PokemonQueryResult }> = (props) => {
  return (
    <div className="flex flex-col items-center">
      <Head>
        <title>Cutest Pokemon Results</title>
      </Head>
      <h2 className="text-2xl p-4">Results</h2>
      <div className="flex flex-col w-full max-w-2xl border">
        {props.pokemon.map((currentPokemon, index) => {
          return <PokemonListing pokemon={currentPokemon} key={index} />;
        })}
      </div>
    </div>
  );
};

export default SmashResultsPage;

export const getStaticProps: GetServerSideProps = async () => {
  const pokemonOrdered = await getPokemonInOrder();
  const ONE_HOUR = 60 * 60 * 1;
  return { props: { pokemon: pokemonOrdered }, revalidate: ONE_HOUR };
};
