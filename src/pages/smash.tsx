import { NextPage } from "next";

import { trpc } from "../utils/trpc";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

const btn =
  "inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

const SmashPage: NextPage = () => {
  const {
    data: pokemon,
    isLoading,
    refetch,
  } = trpc.getonepokemon.useQuery(undefined, {
    refetchInterval: 0,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const voteMutation = trpc.castsmashpassvote.useMutation();

  const voteForRoundest = (option: boolean) => {
    if (!pokemon) return;

    if(option){
        voteMutation.mutate({
            pokemonid: pokemon.id,
            smashpass: true,
        })
    }
    else{
        voteMutation.mutate({
            pokemonid: pokemon.id,
            smashpass: false,
        })
    }

    refetch();
  };

  const dataLoaded = !!pokemon;
  const fetchingNext = voteMutation.isLoading || isLoading;

  return (
    //center the div
    <div className="h-screen w-screen flex flex-col justify-between items-center relative">
      <Head>
        <title>Smash or Pass</title>
      </Head>
      <div className="text-2xl pt-8 text-center">Smash or pass?</div>
      {dataLoaded && (
        <>
          <div className="p-8 flex justify-between items-center max-w-2xl flex-col md:flex-row animate-fade-in">
            <PokemonListing
              pokemon={pokemon}
              voteSmash={() =>
                voteForRoundest(true)
              }
              votePass={() =>
                voteForRoundest(false)
              }
              disabled={fetchingNext}
            />
            <div className="p-2"></div>
          </div>
        </>
      )}
      {!dataLoaded && <img src="/rings.svg" className="w-48" />}
      <div className="w-full text-center text-xl pb-4">
        <Link href="/smashresult">Results</Link>
      </div>
    </div>
  );
};

export default SmashPage;

interface Pokemon {
  id: number;
  name: string;
  spriteUrl: string;
  // Add other properties as needed
}

const PokemonListing: React.FC<{
  pokemon: Pokemon;
  voteSmash: () => void;
  votePass: () => void;
  disabled: boolean;
}> = (props) => {
  return (
    <div
      className={`flex flex-col items-center transition-opacity ${
        props.disabled && "opacity-0"
      }`}
      key={props.pokemon.id}
    >
      <div className="text-center p-2 text-xl capitalize mt-[-2rem]">
        {props.pokemon.name}
      </div>
      <Image
        src={props.pokemon.spriteUrl!}
        alt=""
        width={256}
        height={256}
        className="animate-fade-in"
      />
      <div className="flex">
        <button
          className={btn}
          onClick={() => props.voteSmash()}
          disabled={props.disabled}
        >
          Smash
        </button>
        <div className="p-2" />
        <button
          className={btn}
          onClick={() => props.votePass()}
          disabled={props.disabled}
        >
          Pass
        </button>
      </div>
    </div>
  );
};
