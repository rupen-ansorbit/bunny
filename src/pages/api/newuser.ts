import { NextApiResponseServerIO } from '@/types/socket';
import type { NextApiRequest } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  try {
    if (req.method === 'POST' && res.socket.server.io) {
      res.socket.server.io.emit('add user', req.body);
      return res.status(200).json(req.body);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
}
