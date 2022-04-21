import { NextApiRequest, NextApiResponse } from 'next';
import { query as q, query } from 'faunadb';
import { getSession } from 'next-auth/react';
import { fauna } from '../../services/fauna';
import { stripe } from '../../services/stripe';

type FaunaUser = {
  ref: {
    id: string;
  };
  data: {
    stripe_custumer_id: string;
  };
};

export default async function subscribe(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const sessions = await getSession({ req });

    const faunaUser = await fauna.query<FaunaUser>(
      q.Get(q.Match(q.Index('user_by_email'), q.Casefold(sessions.user.email))),
    );

    let stripeCustumerId = faunaUser.data.stripe_custumer_id;

    if (!stripeCustumerId) {
      const stripeCustumer = await stripe.customers.create({
        email: sessions.user.email,
        // metadata
      });

      await fauna.query(
        q.Update(q.Ref(q.Collection('users'), faunaUser.ref.id), {
          data: {
            stripe_custumer_id: stripeCustumer.id,
          },
        }),
      );

      stripeCustumerId = stripeCustumer.id;
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustumerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [{ price: 'price_1KoUTkGnzvhXg1XMx1s7Ap0K', quantity: 1 }],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    return res.status(200).json({ sessionId: stripeCheckoutSession.id });
  }
  res.setHeader('Allow', 'POST');
  res.status(405).end('Method not allowed');
}
