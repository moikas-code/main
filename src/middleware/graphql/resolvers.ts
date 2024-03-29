import TAKO from '../../tako';
const {DateTime} = require('luxon');
//@ts-ignore
import DABU from '../../../dabu/index';
import Web3 from 'web3';
var BN: any = Web3.utils.hexToNumberString;

export default {
  Query: {
    Query_Latest_Market_Sell_Order: async (
      parent: object,
      args: any,
      _context: any,
      info: object
    ) => {
      // INIT Dabu
      var dabu = new DABU();
      //
      dabu.init();
      //Get Active Listings
      const active_listings: any = await dabu.get_active_nft_listings();
      //Filter and Sort Active Listings
      const nft = active_listings
        .filter((item: any) => {
          return item.asset.name !== 'Failed to load NFT metadata';
        })
        .sort((a: any, b: any) => {
          return b.id - a.id;
        })[0];

      const _tokenId = BN(nft.tokenId._hex);
      // console.log('_tokenId', _tokenId);
      const _quantity = BN(nft.quantity._hex);
      // console.log('_supply', _supply);
      const _price = BN(nft.buyoutPrice._hex);
      // console.log('_price', _price);

      const _startTimeInSeconds = BN(nft.startTimeInSeconds._hex);
      // console.log('_startTimeInSeconds', _startTimeInSeconds);
      const _secondsUntilEnd = BN(nft.secondsUntilEnd._hex);

      let now = Date.now();
      return {
        ...nft,
        id: nft.id,
        tokenId: _tokenId,
        quantity: _quantity,
        contractAddress: nft.assetContractAddress,
        buyOutPrice: _price.substr(
          0,
          _price.length - nft.buyoutCurrencyValuePerToken.decimals
        ),
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
    },
    Query_Market_Sell_Orders: async (
      parent: object,
      args: any,
      _context: any,
      info: object
    ) => {
      let arr: any[] = [];
      var dabu = new DABU();
      dabu.init();
      const active_listings: any = await dabu.get_active_nft_listings();
      // console.log(active_listings);
      for (const nft of active_listings.filter((item: any) => {
        return item.asset.name !== 'Failed to load NFT metadata';
      })) {
        const _tokenId = BN(nft.tokenId._hex);
        // console.log('_tokenId', _tokenId);
        const _quantity = BN(nft.quantity._hex);
        // console.log('_supply', _supply);
        const _price = BN(nft.buyoutPrice._hex);
        // console.log('_price', _price);

        const _startTimeInSeconds = BN(nft.startTimeInSeconds._hex);
        // console.log('_startTimeInSeconds', _startTimeInSeconds);
        const _secondsUntilEnd = BN(nft.secondsUntilEnd._hex);

        let now = Date.now();
        // console.log('assets',nft.asset);
        arr.push({
          ...nft,
          id: nft.id,
          tokenId: _tokenId,
          quantity: _quantity,
          network: nft.network,
          contractAddress: nft.assetContractAddress,
          buyOutPrice: _price.substr(
            0,
            _price.length - nft.buyoutCurrencyValuePerToken.decimals
          ),
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
        });
      }

      return {
        nfts: arr,
      };
    },
    Query_Market_Sell_Order: async (
      parent: object,
      args: any,
      _context: any,
      info: object
    ) => {
      let arr: any[] = [];
      var dabu = new DABU();
      dabu.init();
      const nft: any = await dabu.get_nft_listing({
        listingId: args.input.listingId,
        network: args.input.network,
      });
      // console.log(active_listings);
      // for (const nft of [_listing].filter((item: any) => {
      //   return item.asset.name !== 'Failed to load NFT metadata';
      // })) {
      const _tokenId = BN(nft.tokenId._hex);
      // console.log('_tokenId', _tokenId);
      const _quantity = BN(nft.quantity._hex);
      // console.log('_supply', _supply);
      const _price = BN(nft.buyoutPrice._hex);
      // console.log('_price', _price);

      const _startTimeInSeconds = BN(nft.startTimeInSeconds._hex);
      // console.log('_startTimeInSeconds', _startTimeInSeconds);
      const _secondsUntilEnd = BN(nft.secondsUntilEnd._hex);

      let now = Date.now();
      // console.log('assets',nft.asset);
      // arr.push();
      // }

      return {
        ...nft,
        id: nft.id,
        tokenId: _tokenId,
        quantity: _quantity,
        network: nft.network,
        contractAddress: nft.assetContractAddress,
        buyOutPrice: _price.substr(
          0,
          _price.length - nft.buyoutCurrencyValuePerToken.decimals
        ),
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
    },
    Query_Address_NFTS: async (
      parent: object,
      args: any,
      _context: any,
      info: object
    ) => {
      // INIT DABU
      var dabu = new DABU();

      // Get Owned NFTs
      const res: any = await TAKO.get_items_by_owner(
        args.input.address,
        args.input.blockchains,
        args.input.continuation
      );

      // Get Listed NFTs
      const active_listings_as_raible_id: any = await dabu
        .get_active_nft_listings()
        .then((res: any) => {
          return res.map((nft: any) => {
            const _tokenId = BN(nft.tokenId._hex);
            return `${nft.network.toUpperCase()}:${nft.assetContractAddress.toLowerCase()}:${_tokenId}`;
          });
        });
      // seperate listed and unlisted nfts

      var listed: any[] = [];
      var unlisted: any[] = [];
      if (Array.isArray(res.nfts)) {
        for (var nft of res.nfts) {
          // filter out lazy loaded nfts
          if (nft.lazySupply === '0') {
            if (active_listings_as_raible_id.includes(nft.id)) {
              listed.push(nft);
            }
            if (!listed.includes(nft)) {
              unlisted.push(nft);
            }
          }
        }
      }

      return {
        continuation: res.continuation,
        unlisted,
        listed,
      };
    },
  },
};
