import React, {useEffect, useState} from 'react';
import DABU from '../../dabu/index';
import {
  useAddress,
  MediaRenderer,
  useNetworkMismatch,
  useNetwork,
  ChainId,
} from '@thirdweb-dev/react';
// @ts-ignore
import Button from '@/src/components/Button';
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

  return (
    <>
      <style global jsx>
        {`
          .icon-wrapper {
            max-width: 100%;
            height: 100%;
            min-height: 300px;
            -o-object-fit: cover !important;
            object-fit: contain;
            overflow: hidden;
          }

          .icon-wrapper img {
            max-height: 300px;
            object-fit: cover !important;
          }
        `}
      </style>
      <div
        id={id}
        className='rounded border border-dark m-2 p-2 d-flex flex-column justify-content-between bg-white'>
        <div className='icon-wrapper mx-auto  d-flex flex-column justify-content-center align-items-center'>
          <MediaRenderer className='' src={image} />
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
