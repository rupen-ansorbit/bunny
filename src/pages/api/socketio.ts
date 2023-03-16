import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/socket';
import { Server } from 'socket.io';
import {
  UserPayloadData,
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} from '@/utils/User';

export const config = {
  api: {
    bodyParser: false,
  },
};

type User = {
  error?: string;
  user?: UserPayloadData;
};

export default function Handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (res.socket.server.io) {
    console.log('Already set up');
    res.end();
    return;
  }

  const io = new Server(res.socket.server as any);
  res.socket.server.io = io;

  io.on('connection', async (socket) => {
    console.log('A User Connected');

    // when disconnect
    socket.on('disconnect', () => {
      console.log('A User Disconnect ---------------');

      const user = removeUser(socket.id);

      if (user) {
        io.to(user.room).emit('message', {
          user: 'admin',
          text: `${user.name} has left`,
        });
      }
    });

    socket.on('join', ({ name, room }, callback) => {
      const { error, user }: User = addUser({
        id: socket.id,
        name,
        room,
      });

      if (error) return callback(error);

      if (user) {
        socket.emit('message', {
          user: 'admin',
          text: `${user.name}, Welcome to room ${user.room}`,
        });

        socket.broadcast
          .to(user.room)
          .emit('message', { user: 'admin', text: `${user.name} has joined` });

        socket.join(user.room);

        io.to(user.room).emit('room', {
          room: user.room,
          users: getUsersInRoom(user.room),
        });

        callback();
      }
    });

    socket.on('sendMessage', (message, callback) => {
      const user: UserPayloadData = getUser(socket.id);

      io.to(user.room).emit('message', {
        user: user.name,
        text: message,
      });

      io.to(user.room).emit('room', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });

      callback();
    });
  });

  console.log('Setting up socket');
  res.end();
}
