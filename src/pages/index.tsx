import { useEffect, useState } from "react";
import { getOptionsForVote } from "../utils/getRandomPokemonHelper";
import { trpc } from "../utils/trpc";

const btn =
  "inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

export default function Home() {
  const [[first, second], setOptions] = useState([0, 0]);

  useEffect(() => {
    const [firstId, seconId] = getOptionsForVote();
    setOptions([firstId, seconId]);
  }, []);

  const voteForRoundest = (selected: number) => {
    //trpc.voteForRoundestPokemon.mutation({ id: selected });
    console.log(selected);
    const [firstId, seconId] = getOptionsForVote();
    setOptions([firstId, seconId]);
  };

  const FirstPokemon = trpc.getpokemonbyid.useQuery(
    { id: first },
    { staleTime: Infinity }
  );
  const SecondPokemon = trpc.getpokemonbyid.useQuery(
    { id: second },
    { staleTime: Infinity }
  );

  if (FirstPokemon.isLoading || SecondPokemon.isLoading) {
    return <div>Loading...</div>;
  }
  if (!FirstPokemon.data || !SecondPokemon.data) {
    return <div>Something went wrong</div>;
  }
  return (
    //center the div
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which pokemon is rounder?</div>
      <div className="p-2"></div>
      <div className="border rounded p-12 flex justify-between items-center max-w-2xl">
        <div className="w-64 h-64 flex flex-col items-center">
          <img src={FirstPokemon.data.sprite!} className="w-full" alt="" />
          <div className="text-center text-xl capitalize mt-[-2rem]">
            {FirstPokemon.data.name}
          </div>
          <button className={btn} onClick={() => voteForRoundest(first)}>
            Rounder
          </button>
        </div>
        <div className="p-8">Vs</div>
        <div className="w-64 h-64 flex flex-col items-center">
          <img src={SecondPokemon.data.sprite!} className="w-full" alt="" />
          <div className="text-center text-xl capitalize mt-[-2rem]">
            {SecondPokemon.data.name}
          </div>
          <button className={btn} onClick={() => voteForRoundest(second)}>
            Rounder
          </button>
        </div>
      </div>
    </div>
  );
}
