import React, {useEffect, useState} from 'react';
import DABU from '../dabu/index';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {
  useMarketplace,
  useAddress,
  useMetamask,
  useConnect,
} from '@thirdweb-dev/react';
import Select from 'react-select';
//@ts-ignore
import SEO from '@/src/components/SEO';
// @ts-ignore
import Button from '@/src/components/Button';
// @ts-ignore
import TAKO from '@/src/tako';
import {gql, useLazyQuery} from '@apollo/client';
// @ts-ignore
import Navbar from '@/src/components/Navbar';
import WalletProvider from '../src/components/WalletProvider';
import TakoLink from '../src/components/TakoLink';
import Web3 from 'web3';
import {initWeb3} from '../src/helpers';

export default function Dragon({connected}: any) {
  const connectWithMetamask = useMetamask();
  const address = useAddress();
  const [show, setShow] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [site_message, setSiteMessage] = useState<string | string[]>('');
  const [_error, setError] = useState<any>('');

  return (
    <>
      <style jsx>
        {`
          .market {
            max-width: 1228px;
          }
          .nft-wrapper {
            min-width: 275px !important;
            max-width: 285px !important;
          }

          .icon-wrapper img {
            width: 100%;
            height: 100%;

            object-fit: contain;
          }
        `}
      </style>
      <SEO
        title={`Tako Labs - MARKET`}
        description='TAKOLABS.IO: Tako Labs is a WEB3 Community that is focused on the development of decentralized applications and services as well providing gaming content.'
        twitter='takolabs'
        keywords='gaming, nfts, web3'
      />
      <Navbar address={address} connected={connected} />
      <div className='d-flex flex-row position-relative w-100'>
        <div className='market d-flex flex-column p-3'>
          <p>
            Site Message:{' '}
            {
              'We are Currently in Open Alpha, so please use with discretion, and report any bugs'
            }
          </p>
          <p>Site Fees: 0.05% - is used to keep the lights on ❤</p>
          <ActiveListings current_address={address || ''} />
        </div>
      </div>
    </>
  );
}

function ActiveListings({current_address}: {current_address: string}) {
  var dabu =
    typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
      ? new DABU('POLYGON', window.ethereum)
      : new DABU('POLYGON');

  const address = useAddress();

  const [complete, setComplete] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [site_message, setSiteMessage] = useState<string | string[]>('');
  const [market_nfts, setMarketNFTS] = useState<Array<any>>([]);
  const [_error, setError] = useState<any>('');
  const query = gql`
    query Query_Market_Sell_Orders($input: QueryInput) {
      Query_Market_Sell_Orders(input: $input) {
        nfts {
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
    }
  `;
  const [Query_Market_Sell_Orders, {loading}] = useLazyQuery(query, {
    onCompleted: async ({Query_Market_Sell_Orders}) => {
      // console.log(Query_Market_Sell_Orders);
      if (
        Query_Market_Sell_Orders !== null &&
        Query_Market_Sell_Orders !== undefined
      ) {
        let cleanCollections: Array<any> = [];
        var i = 0;
        let arr = [] as any;
        let groupArr = [] as any;
        for (const nft of Query_Market_Sell_Orders.nfts) {
          i = i + 1;

          if (arr.length < 4 && i !== Query_Market_Sell_Orders.nfts.length) {
            arr.push(nft);
          } else if (i == Query_Market_Sell_Orders.nfts.length) {
            arr.push(nft);
            groupArr.push(arr);
          } else if (arr.length == 4) {
            groupArr.push(arr);
            arr = [];
            arr.push(nft);
          }
        }
        // console.log('setting index', groupArr);
        setMarketNFTS(groupArr);
        setComplete(true);
      }
    },
  });

  useEffect((): any => {
    initWeb3();
    Query_Market_Sell_Orders({
      variables: {
        input: {
          blockChain: 'POLYGON',
        },
      },
    });

    return () => {
      setComplete(false);
    };
  }, []);

  if (loading) {
    return (
      <div className='h-100 w-100 d-flex flex-column justify-content-center align-items-center'>
        <h1>Market | Tako Labs</h1>
        <hr />
        <p>Trade Your NFTs with Us ❤</p>
        <br />
        Loading NFTS
      </div>
    );
  }

  return (
    <>
      {market_nfts.map((nfts: any, key: number) => {
        return (
          <div
            className='d-flex flex-column flex-md-row flex-wrap w-100'
            key={key}>
            {nfts.map(
              ({
                id,
                tokenId,
                currencySymbol,
                asset: {name, description, image},
                buyOutPrice,
                currencyContractAddress,
                decimals,
              }: any) => {
                return (
                  <NFTMARKETCARD
                    id={id}
                    tokenId={tokenId}
                    currencySymbol={currencySymbol}
                    name={name}
                    description={description}
                    image={image}
                    buyOutPrice={buyOutPrice}
                    currencyContractAddress={currencyContractAddress}
                    decimals={decimals}
                    current_address={current_address}
                  />
                );
              }
            )}
          </div>
        );
      })}
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
      className='nft-wrapper  border border-dark m-2 p-2 d-flex flex-column col justify-content-between'>
      <style jsx>
        {`
          .nft-wrapper {
            min-width: 275px !important;
            max-width: 285px !important;
          }

          .icon-wrapper img {
            width: 100%;
            height: 100%;

            object-fit: contain;
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
