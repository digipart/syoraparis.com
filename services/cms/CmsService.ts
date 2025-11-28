import gql from 'graphql-tag';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';

export default class CmsService {
  client = new ApolloClient({
    link: new HttpLink({ uri: 'https://cms.unicodeparis.com/graphql' }),
    cache: new InMemoryCache(),
  });
}
