import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { connect } from 'socket.io-client';

export interface IMsg {
  user: string;
  msg: string;
}

export interface IActiveUser {
  name: string;
  id: string;
}

export type SocketContextType = {
  connected: boolean;
  setConnected: Dispatch<SetStateAction<boolean>>;
  user: string;
  chat: IMsg[];
  socket: any;
  activeUsers: IActiveUser[];
};

export const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: any) => {
  const [connected, setConnected] = useState<boolean>(false);
  const [user, setUser] = useState<string>('');
  const [chat, setChat] = useState<IMsg[]>([]);
  const [activeUsers, setActiveUsers] = useState<IActiveUser[]>([]);
  const socket = useRef<any>(null);

  useEffect(() => {
    socket.current = connect(
      process.env.NODE_ENV !== 'development'
        ? (process.env.NEXT_PUBLIC_PRODUCTION_URL as string)
        : (process.env.NEXT_PUBLIC_BASE_URL as string),
      {
        path: '/api/socketio',
      }
    );

    socket.current.on('connect', () => {
      const name = prompt('Enter your name:');
      const userName = name ? name : 'User_' + socket.current.id;
      setUser(userName);
      setConnected(true);

      const newUser: IActiveUser = {
        name: userName,
        id: socket.current.id,
      };

      try {
        fetch('/api/newuser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        });
      } catch (error) {
        console.log(error);
      }
    });

    socket.current.on('add user', (newuser: IActiveUser) => {
      setActiveUsers((prev) => [...prev, newuser]);
    });

    socket.current.on('message', (msg: IMsg) => {
      setChat((prev) => [...prev, msg]);
    });

    if (socket.current) return () => socket.current.disconnect();
  }, []);

  return (
    <SocketContext.Provider
      value={{ activeUsers, connected, setConnected, user, chat, socket }}
    >
      {children}
    </SocketContext.Provider>
  );
};
