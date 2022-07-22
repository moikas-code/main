import TAKO from '../../tako';
const {DateTime} = require('luxon');
//@ts-ignore
import TEKRAM from 'tekram/index';
import Web3 from 'web3';
var BN: any = Web3.utils.hexToNumberString;
// function hex2a(hex) {
//   var str = '';
//   for (var i = 0; i < hex.length; i += 2)
//     str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
//   return str;
// }
export default {
  Query: {
    Query_Market_Sell_Orders: async (
      parent: object,
      args: any,
      _context: any,
      info: object
    ) => {
      // console.log(args.input);
      let _continuations: string[] = [];
      let arr: any[] = [];
      const contract = new TEKRAM('POLYGON');
      const active_listings = await contract.get_active_nft_listings();

      console.log('contract', active_listings);

      for (const nft of active_listings) {
        const _tokenId = nft.tokenId._hex;
        // console.log('_tokenId', _tokenId);
        const _quantity = BN(nft.quantity._hex);
        // console.log('_supply', _supply);
        const _price = BN(nft.buyoutPrice._hex);
        // console.log('_price', _price);

        const _startTimeInSeconds = BN(nft.startTimeInSeconds._hex);
        // console.log('_startTimeInSeconds', _startTimeInSeconds);
        const _secondsUntilEnd = BN(nft.secondsUntilEnd._hex);

        // console.log('_secondsUntilEnd', _secondsUntilEnd);
        let now = Date.now();
        console.log('now', now + parseInt(_secondsUntilEnd));
        const obj = {
          ...nft,
          id: nft.id,
          tokenId: _tokenId,
          quantity: _quantity,
          contractAddress: nft.assetContractAddress,
          buyOutPrice: _price.substr(0, _price.length - 18),
          currencySymbol: nft.buyoutCurrencyValuePerToken.symbol,
          
          decimals: nft.buyoutCurrencyValuePerToken.decimals,
          sellerAddress: nft.sellerAddress,
          startTime: DateTime.fromMillis(
            now - parseInt(_startTimeInSeconds)
          ).toLocaleString(DateTime.DATETIME_SHORT),
          endTime: DateTime.fromMillis(
            now + parseInt(_secondsUntilEnd)
          ).toLocaleString(DateTime.DATETIME_SHORT),
          asset: {
            ...nft.asset,
            id: BN(nft.asset.id._hex),
          },
        };
        console.log('obj', obj);
        arr.push(obj);
      }

      // console.log('nfts', {
      //   nfts: arr,
      // });
      return {
        nfts: arr,
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
      const data = res.nfts.map(async (__nft) => {
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
        //  console.log(isListed);
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

        return await nft;
      });
      console.log([...(await data)]);
      return {
        continuation: res.continuation,
        nfts: data,
      };
    },
  },
};
