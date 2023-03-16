import { SocketContext, SocketContextType } from '@/context/SocketProvider';
import React, { useContext } from 'react';

export default function Notification() {
  const { activeUsers } = useContext(SocketContext) as SocketContextType;

  return (
    <div className="bg-green-300 text-green-800 p-3 text-xs flex gap-1 items-center">
      <div className="font-bold">Active Users :</div>
      <div className="flex gap-1 font-semibold">
        {activeUsers.map((user, index) => (
          <div key={index}>
            <span>{user.name}</span>
            {activeUsers.length - 1 !== index && <span>,</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
