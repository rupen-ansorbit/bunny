import React, { useContext, useEffect, useRef, useState } from 'react';
import SendOutline from '@/assets/send.png';
import Image from 'next/image';
import {
  IMsg,
  SocketContext,
  SocketContextType,
} from '@/context/SocketProvider';
import { getUsersInRoom } from '@/utils/User';

export default function Area() {
  const [message, setMessage] = useState<string>('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { socket, connected, user, messages, activeUsers } = useContext(
    SocketContext
  ) as SocketContextType;

  const sendMessage = async () => {
    if (message && connected) {
      socket.current.emit('sendMessage', message, () => setMessage(''));
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  useEffect(() => {
    inputRef?.current?.focus();
  }, [inputRef]);

  return (
    <main className="flex flex-1">
      <div className="sm:mx-auto mx-1 max-w-7xl py-6 sm:px-6 lg:px-8 flex flex-col justify-between flex-1">
        <div className="flex flex-col gap-1">
          {messages.length ? (
            messages.map((messages, index) => (
              <div key={index} className="flex gap-3 items-center">
                <div
                  className={`${
                    messages.user === user ? 'text-gray-800' : 'text-green-600'
                  } text-sm w-20 text-ellipsis overflow-hidden text-right`}
                  data-te-toggle="tooltip"
                  data-te-placement="top"
                  data-te-ripple-init
                  data-te-ripple-color="light"
                  title={messages.user === user ? 'Me' : messages.user}
                >
                  {messages.user === user ? 'Me' : messages.user}
                </div>
                :<pre className="text-sm flex-1">{messages.text}</pre>
              </div>
            ))
          ) : (
            <div>No messages</div>
          )}
        </div>
        <div className="flex items-center justify-between gap-5 sticky bottom-[1.5rem] left-0 right-0 bg-white py-1">
          <textarea
            ref={inputRef}
            name="message"
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[40px] max-h-[40px] flex-1 p-2 rounded outline-none bg-slate-200 text-sm"
            placeholder="Enter Here!"
            onKeyDown={handleKeyDown}
            value={message}
          />
          <Image
            onClick={sendMessage}
            src={SendOutline}
            alt="send picture"
            width={25}
            height={25}
            className="cursor-pointer"
          />
        </div>
      </div>
    </main>
  );
}
