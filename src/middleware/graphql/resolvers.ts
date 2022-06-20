import TAKO from '../../tako';
export default {
  Query: {
    Query_Market_Sell_Orders: async (
      parent: object,
      args: any,
      _context: any,
      info: object
    ) => {
      const {
        blockchains = [],
        continuation,
        cursor,
        origins,
        size,
      }: {
        blockchains: string[];
        continuation: string;
        cursor: string;
        origins: [string];
        size: number;
      } = args.input;
      // console.log(args.input);
      let _continuations: string[] = [];
      let _orders: any[] = [];
      for (let i = 0; i < origins.length; i++) {
        // origins[i] = origins[i].toLowerCase();
        // console.log(origins[i])
        const res = await TAKO.getSellOrdersWithNFT({
          blockchains,
          continuation,
          cursor,
          size,
          origin: origins[i],
        });
        _continuations.push(res.continuation);
        _orders.push(...res.nfts);
      }

      console.log({
        continuations: _continuations,
        nfts: _orders,
      })
      return {
        continuations: _continuations,
        nfts: _orders,
      };
    }
  },
};
