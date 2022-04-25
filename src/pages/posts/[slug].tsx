import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { createClient } from '../../services/prismic';

export default function Post() {
  return <h1>JDHJHJHJHJHJHJHJHJHJHJH</h1>;
}

// export const getServerSideProps: GetServerSideProps = async ({
//   req,
//   params,
// }) => {
//   const session = await getSession({ req });
//   const { slug } = params;

//   const prismicClient = createClient();

//   const response = await prismicClient.getAllByUIDs('publication-type', slug);

//   console.log(response);

//   return {
//     props: {},
//   };
// };
