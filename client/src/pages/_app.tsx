import '../styles/global.css';
import type { AppProps } from 'next/app';
import { SocketProvider } from '@/context/SocketProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SocketProvider>
      <Component {...pageProps} />
    </SocketProvider>
  );
}
