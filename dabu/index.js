import Web3 from 'web3';
import { ThirdwebSDK, ChainId, NATIVE_TOKENS } from '@thirdweb-dev/sdk';
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useMarketplace,
} from '@thirdweb-dev/react';
import abi from './abi.js';
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

class DABU {
  constructor(NETWORK = 'POLYGON', PROVIDER) {
    this.provider = PROVIDER;

    if (typeof window !== 'undefined' && typeof PROVIDER !== 'undefined') {
      this.Web3 = new Web3(this.provider);
    }
    this.sdk =
      typeof this.Web3 !== 'undefined'
        ? new ThirdwebSDK(NETWORK.toLowerCase(), this.Web3)
        : new ThirdwebSDK(NETWORK.toLowerCase());

    switch (NETWORK) {
      case 'ETHEREUM':
        this.contract_address = '0x61f46e5835434DC2990492336dF84C3Fbd1ac468';
        if (typeof window === 'undefined') {
          console.log('ETHEREUM');
          // this.Web3 = new Web3(this.provider);
          this.dabu = this.sdk.getMarketplace(this.contract_address);
        } else if (typeof window !== 'undefined') {
          this.dabu = useMarketplace(this.contract_address);
        }

        this.currency = NATIVE_TOKENS[ChainId['Mainnet']].wrapped.address;
        return;
      case 'POLYGON':
        this.contract_address = '0x342a4aBEc68E1cdD917D6f33fBF9665a39B14ded';
        if (typeof window === 'undefined') {
          // this.Web3 = new Web3(this.provider);
          this.dabu = this.sdk.getMarketplace(this.contract_address);
        } else if (typeof window !== 'undefined') {
          this.dabu = useMarketplace(this.contract_address);
        }
        this.currency = NATIVE_TOKENS[ChainId['Polygon']].wrapped.address;
        return;
    }
  }

  async getNetwork() {
    try {
      const id = await this.Web3.eth.net.getId();
      switch (id) {
        case 1:
          return 'ETHEREUM';
        case 137:
        default:
          return 'POLYGON';
      }
      return await id;
    } catch (error) {
      return error.message;
    }
  }
  // Query
  async get_nft_listing({ listingId }) {
    try {
      return await this.dabu.getListing(listingId);
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }

  async get_active_nft_listings() {
    try {
      return await this.dabu.getActiveListings().catch((error) => {
        return {
          error: error.message,
        };
      });
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }

  async get_all_nft_listings() {
    try {
      return await this.dabu.getAllListings();
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
  }) {
    try {
      if (!isGasless) {
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
      return await this.dabu.buyoutListing(listingId, quantity);
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }

  async create_bid({ listingId, price }) {
    try {
      return await this.dabu.auction.makeBid(listingId, price);
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }

  async place_offer({ listingId, price, quantity }) {
    try {
      return await this.dabu.direct.makeOffer(
        listingId,
        quantity,
        this.currency,
        price
      );
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }

  async accept_offer({ listingId, offeror }) {
    try {
      return await this.dabu.direct.acceptOffer(listingId, offeror);
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
  }) {
    try {
      // Data of the listing you want to create

      const tx = await this.dabu.direct
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
          currencyContractAddress: this.currency,
          // how much the asset will be sold for
          buyoutPricePerToken,
        })
        .catch((err) => {
          console.log(err);
          return err;
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
