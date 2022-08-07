import React, {useEffect, useState} from 'react';
import DABU from '../../dabu/index';
import Web3 from 'web3';
var BN: any = Web3.utils.hexToNumberString;
import {useRouter} from 'next/router';
import {
  useAddress,
  MediaRenderer,
  useNetworkMismatch,
  useNetwork,
  ChainId,
} from '@thirdweb-dev/react';
//@ts-ignore
import SEO from '@/src/components/SEO';
// @ts-ignore
import Button from '@/src/components/Button';
// @ts-ignore
import getTrade from '@/src/hooks/getTrade';
// @ts-ignore
import ANIM_Ellipsis from '@/src/components/ANIM-Ellipsis';

export default function Dragon({connected}: any) {
  const router = useRouter();
  // De-construct network_id out of the router.query.
  // This means that if the user visits /listing/ethereum-0 then the network_id will be 0.
  // If the user visits /listing/1 then the network_id will be 1.
  const {network_id} = router.query as {network_id: string};
  const address = useAddress();
  var network;
  var listingId;
  const [blockchain, setBlockchain] = useState('POLYGON');
  if (network_id) {
    network = network_id.split('-')[0];
    listingId = network_id.split('-')[1];
  }
  const {trade, isLoading} = getTrade({
    blockchain: network,
    listingId: listingId,
  });

  const [isError, setIsError] = useState<any>(false);
  const [page, setPage] = useState<any>(0);
  const [listed_nfts, setNFTS] = useState<any>([[]]);
  // Ensure user is on the correct network
  const networkMismatch = useNetworkMismatch();

  const [, switchNetwork] = useNetwork();
  var dabu = new DABU();
  dabu.init();

  useEffect(() => {
    if (trade !== null) {
      if (typeof trade.error !== 'undefined') {
        setIsError(true);
      }
      console.log(trade);
      setIsError(false);
    }
  }, [trade]);
  // console.log(isError);
  if (isError) {
    return (
      <div className='h-100 d-flex flex-column justify-content-center align-items-center'>
        <h4>Trade Not Found</h4>
      </div>
    );
  }

  isLoading && (
    <div className='h-100 w-100 d-flex flex-row justify-content-center align-items-center'>
      <h4>
        Baking Cake
        <ANIM_Ellipsis />
      </h4>
    </div>
  );

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
        title={`Trade on ${network} - Trade ${listingId} - Moika's Lookout`}
        description="moikaslookout.com: Moika's Lookout is a WEB3 Community that is focused on the development of decentralized applications and services as well providing gaming content."
        twitter='takolabsio'
        keywords='gaming, nfts, web3'
      />
      <div className='d-flex flex-row justify-content-center position-relative w-100 h-100'>
        <div className='wrapper d-flex flex-column p-3'>
          <div className='my-5'>
            <h5>Service Fees: 0.05%</h5>
            <hr />
          </div>
          {isLoading ? (
            <div className='h-100 w-100 d-flex flex-row justify-content-center align-items-center'>
              <h4>
                Washing Dishes
                <ANIM_Ellipsis />
              </h4>
            </div>
          ) : (
            <>
              <div className='d-flex flex-column w-100'>
                <h3 className='text-capitalize '>
                  <span className='border-bottom border-dark pe-5'>
                    {trade.type === 0 ? 'Direct Listing' : 'Auction'} on{' '}
                    {trade.network}
                  </span>
                </h3>
                <h4>{trade.asset.name}</h4>
                <MediaRenderer
                  className='w-100 col card'
                  src={trade.asset.image}
                />
                <hr />
                <p></p>
                <p>
                  <strong>Description:</strong> <hr />
                  {trade.asset.description}
                </p>
              </div>
            </>
          )}
          <hr />
          {address && (
            <Button
              className='btn btn-dark'
              onClick={async (e) => {
                console.log('Network mismatch', networkMismatch, network);
                network === 'ethereum' && switchNetwork(ChainId.Mainnet);
                network === 'polygon' && switchNetwork(ChainId.Polygon);

                // Prevent page from refreshing
                e.preventDefault();
                const price =
                  BN(trade.buyoutPrice._hex) /
                  BN(10 ** trade.buyoutCurrencyValuePerToken.decimals);
                console.log(price);
                return dabu
                  ?.buy_nft({
                    listingId: trade.id,
                    quantity: 1,
                    address: address,
                    isGasless: false,
                    price: price,
                    currencyContractAddress: trade.currencyContractAddress,
                    decimals: trade.buyoutCurrencyValuePerToken.decimals,
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
              Quick Buy
            </Button>
          )}
          <hr />
        </div>
      </div>
    </>
  );
}
