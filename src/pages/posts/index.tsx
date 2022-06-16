import Head from 'next/head';
import { GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import Link from 'next/link';

import { createClient } from '../../services/prismic';
import styles from './style.module.scss';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
};

interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Post | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link href={`/posts/${post.slug}`}>
              <a key={post.slug}>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

type PostContent = {
  type: string;
  text: string;
  spans: {
    start: number;
    end: number;
    type: string;
  }[];
};

export const getStaticProps: GetStaticProps = async () => {
  const client = createClient();

  const response = await client.getByType('publication-type', {
    fetch: ['title', 'Content'],
  });

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt:
        post.data.Content.find(
          (content: PostContent) => content.type === 'paragraph',
        )?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        'pt-BR',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        },
      ),
    };
  });

  return {
    props: {
      posts,
    },
    revalidate: 60 * 60, // 1 hour
  };
};
