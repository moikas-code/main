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
  // const res = await getLatestListed();
  const {scriptDuration: duration, res: latestListing} = await runTime(
    getLatestListed
  );
  // console.log('latestListing', latestListing, duration);
  return {
    props: {
      latestListing: JSON.stringify(latestListing),
      scriptDuration: duration,
    }, // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 15, // In seconds
  };
}

export default function Dragon({connected, dabu, latestListing, scriptDuration}: any) {
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
  // const {
  //  latest_nft: {
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
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (connected) {
      console.log('connected');
    }
    setLoading(false);
  }, []);
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
      {/* {scriptDuration} */}
      {true ? (
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
