import Head from "next/head";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="h-screen w-screen flex flex-col justify-between"> 
      <div className="h-full w-full flex flex-col items-center relative">
        <Head>
          <title>About</title>
        </Head>
        <div className="text-2xl pt-4 text-center">About</div>
        <div className="flex justify-between items-center max-w-2xl flex-col md:flex-row animate-fade-in">
          <div className="p-8">
            {`This website was created by following Theo's tutorial to learn more about React/Next/Tailwind. Go check him out at `}
            <a href="https://t3.gg/" className="text-blue-200 underline">
              t3.gg
            </a>
            <div className="p-4"></div>
            <ul className="text-center">
              <li>
                <a
                  href="https://github.com/Larasify"
                  className="text-blue-200 underline"
                >
                  {" "}
                  My Github
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="w-full text-center text-xl pb-4">
        <a href="https://github.com/Larasify/pokemon">Github</a>
        <span className="p-4">{"-"}</span>
        <Link href="/results">Results</Link>
        <span className="p-4">{"-"}</span>
        <Link href="/">Home</Link>
      </div>
    </div>
  );
}
