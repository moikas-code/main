import React, {Fragment, useEffect, useState} from 'react';
//@ts-ignore
import SEO from '../src/components/SEO';
// @ts-ignore
import NFTCARD from '../src/ui/NFTCard';

const {DateTime} = require('luxon');

import ANIM_Ellipsis from '../src/components/ANIM-Ellipsis';
import H from '../src/components/common/H';
import DABU from '../dabu';
import {runTime} from '../dabu/helpers';
import Web3 from 'web3';
var BN: any = Web3.utils.hexToNumberString;
export async function getStaticProps(context: any, dabu: any) {
  const getLatestListed = async () => {
    // INIT Dabu
    var dabu = new DABU();
    //Get Active Listings
    const active_listings: any = await dabu.get_latest_nft_listing();
    //Filter and Sort Active Listings

    const nft = active_listings;

    const _tokenId = BN(nft.tokenId._hex);
    const _quantity = BN(nft.quantity._hex);
    const _price = BN(nft.buyoutPrice._hex);
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
      sellerAddress: nft.sellerAddress,
      asset: {
        ...nft.asset,
        id: BN(nft.asset.id._hex),
      },
    };
  };
  const {scriptDuration: duration, res: latestListing} = await runTime(
    getLatestListed
  );
  return {
    props: {
      latestListing: JSON.stringify(latestListing),
      scriptDuration: duration,
    },
    // - At most once every 10 seconds
    revalidate: 15, // In seconds
  };
}

export default function Dragon({latestListing}: any):JSX.Element {
  const {
    id,
    tokenId,
    currencySymbol,
    asset,
    buyOutPrice,
    currencyContractAddress,
    decimals,
    network,
    sellerAddress,
    quantity,
  } = JSON.parse(latestListing);

  return (
    <>
      <style jsx global>
        {`
          .h-lg-fnt {
            font-size: 3.5rem;
          }
          .strokeme {
            color: #000;
            text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff,
              1px 1px 0 #fff;
          }
          .wrapper {
            height: 100%;
            width: 100%;
            margin: 0 auto;
          }
          .wrapper > div {
            height: 100%;
            width: 100%;
            padding-top: 1rem;
          }
          // Medium devices (tablets, 768px and up)
          @media (min-width: 768px) {
          }

          // Large devices (desktops, 992px and up)
          @media (min-width: 992px) {
          }

          // X-Large devices (large desktops, 1200px and up)
          @media (min-width: 1200px) {
          }

          // XX-Large devices (larger desktops, 1400px and up)
          @media (min-width: 1400px) {
          }
        `}
      </style>

      <SEO
        title={`Home | Moka's Lookout`}
        description="Moika's Lookout is a WEB3 Community."
        twitter='moikaslookout'
        keywords='gaming, nfts, web3'
      />
      <div className='wrapper d-flex flex-column flex-lg-row justify-content-lg-center align-items-center position-relative'>
        <div
          className='d-flex flex-column flex-md-row justify-content-start 
        justify-content-md-around align-items-center align-items-md-start text-start mt-3 px-0 px-sm-3'>
          <div className='d-flex flex-column mx-2 justify-content-start justify-content-md-center order-1 order-md-0 col'>
            <div className='d-flex flex-column mx-auto'>
              <H headerSize='2' className='mb-2 text-wrap mx-auto'>
                Lets make Web3 {'&'} NFTs Fun!
              </H>
              <p className=''>Closed Alpha</p>

              <p className=''>Building on Ethereum {'&'} Polygon</p>
            </div>
          </div>
          <div className='d-flex flex-column justify-content-center align-items-center mt-lg-0 px-3 p-sm-0 order-0 order-md-1 col'>
            <NFTCARD
              tradeId={id}
              tokenId={tokenId}
              currencySymbol={currencySymbol}
              name={asset?.name}
              description={asset?.description}
              image={asset?.image}
              buyOutPrice={buyOutPrice}
              currencyContractAddress={currencyContractAddress}
              decimals={decimals}
              network={network}
              seller_address={sellerAddress}
              quantity={quantity}
            />
          </div>
        </div>
      </div>
    </>
  );
}
