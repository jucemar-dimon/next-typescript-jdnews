import { NextApiRequest, NextApiResponse } from 'next';

const users = (request: NextApiRequest, response: NextApiResponse) => {
  const users = [
    { id: 1, nome: 'Jucemar' },
    { id: 2, nome: 'Juliano' },
    { id: 3, nome: 'Claudio' },
    { id: 4, nome: 'Fenando' },
    { id: 5, nome: 'Maria' },
  ];

  return response.json(users);
}

export default users;