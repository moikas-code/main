import React, {useEffect, useState, useRef} from 'react';
import {
  useAddress,
  MediaRenderer,
  useNetworkMismatch,
  useNetwork,
  ChainId,
} from '@thirdweb-dev/react';
// @ts-ignore
import Button from './Button';
import {useRouter} from 'next/router';
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
  network,
  dabu,
}: any) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const imageLoaded = () => {
    setIsLoading(false);
  };

  return (
    <>
      <style global jsx>
        {`
          .nft-wrapper {
            min-width: 21.875rem;
          }
          .icon-wrapper {
            max-width: 37.5rem;
            width: 100%;
            height: 21.875rem;
            // height: 100%;
            -o-object-fit: contain !important;
            object-fit: contain;

            overflow: hidden;
          }
          img {
            height: 100%;
            width: 100%;
            object-fit: contain !important;
          }
        `}
      </style>
      <div
        id={id}
        className='nft-wrapper rounded border border-dark p-2 d-flex flex-column justify-content-between bg-white'>
        <div className='icon-wrapper d-flex flex-column justify-content-center align-items-center'>
          <MediaRenderer
            onLoad={() => {
              imageLoaded();
            }}
            className={`${isLoading ? 'd-none' : ''}`}
            src={image}
          />
          <div
            className={isLoading ? 'spinner-border text-primary' : 'd-none'}
            role='status'>
            <span className='sr-only'></span>
          </div>
        </div>
        <div className='d-flex flex-column'>
          <hr />
          <p className='m-0'>{name}</p>
          <hr />
          <p className='text-capitalize mb-0'>Network: {network}</p>
          <hr />
          <div className='d-flex flex-row'>
            <p>
              Price: {buyOutPrice} {currencySymbol}
            </p>
          </div>
          {
            <Button
              className='btn btn-dark'
              onClick={async (e: any) => {
                return router.push(`/trade/${network}-${id}`);
              }}>
              View Trade
            </Button>
          }
        </div>
      </div>
    </>
  );
};
export default NFTMARKETCARD;
