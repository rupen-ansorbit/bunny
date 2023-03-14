import { SocketContext, SocketContextType } from '@/context/SocketProvider';
import React, { useContext } from 'react';

export default function Notification() {
  const { activeUsers } = useContext(SocketContext) as SocketContextType;

  return (
    <div className="bg-green-300 text-green-800 p-3 text-xs flex gap-1 items-center">
      <div>Conncted Users :</div>
      <div>
        {activeUsers.map((user) => (
          <p key={user.id}>{user.name}</p>
        ))}
      </div>
    </div>
  );
}
