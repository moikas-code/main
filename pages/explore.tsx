import React, {useEffect, useState} from 'react';
import DABU from '../dabu/index';

import {useAddress, MediaRenderer} from '@thirdweb-dev/react';
//@ts-ignore
import SEO from '@/src/components/SEO';
// @ts-ignore
import Button from '@/src/components/Button';
// @ts-ignore
import ActiveListings from '@/src/hooks/getActiveListings';
// @ts-ignore
import NFTMARKETCARD from '@/src/components/NFTMarketCard';

async function formatListings(listings: any, sort: string = 'latest') {
  var i = 0;
  let rowarr = [] as any;
  let groupArr = [] as any;
  for (const nft of [...listings].sort((a: any, b: any) => {
    switch (sort) {
      case 'oldest':
        return a.id - b.id;
      case 'latest':
      default:
        return b.id - a.id;
    }
  })) {
    i = i + 1;
    if (rowarr.length < 4 && i !== listings.length - 1) {
      rowarr.push(nft);
    } else if (i == listings.length - 1) {
      rowarr.push(nft);
      groupArr.push(rowarr);
    } else if (rowarr.length == 4) {
      groupArr.push(rowarr);
      rowarr = [];
      rowarr.push(nft);
    }
  }

  let row = 1;
  const rowSize = 3;
  let arr: any[] = [];
  let arr2: any[] = [];
  await groupArr.map((_nft: any, key: number) => {
    if (arr.length == rowSize) {
      arr2.push(arr);
      arr = [];
    }
    if (groupArr.length == key + 1 && !arr.includes(_nft)) {
      arr.push(_nft);
      arr2.push(arr);
    } else {
      arr.push(_nft);
    }
  });

  return arr2;
}

export default function Dragon({connected}: any) {
  const address = useAddress();
  const [blockchain, setBlockchain] = useState('POLYGON');
  const {market_nfts, complete, loading} = ActiveListings(blockchain);
  const [_error, setError] = useState<any>('');
  const [page, setPage] = useState<any>(0);
  const [listed_nfts, setNFTS] = useState<any>([[]]);
  var dabu = new DABU();
  typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
    ? dabu.init(blockchain, window.ethereum)
    : dabu.init(blockchain);

  dabu.setNetwork('POLYGON');

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{chainId: '0x89'}],
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x89',
                  chainName: 'Polygon',
                  rpcUrls: ['https://polygon-rpc.com/'] /* ... */,
                },
              ],
            });
          } catch (addError) {
            // handle "add" error
          }
        }
        // handle other "switch" errors
      }
      return;
    }
  }, []);

  useEffect(() => {
    formatListings(market_nfts).then((nfts) => {
      // console.log(nfts);
      setNFTS(nfts);
    });
  }, [market_nfts]);

  return (
    <>
      <style jsx>
        {`
          .nft-wrapper {
            width: 100%;
          }

          .icon-wrapper {
            width: 100%;
            height: 300px;
          }

          .icon-wrapper img {
            width: 100%;
            max-height: 300px;
            object-fit: contain;
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
              min-width: calc(95.5% / 2);
              max-width: calc(95.5% / 2);
            }
          }

          // Large devices (desktops, 992px and up)
          @media (min-width: 992px) {
            .nft-wrapper {
              min-width: calc(95.5% / 2);
              max-width: calc(95.5% / 3);
            }
          }

          // X-Large devices (large desktops, 1200px and up)
          @media (min-width: 1200px) {
            .nft-wrapper {
              min-width: calc(95.5% / 4);
              max-width: calc(95.5% / 4);
            }
          }

          // XX-Large devices (larger desktops, 1400px and up)
          @media (min-width: 1400px) {
            .nft-wrapper {
              min-width: calc(95.5% / 4);
              max-width: calc(95.5% / 4);
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
          <h5>Service Fees: 0.05%</h5>
          <p className='mt-3'>Connected To {blockchain}</p>
          <hr />
          {loading ? (
            <div className='h-100 w-100 d-flex flex-column justify-content-center align-items-center'>
              Washing Dishes...
            </div>
          ) : (
            complete &&
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
                      }: any,
                      _key: number
                    ) => {
                      return (
                        <span className='nft-wrapper'>
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
                          />
                        </span>
                      );
                    }
                  )}
                </div>
              );
            })
          )}
          <hr />
          <div className='d-flex flex-row justify-content-between'>
            <Button disabled={page === 0} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            {`Page ${page + 1} of ${listed_nfts.length}`}
            <Button
              disabled={!(page < listed_nfts.length - 1)}
              onClick={() => setPage(page + 1)}>
              Next
            </Button>
          </div>
          <hr />
        </div>
      </div>
    </>
  );
}


