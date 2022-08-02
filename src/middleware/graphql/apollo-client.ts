// ./apollo-client.js
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  ApolloLink,
} from '@apollo/client';
///
let appJWTToken: any;
const httpLink = new HttpLink({
  uri:
    process.env.AKKORO_ENV !== 'prod'
      ? `http://localhost:3000/api/graphql`
      : 'https://moikaslookout.com/api/graphql',
});

var client = new ApolloClient({
  link: from([ httpLink]),
  cache: new InMemoryCache(),
});

export default client;
