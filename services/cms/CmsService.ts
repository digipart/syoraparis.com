import gql from 'graphql-tag';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';

export default class CmsService {
  client = new ApolloClient({
    link: new HttpLink({ uri: process.env.STRAPI_URL || 'https://cms.syoraparis.com' }),
    cache: new InMemoryCache(),
  });
}
