import { io } from 'socket.io-client';

const URL =
  process.env.NODE_ENV === 'production'
    ? 'https://bunnychatserver.vercel.app'
    : 'http://localhost:8000';

export const socket = io(URL as string);
