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
      // console.log(res);
      let arr = [];
      for await (let __nft of res.nfts) {
        const order_res = await TAKO.get_orders_by_nft_id(__nft.id);
        const isListed =
          order_res.orders
            .map((order) => {
              let accounts = order.data.originFees.map((fee) => {
                return fee.account;
                ('POLYGON:0x877728846bFB8332B03ac0769B87262146D777f3');
              });
              return [...accounts];
            })
            .flat()
            .map((acc) => {
              let originFees = [
                '0x877728846bFB8332B03ac0769B87262146D777f3'.toLowerCase(),
              ];
              // console.log(acc.split(':')[1]);
              return originFees.includes(acc.split(':')[1].toLowerCase())
                ? true
                : false;
            })
            .includes(true) &&
          order_res.orders
            .map((order) => {
              return (
                order.maker.split(':')[1] === args.input.address.split(':')[1]
              );
            })
            .includes(true);
        // console.log(
        //   'res>>',
        //   order_res.orders
        //     .map((order) => {
        //       let accounts = order.data.originFees.map((fee) => {
        //         return fee.account;
        //         ('POLYGON:0x877728846bFB8332B03ac0769B87262146D777f3');
        //       });
        //       return [...accounts];
        //     })
        //     .flat()
        //     .map((acc) => {
        //       let originFees=['0x877728846bFB8332B03ac0769B87262146D777f3'.toLowerCase()]
        //       console.log(acc.split(':')[1]);
        //       return originFees.includes(acc.split(':')[1].toLowerCase())

        //         ? true
        //         : false;
        //     }),
        //   //maker
        //   order_res.orders
        //     .map((order) => {
        //       return (
        //         order.maker.split(':')[1] === args.input.address.split(':')[1]
        //       );
        //     })
        //     .includes(true)
        // );
        // orders.map(async (order) => {
        //   console.log('order>>', await order);
        //   return order;
        // });
        let nft = {
          ...(await __nft),
          orders: order_res.orders.length,
          isListed: isListed,
          meta: {
            ...(await __nft.meta),
            content: await __nft.meta?.content
              .map((c: any) => {
                // console.log('?', c['size']);
                // if (
                //   typeof c['size'] !== 'undefined' &&
                //   c['size'] !== undefined
                // ) {
                // }
                return {
                  ...c,
                  type: c['@type'],
                };
              })
              .filter(
                (c: any) =>
                  c !== undefined && c !== null && typeof c !== 'undefined'
              ),
          },
        };
        // console.log(nft.meta.content);
        // typeof nft.collection !== 'undefined' &&
        //   nft.meta.name.length > 0 &&
          arr.push(nft);
      }
      console.log(arr);
      return {
        ...res,
        nfts: arr,
      };
    },
  },
};
