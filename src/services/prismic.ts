import * as Prismic from '@prismicio/client';
import sm from '../../sm.json';

export const endpoint = sm.apiEndpoint;
export const repositoryName = Prismic.getRepositoryName(endpoint);

export function createClient() {
  const client = Prismic.createClient(endpoint, {
    accessToken: process.env.PRIMISC_ACESS_TOKEN,
  });

  return client;
}
