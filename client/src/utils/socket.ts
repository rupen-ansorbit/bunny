import { io } from 'socket.io-client';

const URL = 'https://bunnychatserver.vercel.app';

export const socket = io(URL as string);
