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

  return (
    //center the div
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which pokemon is cuter?</div>
      <div className="p-2"></div>
      <div className="border rounded p-8 flex justify-between items-center max-w-2xl">
        {!FirstPokemon.isLoading &&
          !SecondPokemon.isLoading &&
          FirstPokemon.data &&
          SecondPokemon.data && (
            <>
              <PokemonListing
                pokemon={FirstPokemon.data}
                vote={() => voteForRoundest(first)}
              />
              <div className="p-8">Vs</div>
              <PokemonListing
                pokemon={SecondPokemon.data}
                vote={() => voteForRoundest(second)}
              />
            </>
          )}
      </div>
    </div>
  );
}

interface Pokemon {
  name: string;
  sprite: string | null;
  // Add other properties as needed
}

const PokemonListing: React.FC<{ pokemon: Pokemon; vote: () => void }> = (
  props
) => {
  return (
    <div className="flex flex-col items-center">
      <img src={props.pokemon.sprite!} className="w-64 h-64" alt="" />
      <div className="text-center p-2 text-xl capitalize mt-[-2rem]">
        {props.pokemon.name}
      </div>
      <button className={btn} onClick={() => props.vote()}>
        Cuter
      </button>
    </div>
  );
};
