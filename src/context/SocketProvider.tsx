import { useRouter } from 'next/router';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import io from 'socket.io-client';

export interface IMsg {
  user: string;
  text: string;
}

export interface IActiveUser {
  name: string;
  id: string;
}

export interface MessagePayload {
  user: string;
  text: string;
}

export type SocketContextType = {
  connected: boolean;
  setConnected: Dispatch<SetStateAction<boolean>>;
  user: string;
  messages: IMsg[];
  socket: any;
  activeUsers: IActiveUser[];
};

export const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: any) => {
  const [connected, setConnected] = useState<boolean>(false);
  const [user, setUser] = useState<string>('');
  const [messages, setMessages] = useState<IMsg[]>([]);
  const [activeUsers, setActiveUsers] = useState<IActiveUser[]>([]);
  const socket = useRef<any>(null);
  const isSocketInitialize = useRef<boolean>(false);
  const router = useRouter();

  const socketInitialize = useCallback(async () => {
    isSocketInitialize.current = true;
    await fetch('/api/socketio');

    socket.current = io();

    socket.current.on('connect', () => {
      const userName = prompt('Enter your name:');
      const roomName =
        router.asPath === '/' ? 'General' : router.asPath.split('?')[1];

      if (roomName && userName) {
        setUser(userName);
        setConnected(true);

        socket.current.emit(
          'join',
          { name: userName, room: roomName },
          (error: string) => {
            if (error) {
              alert(error);
            }
          }
        );
      }
    });

    socket.current.on('message', (message: MessagePayload) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.current.on('room', ({ users }: any) => {
      setActiveUsers(users);
    });
  }, []);

  useEffect(() => {
    if (!isSocketInitialize.current) socketInitialize();

    if (socket.current) {
      return () => {
        socket.current.disconnect();
      };
    }
  }, [socketInitialize]);

  return (
    <SocketContext.Provider
      value={{ activeUsers, connected, setConnected, user, messages, socket }}
    >
      {children}
    </SocketContext.Provider>
  );
};
