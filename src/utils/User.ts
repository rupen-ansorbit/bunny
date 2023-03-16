export interface UserPayloadData {
  id: string;
  name: string;
  room: string;
}

const users: UserPayloadData[] = [];

const addUser = ({ id, name, room }: UserPayloadData) => {
  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );

  if (existingUser) return { error: 'Username is taken' };
  const user = { id, name, room } as UserPayloadData;
  users.push(user);
  return { user };
};

const removeUser = (id: string) => {
  const index = users.findIndex((user) => {
    user.id === id;
  });

  console.log('index', index);

  if (index === -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id: string) => {
  return users.find((user) => user.id === id) as UserPayloadData;
};

const getUsersInRoom = (room: string) => {
  return users.filter((user) => user.room === room);
};

export { addUser, removeUser, getUser, getUsersInRoom };
