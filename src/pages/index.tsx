import { trpc } from "../utils/trpc";

export default function Home() {
  const {data, isLoading} = trpc.hello.useQuery({ text: "client" });
  if (isLoading) {
    return <div>Loading...</div>
  }
  return (
    //center the div
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which pokemon is rounder?</div>
      <div className="p-2"></div>
      <div className="border rounded p-8 flex justify-between items-center max-w-2xl">
        <div className="w-16 h-16 bg-red-400 text-center">First</div>
        <div className="p-8">Vs</div>
        <div className="w-16 h-16 bg-red-400">{data?.greeting}</div>
      </div>
    </div>
  );
}
