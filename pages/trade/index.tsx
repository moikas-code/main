import React, {useEffect, useState} from 'react';
const {DateTime} = require('luxon');

import DABU from '../../dabu';
import {useAddress} from '@thirdweb-dev/react';
//@ts-ignore
import SEO from '@/src/components/SEO';
// @ts-ignore
import Button from '@/src/components/Button';
// @ts-ignore
import NFTMARKETCARD from '@/src/components/NFTMarketCard';
// @ts-ignore
import ANIM_Ellipsis from '@/src/components/ANIM-Ellipsis';
import Web3 from 'web3';
var BN: any = Web3.utils.hexToNumberString;
async function formatListings(listings: any, sort: string = 'latest') {
  function groupAsArrayOfArray(dataArr: Array<any>, rowSize = 4) {
    var i = 0;
    let rowarr = [] as any;
    let groupArr = [] as any;

    // const cleantListings = removeDuplicateObjectFromArray(listings, 'id');
    // console.log(cleantListings);
    for (const data of dataArr.sort((a: any, b: any) => {
      switch (sort) {
        case 'oldest':
          return a.id - b.id;
        case 'latest':
        default:
          return b.id - a.id;
      }
    })) {
      if (rowarr.length < rowSize && i !== dataArr.length - 1) {
        rowarr.push(data);
      } else if (i == dataArr.length - 1) {
        rowarr.push(data);
        groupArr.push(rowarr);
      } else if (rowarr.length == rowSize) {
        groupArr.push(rowarr);
        rowarr = [];
        rowarr.push(data);
      }
      i = i + 1;
    }
    return groupArr;
  }
  const listingsGrouped = groupAsArrayOfArray(listings, 4);
  const listingPages = groupAsArrayOfArray(listingsGrouped, 3);
  return listingPages;
}

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
  const getActiveListings = async () => {
    // INIT Dabu
    var dabu = new DABU();
    //Get Active Listings
    const active_listings: any = await dabu.get_active_nft_listings();
    //Filter and Sort Active Listings
    console.log('get', active_listings);
    const listings = (await active_listings.map((nft: any) => {
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
    })) as any;
    return listings;
  };
  const {scriptDuration: duration, res: activeListings} = await runTime(
    getActiveListings
  );
  return {
    props: {
      activeListings: JSON.stringify(activeListings),
      scriptDuration: duration,
    },
    // - At most once every 10 seconds
    revalidate: 15, // In seconds
  };
}

export default function Dragon({connected, dabu, activeListings}: any) {
  const address = useAddress();
  // const {market_nfts, isLoading, error} = ActiveListings(dabu);
  const [_error, setError] = useState<any>('');
  const [page, setPage] = useState<any>(0);
  const [listed_nfts, setNFTS] = useState<any>([[]]);

  React.useEffect(() => {
    console.log(typeof activeListings);
    formatListings(JSON.parse(activeListings)).then((nfts) => {
      console.log(nfts);
      setNFTS(nfts);
    });
  }, [activeListings]);

  return (
    <>
      <style global jsx>
        {`
          .nft-wrapper {
            width: 100%;
            overflow: hidden;
          }

          // Small devices (landscape phones, 576px and up)
          @media (min-width: 576px) {
            .nft-wrapper {
              min-width: calc(95.5% / 1);
              max-width: 100%;
            }
          }

          // Medium devices (tablets, 768px and up)
          @media (min-width: 768px) {
            .nft-wrapper {
              max-width: calc(95.5% / 2) !important;
              min-width: calc(95.5% / 2) !important;
            }
          }

          // Large devices (desktops, 992px and up)
          @media (min-width: 992px) {
            .nft-wrapper {
              min-width: calc(95.5% / 2) !important;
              max-width: calc(95.5% / 3) !important;
            }
          }

          // X-Large devices (large desktops, 1200px and up)
          @media (min-width: 1200px) {
            .nft-wrapper {
              min-width: calc(95.5% / 4) !important;
              max-width: calc(95.5% / 4) !important;
            }
          }

          // XX-Large devices (larger desktops, 1400px and up)
          @media (min-width: 1400px) {
            .nft-wrapper {
              min-width: calc(95.5% / 4) !important;
              max-width: calc(95.5% / 4) !important;
            }
          }
        `}
      </style>
      <SEO
        title={`Explore - Moika's Lookout`}
        description="moikaslookout.com: Moika's Lookout is a WEB3 Community that is focused on the development of decentralized applications and services as well providing gaming content."
        twitter='takolabsio'
        keywords='gaming, nfts, web3'
      />
      <div className='d-flex flex-row justify-content-center position-relative w-100 h-100'>
        <div className='wrapper d-flex flex-column p-3'>
          <div className='my-5'>
            <h4>Alpha software. Use at your own risk.</h4>
            <h5>Service Fees: 0.05%</h5>
            <hr />
          </div>
          {false ? (
            <div className='h-100 w-100 d-flex flex-row justify-content-center align-items-center'>
              <h4>
                Washing Dishes
                <ANIM_Ellipsis />
              </h4>
            </div>
          ) : (
            typeof listed_nfts[page] !== 'undefined' &&
            listed_nfts[page].map((nfts: any, key: number) => {
              return (
                <div
                  className={`d-flex flex-row flex-wrap ${
                    nfts.length > 1
                      ? 'justify-content-between'
                      : 'justify-content-start'
                  } mb-3`}
                  key={key}>
                  {nfts.map(
                    (
                      {
                        id,
                        tokenId,
                        currencySymbol,
                        asset: {name, description, image},
                        buyOutPrice,
                        currencyContractAddress,
                        decimals,
                        network,
                      }: any,
                      _key: number
                    ) => {
                      return (
                        <NFTMARKETCARD
                          id={id}
                          key={_key}
                          tokenId={tokenId}
                          currencySymbol={currencySymbol}
                          name={name}
                          description={description}
                          image={image}
                          buyOutPrice={buyOutPrice}
                          currencyContractAddress={currencyContractAddress}
                          decimals={decimals}
                          current_address={address}
                          network={network}
                        />
                      );
                    }
                  )}
                </div>
              );
            })
          )}
          <hr />
          <div className='d-flex flex-row justify-content-between align-items-center mb-3'>
            <Button disabled={page === 0} onClick={() => setPage(page - 1)}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                fill='currentColor'
                className='bi bi-arrow-left-circle'
                viewBox='0 0 16 16'>
                <path
                  fillRule='evenodd'
                  d='M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z'
                />
              </svg>
            </Button>
            {`${page + 1} of ${listed_nfts.length}`}
            <div>
              <Button
                disabled={!(page < listed_nfts.length - 1)}
                onClick={() => {
                  setPage(page + 1);
                }}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  fill='currentColor'
                  className='bi bi-arrow-right-circle'
                  viewBox='0 0 16 16'>
                  <path
                    fillRule='evenodd'
                    d='M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z'
                  />
                </svg>
              </Button>
            </div>
          </div>
          <hr />
        </div>
      </div>
    </>
  );
}
