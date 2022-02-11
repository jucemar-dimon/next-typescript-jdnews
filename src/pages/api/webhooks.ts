import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import Stripe from 'stripe';
import { stripe } from '../../services/stripe';
import { saveSubscription } from './_lib/manageSubscription';

async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(
      typeof chunk === "string" ? Buffer.from(chunk) : chunk
    );
  }

  return Buffer.concat(chunks);

}

export const config = {
  api: {
    bodyParser: false
  }
}

const relevantEvents = new Set([
  'checkout.session.completed'
]);

export default async function webhooks(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'POST') {
    const buf = await buffer(req);
    const secret = req.headers['stripe-signature'];
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
      console.log('erro1');
      return res.status(400).send(`webhook error: ${error.message}`);
    }

    const { type } = event;

    if (relevantEvents.has(type)) {

      try {
        switch (type) {
          case 'checkout.session.completed':
            const checkoutSession = event.data.object as Stripe.Checkout.Session;
            console.log('checkoutSession', checkoutSession);
            await saveSubscription(
              checkoutSession.subscription.toString(),
              checkoutSession.customer.toString()
            );
            break;
          default:
            throw new Error('Unhandle event.');
        }
      } catch (err) {
        console.log('erro2');
        res.json({ error: 'webhook handler failed.' })


      }


      console.log('Evento recebido', event);

    }

    res.json({ Received: true });

  } else {
    console.log('erro3');

    res.setHeader('Allow', 'POST');
    res.status(405).end('Method no allowed');
  }


}