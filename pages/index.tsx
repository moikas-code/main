import React, {useEffect, useState} from 'react';
//@ts-ignore
import SEO from '../src/components/SEO';
// @ts-ignore
import NFTMARKETCARD from '../src/components/NFTMarketCard';

const {DateTime} = require('luxon');

import ANIM_Ellipsis from '../src/components/ANIM-Ellipsis';
import H from '../src/components/H';
import DABU from '../dabu';
import Web3 from 'web3';
var BN: any = Web3.utils.hexToNumberString;
export async function getStaticProps(context: any, dabu: any) {
  // console.log('getServerSideProps', dabu, context);
  async function runTime(callback: () => any) {
    const scriptStart = DateTime.local();
    const res = await callback();
    const scriptEnd = DateTime.local();
    const scriptDuration = scriptEnd.toSeconds() - scriptStart.toSeconds();

    console.log(`Script took ${scriptDuration} seconds to run.`);
    return {scriptDuration, res};
  }
  const getLatestListed = async () => {
    // INIT Dabu
    var dabu = new DABU();
    //Get Active Listings
    const active_listings: any = await dabu.get_latest_nft_listing();
    //Filter and Sort Active Listings

    const nft = active_listings;

    const _tokenId = BN(nft.tokenId._hex);
    return {
      ...nft,
      id: nft.id,
      tokenId: _tokenId,
      contractAddress: nft.assetContractAddress,
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

export default function Dragon({latestListing}: any) {
  const {
    id,
    tokenId,
    currencySymbol,
    asset,
    buyOutPrice,
    currencyContractAddress,
    decimals,
    network,
  } = JSON.parse(latestListing);

  return (
    <>
      <style jsx global>
        {`
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
      <div className='wrapper d-flex flex-row justify-content-center align-items-center position-relative'>
        <div className='d-flex flex-column flex-lg-row justify-content-lg-around  text-start px-0 px-sm-5'>
          <div className='d-flex flex-column my-5 mx-2 text-center justify-content-center'>
            <H headerSize='2' className='display-1 mb-2'>
              Welcome to<br/> The Lookout!
            </H>
            <H headerSize='4'>Closed Alpha</H>

            <p>Building on Ethereum & Polygon</p>
          </div>
          <div className='s1 d-flex flex-column justify-content-start justify-content-lg-center px-3 px-sm-0 col col-lg-5'>
            <H headerSize='4' className='border-bottom border-dark mb-3'>
              Latest Listed
            </H>

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
          </div>
        </div>
      </div>
    </>
  );
}
