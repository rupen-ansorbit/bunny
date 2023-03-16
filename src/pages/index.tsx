import Area from '@/components/Area/Area';
// import Header from '@/components/Header/Header';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Bunny messages</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="h-screen w-screen flex flex-col">
        {/* <Header /> */}
        <Area />
      </div>
    </>
  );
}
