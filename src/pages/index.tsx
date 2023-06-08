import { useEffect, useState } from "react";
import { getOptionsForVote } from "../utils/getRandomPokemonHelper";
import { trpc } from "../utils/trpc";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

const btn =
  "inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

export default function Home() {
  /*const [[first, second], setOptions] = useState([0, 0]);

  useEffect(() => {
    const [firstId, seconId] = getOptionsForVote();
    setOptions([firstId, seconId]);
  }, []);*/
  const {data: pokemonPair, isLoading, refetch} =trpc.getpokemonpair.useQuery(undefined, {refetchInterval: 0, refetchOnReconnect: false, refetchOnMount: false, refetchOnWindowFocus: false});
  //refetch();

  const voteMutation = trpc.castvote.useMutation();

  const voteForRoundest = (selected: number) => {
    //trpc.voteForRoundestPokemon.mutation({ id: selected });
    if (!pokemonPair) return;
    if (selected === pokemonPair.firstPokemon.id) {
      voteMutation.mutate({ votedFor: pokemonPair?.firstPokemon.id, votedAgainst: pokemonPair?.secondPokemon.id });
    } else {
      voteMutation.mutate({ votedFor: pokemonPair.secondPokemon.id, votedAgainst: pokemonPair.firstPokemon.id });
    }
    //console.log(selected);
    //const [firstId, seconId] = getOptionsForVote();
    //setOptions([firstId, seconId]);
    refetch();
  };

  const dataLoaded = !!pokemonPair;
  const fetchingNext = voteMutation.isLoading || isLoading;

  //if(!dataLoaded)  return <div>a</div>
  //const [FirstPokemon, SecondPokemon] = data;
  //const [first, second] = [FirstPokemon.id, SecondPokemon.id];


  /*
  const FirstPokemon = trpc.getpokemonbyid.useQuery(
    { id: first },
    { staleTime: Infinity }
  );
  const SecondPokemon = trpc.getpokemonbyid.useQuery(
    { id: second },
    { staleTime: Infinity }
  );*/
  //const isLoading = !FirstPokemon.isLoading && !SecondPokemon.isLoading;

  return (
    //center the div
    <div className="h-screen w-screen flex flex-col justify-between items-center relative">
      <Head>
        <title>Cutest Pokemon</title>
      </Head>
      <div className="text-2xl pt-8 text-center">Which pokemon is cuter?</div>
      {dataLoaded && (
        <>
          <div className="p-8 flex justify-between items-center max-w-2xl flex-col md:flex-row animate-fade-in">
            <PokemonListing
              pokemon={pokemonPair.firstPokemon}
              vote={() => voteForRoundest(pokemonPair.firstPokemon.id)}
              disabled={fetchingNext}
            />
            <div className="p-8">or</div>
            <PokemonListing
              pokemon={pokemonPair.secondPokemon}
              vote={() => voteForRoundest(pokemonPair.secondPokemon.id)}
              disabled={fetchingNext}
            />
            <div className="p-2"></div>
          </div>
        </>
      )}
      {!dataLoaded && (
        <img src="/rings.svg" className="w-48" />
      )}
      <div className="w-full text-center text-xl pb-4">
        <a href="https://github.com/Larasify/pokemon">Github</a>
        <span className="p-4">{"-"}</span>
        <Link href="/results">Results</Link>
        <span className="p-4">{"-"}</span>
        <Link href="/about">About</Link>
        <Link href="/smash">.</Link>
      </div>
    </div>
  );
}

interface Pokemon {
  id: number;
  name: string;
  spriteUrl: string;
  // Add other properties as needed
}

const PokemonListing: React.FC<{ pokemon: Pokemon; vote: () => void ; disabled:boolean}> = (
  props
) => {
  return (
    <div className={`flex flex-col items-center transition-opacity ${props.disabled && "opacity-0"}`} key={props.pokemon.id}>
      <div className="text-center p-2 text-xl capitalize mt-[-2rem]">
        {props.pokemon.name}
      </div>
      <Image src={props.pokemon.spriteUrl!} alt="" width={256} height={256} className="animate-fade-in" />
      <button className={btn} onClick={() => props.vote()} disabled={props.disabled}>
        Cuter
      </button>
    </div>
  );
};
