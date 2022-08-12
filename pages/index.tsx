import React, {useEffect, useState} from 'react';
//@ts-ignore
import SEO from '@/src/components/SEO';
// @ts-ignore
import NFTMARKETCARD from '@/src/components/NFTMarketCard';
import DABU from '../dabu';
import getLatestListing from '@/src/hooks/getLatestListing';
import {GetServerSideProps} from 'next';
import client from '../src/middleware/graphql/apollo-client';
import {ApolloClient, gql, HttpLink, InMemoryCache} from '@apollo/client';
import ANIM_Ellipsis from '@/src/components/ANIM-Ellipsis';
export default function Dragon({connected,dabu}: any) {
  const [blockchain, setBlockchain] = useState('POLYGON');

  const {
    latest_nft: {
      id,
      tokenId,
      currencySymbol,
      asset,
      buyOutPrice,
      currencyContractAddress,
      decimals,
      network,
    },
    loading,
    complete,
  } = getLatestListing();
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
      {!loading && complete ? (
        <div className='d-flex flex-row justify-content-center position-relative w-100 h-100 mt-5 mt-lg-0'>
          <div className='wrapper h-100 d-flex flex-column p-3'>
            <div className='s1 d-flex flex-column flex-lg-row justify-content-center align-items-center text-start mt-5'>
              <div className='d-flex flex-column m-5 text-center strokeme'>
                <h2 className='display-1'>Welcome to The Lookout!</h2>
                <h4>Closed Alpha</h4>

                <p>Building on Polygon</p>
              </div>
              <div className='col-md-5'>
                <h4 className='border-bottom border-dark mb-3 strokeme'>
                  Latest Listed
                </h4>
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
          <h4>
            Feeding the Birds
            <ANIM_Ellipsis />
          </h4>
        </div>
      )}
    </>
  );
}
