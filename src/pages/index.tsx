import { useEffect, useState } from "react";
import { getOptionsForVote } from "../utils/getRandomPokemonHelper";
import { trpc } from "../utils/trpc";

export default function Home() {
  const [[first, second], setOptions] = useState([0, 0]);

  useEffect(() => {
    const [firstId, seconId] = getOptionsForVote();
    setOptions([firstId, seconId]);
  }, []);

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
      <div className="border rounded p-8 flex justify-between items-center max-w-2xl">
        <div className="w-64 h-64 flex flex-col">
          <img
            src={FirstPokemon.data.pokemon.sprites.front_default!}
            className="w-full"
            alt=""
          />
          <div className="text-center text-xl capitalize mt-[-2rem]">
            {FirstPokemon.data.pokemon.name}
          </div>
        </div>
        <div className="p-8">Vs</div>
        <div className="w-64 h-64 flex flex-col">
          <img
            src={SecondPokemon.data.pokemon.sprites.front_default!}
            className="w-full"
            alt=""
          />
          <div className="text-center text-xl capitalize mt-[-2rem]">
            {SecondPokemon.data.pokemon.name}
          </div>
        </div>
      </div>
    </div>
  );
}
