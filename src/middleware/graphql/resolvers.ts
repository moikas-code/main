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

      // console.log({
      //   continuations: _continuations,
      //   nfts: _orders,
      // });
      return {
        continuations: _continuations,
        nfts: _orders,
      };
    },
    Query_Address_NFTS: async (
      parent: object,
      args: any,
      _context: any,
      info: object
    ) => {
      // console.log(args.input);
      const res: any = await TAKO.get_items_by_owner(args.input.address);

      let arr = [];
      for (let i = 0; i < res?.nfts.length; i++) {
        const orders = await TAKO.get_orders_by_nft_id(res?.nfts[i].id);
        // console.log('res>>',res);
        let nft = {
          ...(await res?.nfts[i]),
          orders: orders.length,
          meta: {
            ...(await res?.nfts[i].meta),
            content: await res?.nfts[i].meta?.content
              .map((c: any) => {
                // console.log('?', c['size']);
                if (
                  typeof c['size'] !== 'undefined' &&
                  c['size'] !== undefined
                ) {
                  return {
                    ...c,
                    type: c['@type'],
                  };
                }
              })
              .filter(
                (c: any) =>
                  c !== undefined && c !== null && typeof c !== 'undefined'
              ),
          },
        };
        console.log(nft.meta.content);
        typeof nft.collection !== 'undefined' &&
          nft.meta.name.length > 0 &&
          arr.push(nft);
      }
      // console.log(arr);
      return {
        ...res,
        nfts: arr,
      };
    },
  },
};
