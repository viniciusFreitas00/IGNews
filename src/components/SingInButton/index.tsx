import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { signIn, useSession, signOut } from 'next-auth/react';

import styles from './styles.module.scss';

export function SingInButton() {
  const session = useSession();

  return session.status == 'authenticated' ? (
    <button
      type="button"
      className={styles.singInButton}
      onClick={() => signOut()}
    >
      <FaGithub color="#04d361" />
      {session.data.user.name}
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button
      type="button"
      className={styles.singInButton}
      onClick={() => signIn('github')}
    >
      <FaGithub color="#eda417" />
      Sing in with Github
    </button>
  );
}
