import { io } from 'socket.io-client';

const URL =
  process.env.NODE_ENV === 'production'
    ? 'http://bunnychatserver.vercel.app'
    : 'http://localhost:8000';

export const socket = io(URL as string);
