import { EthereumAuthProvider, SelfID, WebClient } from '@self.id/web';
import { ThirdwebSDK, ChainId, NATIVE_TOKENS } from '@takolabs/sdk';
import { useSigner, useAddress } from '@thirdweb-dev/react';
import abi from './abi.js';
import Web3 from 'web3';
var BN = Web3.utils.hexToNumberString;
/**
 *
 * There are two types of listings in marketplaces.
 * Direct Listings:
 * Sellers list their NFT for direct sale with the price users can buy it for.
 * The NFT remains in your wallet, but you provide permission for the marketplace contract to move the
 * NFT. If a user pays the asking price, the NFT will be transferred to them, and the seller will receive the funds. Users
 * can make offers below the asking price, and the listing can have multiple offers. The seller can choose to accept an
 * offer at any time. Users can cancel their bids at any time.
 *
 * Auction Listings
 * Sellers list their NFT for auction with a minimum asking price.
 * The NFT is transferred to escrow in the marketplace contract until the auction is canceled or finished.
 * Other users can place bids until the auction is closed.
 * Users can only make a bid if it is higher than the current highest bid (or asking price if there are no bids). Once
 * made, bids cannot be withdrawn, and the auction contract holds the funds in escrow.
 * At the end of the auction, no more bids can be placed.
 * At the end of the auction, the closeAuction function needs to be called twice; once for the buyer and once for the
 * seller.
 */

async function handleID(sig, address) {
  return await SelfID.authenticate({
    authProvider: new EthereumAuthProvider(sig, address),
    ceramic: 'testnet-clay',
    connectNetwork: 'testnet-clay',
  }).then(async (res) => {
    return res;
  });
}

class DABU {
  constructor(environment) {
    ///
    const SSR = typeof window === 'undefined';
    this.environment = environment;
    if (environment === 'production') {
      this.eth_market = '0x61f46e5835434DC2990492336dF84C3Fbd1ac468';
      this.polygon_market = '0x342a4aBEc68E1cdD917D6f33fBF9665a39B14ded';
      this.native_eth = NATIVE_TOKENS[ChainId['Mainnet']].wrapped.address;
      this.native_polygon = NATIVE_TOKENS[ChainId['Polygon']].wrapped.address;
      this.ethSDK_ReadOnly = new ThirdwebSDK('ethereum', {});
      this.polygonSDK_ReadOnly = new ThirdwebSDK('polygon', {});
    } else {
      this.eth_market = '0x823925BA556501E040dCbC1d01C84837c41C499C';
      this.polygon_market = '0xe493E7066bB74eE33A6826cf0A564233B7F67f48';
      this.native_eth = NATIVE_TOKENS[ChainId['Goerli']].wrapped.address;
      this.native_polygon = NATIVE_TOKENS[ChainId['Mumbai']].wrapped.address;
      this.ethSDK_ReadOnly = new ThirdwebSDK('goerli', {});
      this.polygonSDK_ReadOnly = new ThirdwebSDK('mumbai', {});
    }

    if (SSR) {
      // console.log('SSR');
      this.dabu_eth = this.ethSDK_ReadOnly.getMarketplace(this.eth_market);
      this.dabu_polygon = this.polygonSDK_ReadOnly.getMarketplace(
        this.polygon_market
      );
    } else {
      const sig = useSigner();
      if (sig) {
        // const addr = useAddress();
        this.ethSDK = ThirdwebSDK.fromSigner(sig, 'ethereum');
        this.polygonSDK = ThirdwebSDK.fromSigner(sig, 'polygon');
        this.dabu_eth = this.ethSDK.getMarketplace(this.eth_market);
        this.dabu_polygon = this.polygonSDK.getMarketplace(this.polygon_market);

        // A SelfID instance can only be created with an authenticated Ceramic instance
        // const data = (async()=>await handleID(
        //   window.ethereum,
        //   window.ethereum.selectedAddress
        // ).then( ({ client, did, id }) => {
        //   // console.log('is', client, did, id);
        //   this.self = new SelfID({ client });
        //   this.did = id;
        //   return  {
        //     client,
        //     did,
        //     id,
        //   };
        // }))();
        // console.log('qwert',data);
        // this.self = new SelfID({ id })a;
      } else {
        this.dabu_eth = this.ethSDK_ReadOnly.getMarketplace(this.eth_market);
        this.dabu_polygon = this.polygonSDK_ReadOnly.getMarketplace(
          this.polygon_market
        );
      }
    }
  }
  // TODO RM - this is not used anymore
  async init() {}

  // Query
  async get_nft_listing({ listingId, network }) {
    try {
      if (typeof network !== 'string')
        throw new Error('network is not a string');
      // Valid network
      const _network = network.toLowerCase();
      switch (_network) {
        case 'ethereum':
        case 'goerli':
          return {
            ...(await this.dabu_eth.getListing(listingId)),
            network,
          };
        case 'polygon':
        case 'mumbai':
          return {
            ...(await this.dabu_polygon.getListing(listingId)),
            network,
          };
        default:
          return 'Invalid Network';
      }
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }

  async get_active_auction_listings() {
    try {
      const _listings = await Promise.all([
        this.dabu_eth.getActiveListings(),
        this.dabu_polygon.getActiveListings(),
      ]);
      // console.log('_listings', _listings);
      return [
        ..._listings[0]
          .filter((nft) => nft.type === 1)
          .map((listing) => {
            return { ...listing, network: 'ethereum' };
          }),
        ..._listings[1]
          .filter((nft) => nft.type === 1)
          .map((listing) => {
            return { ...listing, network: 'polygon' };
          }),
      ];
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }

  async get_active_nft_listings() {
    try {
      const _listings = await Promise.all([
        this.dabu_eth.getActiveListings(),
        this.dabu_polygon.getActiveListings(),
      ]);
      return [
        ..._listings[0]
          .filter((nft) => nft.type === 0)
          .map((listing) => {
            return { ...listing, network: 'ethereum' };
          }),
        ..._listings[1]
          .filter((nft) => nft.type === 0)
          .map((listing) => {
            return { ...listing, network: 'polygon' };
          }),
      ];
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }

  async get_latest_nft_listing() {
    try {
      const _listings = await Promise.all([
        this.dabu_eth.getActiveListings(),
        this.dabu_polygon.getActiveListings(),
      ]);
      console.log('_listings', _listings);
      if (_listings.flat().length > 0) {
        const listings = [
          ..._listings[0]
            .filter((nft) => nft.type === 0)
            .map((listing) => {
              return { ...listing, network: 'ethereum' };
            }),
          ..._listings[1]
            .filter((nft) => nft.type === 0)
            .map((listing) => {
              return { ...listing, network: 'polygon' };
            }),
        ];
        return listings.slice(listings.length - 1, listings.length)[0];
      } else {
        return null;
      }
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }

  async get_all_nft_listings() {
    try {
      const _listings = await Promise.all([
        this.dabu_eth.getAllListings(),
        this.dabu_polygon.getAllListings(),
      ]);
      return [
        ..._listings[0].map((listing) => {
          return { ...listing, network: 'ethereum' };
        }),
        ..._listings[1].map((listing) => {
          return { ...listing, network: 'polygon' };
        }),
      ];
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }

  async get_winning_bid({ listingId }) {
    try {
      return await this.dabu.auction.getWinningBid(listingId);
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }

  async get_auction_winner({ listingId }) {
    try {
      return await this.dabu.auction.getWinner(listingId);
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }

  // Mutation
  async buy_nft({
    listingId,
    quantity,
    address,
    isGasless,
    price,
    currencyContractAddress,
    decimals,
    network,
  }) {
    try {
      if (isGasless) {
        if (
          typeof window !== 'undefined' &&
          typeof window.ethereum !== 'undefined'
        ) {
          if (typeof currencyContractAddress === 'undefined') {
            console.log('currencyContractAddress is required');
          }
          if (typeof price === 'undefined') {
            console.log('price is required');
          }
          const Contract = new window.web3.eth.Contract(
            abi,
            this.contract_address
          );

          return Contract.methods
            .buy(
              listingId,
              address,
              quantity,
              currencyContractAddress,
              `${price * quantity * 10 ** decimals}`
            )
            .estimateGas({
              from: address,
              value: `${price * quantity * 10 ** decimals}`,
            })
            .then((gasAmount) => {
              console.log('Gas Spent', gasAmount);
              Contract.methods
                .buy(
                  listingId,
                  address,
                  quantity,
                  currencyContractAddress,
                  `${price * quantity * 10 ** decimals}`
                )
                .send({
                  from: '0x877728846bFB8332B03ac0769B87262146D777f3',
                  value: `${price * quantity * 10 ** decimals}`,
                  gas: String(Math.floor(gasAmount * 1.25, 10)),
                })
                .on('transactionHash', function (hash) {
                  console.log('transactionHash', hash);
                })
                .catch(function (error) {
                  if (
                    error.message.includes('User denied transaction signature')
                  ) {
                    console.log('User denied transaction signature');
                  }
                  if (error.message.includes('err: insufficient funds')) {
                    console.log('Insufficient Funds');
                  }
                });
            })
            .catch((err) => {
              console.log(err);
              return err;
            });
        }
      }
      switch (network) {
        case 'ethereum':
          return await this.dabu_eth.buyoutListing(listingId, quantity);
        case 'polygon':
          return await this.dabu_polygon.buyoutListing(listingId, quantity);
        default:
          break;
      }
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }

  async create_bid({ listingId, price, network }) {
    try {
      switch (network) {
        case 'ethereum':
          return await this.dabu_eth.auction.makeBid(listingId, price);
        case 'polygon':
          return await this.dabu_polygon.auction.makeBid(listingId, price);
        default:
          break;
      }
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }

  async place_offer({ listingId, price, quantity }) {
    try {
      switch (network) {
        case 'ethereum':
          return await this.dabu_eth.direct.makeOffer(
            listingId,
            quantity,
            this.currency,
            price
          );
        case 'polygon':
          return await this.dabu_polygon.direct.makeOffer(
            listingId,
            quantity,
            this.currency,
            price
          );
        default:
          break;
      }
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }

  // async createBidOrOffer() {
  //   try {
  //     // Ensure user is on the correct network
  //     if (networkMismatch) {
  //       switchNetwork && switchNetwork(ChainId.Mumbai);
  //       return;
  //     }

  //     // If the listing type is a direct listing, then we can create an offer.
  //     if (listing?.type === ListingType.Direct) {
  //       await marketplace?.direct.makeOffer(
  //         listingId, // The listingId of the listing we want to make an offer for
  //         1, // Quantity = 1
  //         NATIVE_TOKENS[ChainId.Polygon].wrapped.address, // Wrapped Ether address on Rinkeby
  //         bidAmount // The offer amount the user entered
  //       );
  //     }

  //     // If the listing type is an auction listing, then we can create a bid.
  //     if (listing?.type === ListingType.Auction) {
  //       await marketplace?.auction.makeBid(listingId, bidAmount);
  //     }

  //     alert(
  //       `${
  //         listing?.type === ListingType.Auction ? 'Bid' : 'Offer'
  //       } created successfully!`
  //     );
  //   } catch (error) {
  //     console.error(error.message || 'something went wrong');
  //     alert(error.message || 'something went wrong');
  //   }
  // }

  async accept_offer({ listingId, offeror }) {
    try {
      switch (network) {
        case 'ethereum':
          return await this.dabu_eth.direct.acceptOffer(listingId, offeror);
        case 'polygon':
          return await this.dabu_polygon.direct.acceptOffer(listingId, offeror);
        default:
          break;
      }
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }

  async create_direct_listing({
    // address of the NFT contract the asset you want to list is on
    assetContractAddress,
    // token ID of the asset you want to list
    tokenId,
    // when should the listing open up for offers
    startTimestamp, // new Date(),
    // how long the listing will be open for
    listingDurationInSeconds, // 86400,
    // how many of the asset you want to list
    quantity,
    // address of the currency contract that will be used to pay for the listing
    currencyContractAddress,
    // how much the asset will be sold for
    buyoutPricePerToken,
    network,
  }) {
    try {
      // Data of the listing you want to create
      console.log(network, {
        // address of the NFT contract the asset you want to list is on
        assetContractAddress,
        // token ID of the asset you want to list
        tokenId,
        // when should the listing open up for offers
        startTimestamp, // new Date(),
        // how long the listing will be open for
        listingDurationInSeconds, // 86400,
        // how many of the asset you want to list
        quantity,
        // address of the currency contract that will be used to pay for the listing
        currencyContractAddress,
        // how much the asset will be sold for
        buyoutPricePerToken,
        network,
      });
      var tx;
      if (network === 'ethereum') {
        tx = await this.dabu_eth.direct
          .createListing({
            // address of the NFT contract the asset you want to list is on
            assetContractAddress,
            // token ID of the asset you want to list
            tokenId,
            // when should the listing open up for offers
            startTimestamp, // new Date(),
            // how long the listing will be open for
            listingDurationInSeconds, // 86400,
            // how many of the asset you want to list
            quantity,
            // address of the currency contract that will be used to pay for the listing
            currencyContractAddress: this.native_eth,
            // how much the asset will be sold for
            buyoutPricePerToken,
          })
          .catch((err) => {
            console.log(err);
            return err;
          });
      }
      if (network === 'polygon') {
        tx = await this.dabu_polygon.direct
          .createListing({
            // address of the NFT contract the asset you want to list is on
            assetContractAddress,
            // token ID of the asset you want to list
            tokenId,
            // when should the listing open up for offers
            startTimestamp, // new Date(),
            // how long the listing will be open for
            listingDurationInSeconds, // 86400,
            // how many of the asset you want to list
            quantity,
            // address of the currency contract that will be used to pay for the listing
            currencyContractAddress: this.native_polygon,
            // how much the asset will be sold for
            buyoutPricePerToken,
          })
          .catch((err) => {
            console.log(err);
            return err;
          });
      }
      console.log(tx);
      const receipt = tx.receipt; // the transaction receipt
      const listingId = tx.id; // the id of the newly created listing
      return {
        listingId,
        receipt,
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }

  async create_auction_listing({
    // address of the NFT contract the asset you want to list is on
    assetContractAddress,
    // token ID of the asset you want to list
    tokenId,
    // when should the listing open up for offers
    startTimestamp, // new Date(),
    // how long the listing will be open for
    listingDurationInSeconds, // 86400,
    // how many of the asset you want to list
    quantity,
    // address of the currency contract that will be used to pay for the listing
    currencyContractAddress,
    // how much the asset will be sold for
    buyoutPricePerToken, //"1",
    // the minimum bid that will be accepted for the token
    reservePricePerToken, // "1.5",
  }) {
    try {
      // Data of the listing you want to create

      const tx = await contract.auction.createListing({
        assetContractAddress,
        tokenId,
        startTimestamp,
        listingDurationInSeconds,
        quantity,
        currencyContractAddress: this.currency,
        buyoutPricePerToken,
        reservePricePerToken,
      });
      const receipt = tx.receipt; // the transaction receipt
      const listingId = tx.id; // the id of the newly created listing
      return {
        listingId,
        receipt,
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }

  async cancel_direct_listing({ listingId }) {
    try {
      return await this.dabu.direct.cancelListing(listingId);
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }

  async cancel_auction_listing({ listingId }) {
    try {
      return await this.dabu.auction.cancelListing(listingId);
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }

  async close_auction_listing({ listingId }) {
    try {
      return await this.dabu.auction.closeListing(listingId);
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }
}
export default DABU;

// const api = new dabu('POLYGON');
// 0x6413a23a178a613d2397d06de4c709d4d34f833b;
// 61272768999388303298622668415914301902677718023234933913362993706889759424516;
// api
//   .create_nft_listing({
//     // address of the NFT contract the asset you want to list is on
//     assetContractAddress: '0x6413a23a178a613d2397d06de4c709d4d34f833b',
//     // token ID of the asset you want to list
//     tokenId:
//       '61272768999388303298622668415914301902677718023234933913362993706889759424516',
//     // when should the listing open up for offers
//     startTimestamp: new Date(),
//     // how long the listing will be open for
//     listingDurationInSeconds: 86400,
//     // how many of the asset you want to list
//     quantity: 1,
//     // address of the currency contract that will be used to pay for the listing
//     currencyContractAddress: this.currency,
//     // how much the asset will be sold for
//     buyoutPricePerToken: '100',
//   })
//   .then(console.log);
