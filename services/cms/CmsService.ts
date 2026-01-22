import gql from 'graphql-tag';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';

export default class CmsService {
  client: ApolloClient<any>;

  constructor() {
    const config = useRuntimeConfig();
    this.client = new ApolloClient({
      link: new HttpLink({
        uri: `${config.public.strapiUrl}/graphql`,
      }),
      cache: new InMemoryCache(),
    });
  }
}
