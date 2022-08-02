import React, {useEffect, useState} from 'react';
//@ts-ignore
import SEO from '@/src/components/SEO';
// @ts-ignore
import NFTMARKETCARD from '@/src/components/NFTMarketCard';
import DABU from '../dabu';
// import getLatestListing from '@/src/hooks/getLatestListing';
import {GetServerSideProps} from 'next';
import client from '../src/middleware/graphql/apollo-client';
import {ApolloClient, gql, HttpLink, InMemoryCache} from '@apollo/client';
const query = gql`
  query Query_Latest_Market_Sell_Order($input: QueryInput) {
    Query_Latest_Market_Sell_Order(input: $input) {
      id
      asset {
        id
        name
        description
        image
      }
      currencyContractAddress
      currencySymbol
      buyOutPrice
      decimals
    }
  }
`;
const getApolloClient = () => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri:
        process.env.AKKORO_ENV !== 'prod'
          ? `'http://localhost:3000/api/graphql`
          : 'https://moikaslookout.com/api/graphql',
      fetch,
    }),
  });
};
export const getServerSideProps: GetServerSideProps = async () => {
  const apolloClient = getApolloClient();
  const {data} = await apolloClient.query({
    query: query,
    variables: {
      input: {
        blockChain: 'POLYGON',
      },
    },
  });
  return {props: {latest_nft: data.Query_Latest_Market_Sell_Order}};
};
export default function Dragon({
  connected,
  latest_nft: {
    id,
    tokenId,
    currencySymbol,
    asset,
    buyOutPrice,
    currencyContractAddress,
    decimals,
  },
}: any) {
  const [blockchain, setBlockchain] = useState('POLYGON');

  var dabu = new DABU();
  typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
    ? dabu.init(blockchain, window.ethereum)
    : dabu.init(blockchain);

  dabu.setNetwork(blockchain);

  return (
    <>
      <style jsx global>
        {`
          .neg-m-5rem {
            margin-top: -5rem;
          }
          .nft-wrapper {
            min-width: calc(95.5% / 3);
            max-width: calc(95.5% / 3);
          }
        `}
      </style>

      <SEO
        title={`Moka's Lookout | Home`}
        description="Moika's Lookout is a WEB3 Community."
        twitter='takolabsio'
        keywords='gaming, nfts, web3'
      />
      <div className='d-flex flex-row justify-content-center position-relative w-100 h-100'>
        <div className='wrapper d-flex flex-column p-3'>
          <div className='s2 d-flex flex-column flex-lg-row justify-content-center align-items-center text-start mt-5'>
            <div className='d-flex flex-column m-5 text-center'>
              <h2 className='display-1'>Welcome to The Lookout!</h2>
              <h4>Open Alpha</h4>

              <p>Building on Polygon</p>
            </div>
            <div className='col-md-5'>
              <span className='nft-wrapper'>
                <NFTMARKETCARD
                  id={id}
                  tokenId={tokenId}
                  currencySymbol={currencySymbol}
                  name={asset?.name}
                  description={asset.description}
                  image={asset.image}
                  buyOutPrice={buyOutPrice}
                  currencyContractAddress={currencyContractAddress}
                  decimals={decimals}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
