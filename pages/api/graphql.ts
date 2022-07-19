// @ts-ignore
import typeDefs from '../../src/middleware/graphql/schema/index';

import {send} from 'micro';
// @ts-ignore
import resolvers from '../../src/middleware/graphql/resolvers';
// @ts-ignore
import {ApolloServer} from 'apollo-server-micro';
// import database from '../../middleware/database/';

// @ts-ignore
import {DocumentNode} from 'graphql';
// import {ApolloServer} from 'apollo-server-micro';
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} from 'apollo-server-core';
import {NextApiRequest, NextApiResponse} from 'next';
import {makeExecutableSchema} from '@graphql-tools/schema';

//@ts-ignore
let apolloServerHandler: any;

// const apolloServer = new ApolloServer({
//   typeDefs,
//   resolvers,
//   async context({req, res}) {
//     return {req, res};
//   },
// });


const handler = async ({
  _req,
  _res,
  typeDefs,
  resolvers,
  _context,
}: {
  _req: NextApiRequest;
  _res: NextApiResponse;
  typeDefs: DocumentNode;
  resolvers: any;
  _context: any;
}) => {
  // if (_req.method === 'OPTIONS') {
  //   _res.end();
  //   return;
  // }
  if (!apolloServerHandler) {
    console.log('handler');
    ///
    apolloServerHandler = new ApolloServer({
      schema: makeExecutableSchema({typeDefs, resolvers}),
      async context({req, res}: {req: any; res: any}) {
        return await _context({req, res});
      },
      plugins: [
        false
          ? ApolloServerPluginLandingPageDisabled()
          : ApolloServerPluginLandingPageGraphQLPlayground(),
      ],
      csrfPrevention: false,
    });
    ///

    await apolloServerHandler.start();
    ///
  }
  //
  return await apolloServerHandler.createHandler({path: '/api/graphql/'})(_req, _res);
};

export const config = {
  api: {
    bodyParser: false,
  },
};
export default async (req, res) => {
  // await apolloServer.start();
  // const handler = await apolloServer.createHandler({path: '/api/graphql/'});
  // req.method === 'OPTIONS'
  //   ? await send(res, 200, 'ok')
  //   : 
    
    await handler({
        _req: req,
        _res: res,
        typeDefs,
        resolvers,
        _context: async ({req, res}: {req: any; res: any}) => {
          console.log('Context...');
          return {req, res};
        },
      });
};

// // @ts-ignore
// import typeDefs from '../../src/middleware/graphql/schema/index';
// // @ts-ignore
// import resolvers from '../../src/middleware/graphql/resolvers';


// // export default ;
// export default async (req: any, res: any) => {
// return await handler({
//   _req: req,
//   _res: res,
//   typeDefs,
//   resolvers,
//   _context: async ({req, res}: {req: any; res: any}) => {
//     console.log('Context...');
//     return {req, res};
//   },
// });
// };
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
