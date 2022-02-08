import { NextApiRequest, NextApiResponse } from 'next';

export default function webhooks(req: NextApiRequest, res: NextApiResponse) {
  console.log('Evento recebido do Stripe');
  res.status(200).json({ ok: true });

}