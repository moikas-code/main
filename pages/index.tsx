import React, {useEffect, useState} from 'react';
//@ts-ignore
import SEO from '../src/components/SEO';
// @ts-ignore
import NFTMARKETCARD from '../src/components/NFTMarketCard';

const {DateTime} = require('luxon');
// import getLatestListin g from '../src/hooks/getLatestListing';
// import {GetServerSideProps} from 'next';
import client from '../src/middleware/graphql/apollo-client';
import {ApolloClient, gql, HttpLink, InMemoryCache} from '@apollo/client';
import ANIM_Ellipsis from '../src/components/ANIM-Ellipsis';
import H from '../src/components/H';
import DABU from '../dabu';
import Web3 from 'web3';
var BN: any = Web3.utils.hexToNumberString;
export async function getServerSideProps(context: any) {
 const getLatestListed=  async () => {
     // INIT Dabu
     var dabu = new DABU();
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
   };
  return {
    props: {
      latestListing: getLatestListed(),
    },
  };
}

export default function Dragon({connected, dabu}: any) {
  // const {
  //   latest_nft: {
  //     id,
  //     tokenId,
  //     currencySymbol,
  //     asset,
  //     buyOutPrice,
  //     currencyContractAddress,
  //     decimals,
  //     network,
  //   },
  //   loading,
  //   complete,
  // } = getLatestListing();
  return (
    <>
      <style jsx global>
        {`
          .neg-m-5rem {
            margin-top: -5rem;
          }

          .strokeme {
            color: #000;
            text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff,
              1px 1px 0 #fff;
          }
        `}
      </style>

      <SEO
        title={`Moka's Lookout | Home`}
        description="Moika's Lookout is a WEB3 Community."
        twitter='moikaslookout'
        keywords='gaming, nfts, web3'
      />
      {false ? (
        <div className='d-flex flex-row justify-content-center position-relative w-100 h-100 mt-5 mt-lg-0'>
          <div className='wrapper h-100 d-flex flex-column p-3'>
            <div className='s1 d-flex flex-column flex-lg-row justify-content-center align-items-center text-start mt-5'>
              <div className='d-flex flex-column m-5 text-center strokeme'>
                <H headerSize='2' className='display-1'>
                  Welcome to The Lookout!
                </H>
                <H headerSize='4'>Closed Alpha</H>

                <p>Building on Polygon</p>
              </div>
              <div className='col-md-5'>
                <H
                  headerSize='4'
                  className='border-bottom border-dark mb-3 strokeme'>
                  Latest Listed
                </H>
                <span className='nft-wrapper'>
                  <NFTMARKETCARD
                    id={id}
                    tokenId={tokenId}
                    currencySymbol={currencySymbol}
                    name={asset?.name}
                    description={asset?.description}
                    image={asset?.image}
                    buyOutPrice={buyOutPrice}
                    currencyContractAddress={currencyContractAddress}
                    decimals={decimals}
                    network={network}
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='d-flex flex-column justify-content-center align-items-center h-100'>
          <H headerSize='4'>
            Feeding the Birds
            <ANIM_Ellipsis />
          </H>
        </div>
      )}
    </>
  );
}
