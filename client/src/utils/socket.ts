import { io } from 'socket.io-client';

const URL = 'ws://bunnychatserver.vercel.app';

export const socket = io(URL as string);
