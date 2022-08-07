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
}: any) => {
  const address = useAddress();
  var dabu = new DABU();
  dabu.init();
  // Ensure user is on the correct network
  const networkMismatch = useNetworkMismatch();

  const [, switchNetwork] = useNetwork();

  const router = useRouter();

  return (
    <div
      id={id}
      className='rounded border border-dark m-2 p-2 d-flex flex-column justify-content-between bg-white'>
      <div className='icon-wrapper mx-auto'>
        <MediaRenderer className='mx-auto h-100 w-100' src={image} />
        {/* <img className='mx-auto' src={image} alt='' /> */}
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
        {address && (
          <Button
            className='btn btn-dark'
            onClick={async (e) => {
              console.log('Network mismatch', networkMismatch, network);
              network === 'ethereum' && switchNetwork(ChainId.Mainnet);
              network === 'polygon' && switchNetwork(ChainId.Polygon);

              // Prevent page from refreshing
              e.preventDefault();
              router.push(`/trades/${network}-${id}`);
              return;
              return dabu
                ?.buy_nft({
                  listingId: id,
                  quantity: 1,
                  address: address,
                  isGasless: currencySymbol !== 'MATIC',
                  price: buyOutPrice,
                  currencyContractAddress: currencyContractAddress,
                  decimals: decimals,
                  network: network,
                })
                .then((res: any) => {
                  console.log(res);
                  // alert('NFT bought successfully!');
                })
                .catch((e) => {
                  console.log(e);
                });
            }}>
            Trade Page
          </Button>
        )}
      </div>
    </div>
  );
};
export default NFTMARKETCARD;
