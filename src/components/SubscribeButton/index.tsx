import { ExecException } from 'child_process';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Exception } from 'sass';
import Stripe from 'stripe';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscribeButton {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButton) {
  const { status, data } = useSession();
  const router = useRouter();

  async function handleSubscribe() {
    if (status !== 'authenticated') {
      signIn('github');
    }

    if (data?.activeSubscription) {
      router.push('/posts');
    }

    try {
      const response = await api.post('/subscribe');

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      await stripe?.redirectToCheckout({ sessionId });
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
