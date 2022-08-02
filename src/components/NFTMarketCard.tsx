import React, {useEffect, useState} from 'react';
import DABU from '../../dabu/index';

import {useAddress, MediaRenderer} from '@thirdweb-dev/react';
// @ts-ignore
import Button from '@/src/components/Button';
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
  const address = useAddress();
  var dabu = new DABU();
  typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
    ? dabu.init('POLYGON', window.ethereum)
    : dabu.init('POLYGON');

  return (
    <div
      id={id}
      className='rounded border border-dark m-2 p-2 d-flex flex-column justify-content-between'>
      <div className='icon-wrapper mx-auto'>
        <MediaRenderer className='mx-auto h-100 w-100' src={image} />
        {/* <img className='mx-auto' src={image} alt='' /> */}
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
        {address && (
          <Button
            className='btn btn-dark'
            onClick={async () => {
              return dabu
                ?.buy_nft({
                  listingId: id,
                  quantity: 1,
                  address: address,
                  isGasless: currencySymbol !== 'MATIC',
                  price: buyOutPrice,
                  currencyContractAddress: currencyContractAddress,
                  decimals: decimals,
                })
                .then((res: any) => {
                  console.log(res);
                  alert('NFT bought successfully!');
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
export default NFTMARKETCARD;
