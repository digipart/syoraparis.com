import gql from 'graphql-tag';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';

export default class CmsService {
  client = new ApolloClient({
    link: new HttpLink({
      uri: process.env.STRAPI_URL
        ? process.env.STRAPI_URL + '/graphql'
        : 'https://cms.unicodeparis.com/graphql',
    }),
    cache: new InMemoryCache(),
  });
}
