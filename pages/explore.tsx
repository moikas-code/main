import React, {useEffect, useState} from 'react';
import DABU from '../dabu/index';

import {useAddress} from '@thirdweb-dev/react';
//@ts-ignore
import SEO from '@/src/components/SEO';
// @ts-ignore
import Button from '@/src/components/Button';
// @ts-ignore
import ActiveListings from '@/src/hooks/getActiveListings';

async function formatListings(listings: any) {
  var i = 0;
  let rowarr = [] as any;
  let groupArr = [] as any;
  for (const nft of listings) {
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
  var dabu =
    typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
      ? new DABU(blockchain, window.ethereum)
      : new DABU(blockchain);
  useEffect(() => {
    connected&&dabu
      .getNetwork()
      .then((network: any) => {
        setBlockchain(network);
      })
      .catch((err: any) => {
        setError(err);
      });
  }, []);

  useEffect(() => {
    formatListings(market_nfts).then((nfts) => {
      console.log(nfts);
      setNFTS(nfts);
    });
  }, [market_nfts]);

  return (
    <>
      <SEO
        title={`Tako Labs - EXPLORE`}
        description='TAKOLABS.IO: Tako Labs is a WEB3 Community that is focused on the development of decentralized applications and services as well providing gaming content.'
        twitter='takolabs'
        keywords='gaming, nfts, web3'
      />
      <div className='d-flex flex-row justify-content-center position-relative w-100 h-100'>
        <div className='wrapper d-flex flex-column p-3'>
          
          <p className='mt-3'>Connected To {blockchain}</p>
          <hr />
          {loading ? (
            <div className='h-100 w-100 d-flex flex-column justify-content-center align-items-center'>
              Loading NFTS
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

const NFTMARKETCARD = ({
  id,
  tokenId,
  currencySymbol,
  name,
  description,
  image,
  buyOutPrice,
  currencyContractAddress,
  decimals,
  current_address,
}: any) => {
  var dabu =
    typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
      ? new DABU('POLYGON', window.ethereum)
      : new DABU('POLYGON');
  return (
    <div
      id={id}
      className='nft-wrapper rounded border border-dark m-2 p-2 d-flex flex-column justify-content-between'>
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
      <div className='icon-wrapper mx-auto'>
        <img className='mx-auto' src={image} alt='' />
      </div>
      <div className='d-flex flex-column'>
        <hr />
        <p className='m-0'>{name}</p>
        <hr />
        <div className='d-flex flex-row'>
          <p>
            Price: {buyOutPrice} {currencySymbol}
          </p>
        </div>
        {current_address && (
          <Button
            className='btn btn-dark'
            onClick={async () => {
              return dabu
                ?.buy_nft({
                  listingId: id,
                  quantity: 1,
                  address: current_address,
                  isGasless: currencySymbol !== 'MATIC',
                  price: buyOutPrice,
                  currencyContractAddress: currencyContractAddress,
                  decimals: decimals,
                })
                .then((res: any) => {
                  console.log(res);
                })
                .catch((e) => {
                  console.log(e);
                });
            }}>
            Quick Buy
          </Button>
        )}
      </div>
    </div>
  );
};
