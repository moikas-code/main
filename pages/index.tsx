import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
//@ts-ignore
import {ConnectorContext} from '@/src/components/connector/sdk-connection-provider';

import Select from 'react-select';
//@ts-ignore
import SEO from '@/src/components/SEO';
// @ts-ignore
import Button from '@/src/components/common/button';
// @ts-ignore
import Modal from '@/src/components/common/modal';
// @ts-ignore
import Input from '@/src/components/common/input';
// @ts-ignore
import ToggleButton from '@/src/components/ToggleButton';
// @ts-ignore
import TAKO from '@/src/tako';
import {gql, useLazyQuery} from '@apollo/client';
// @ts-ignore
import {_metadata, _metadataTypes} from '../src/lib/metadataSchema';
// @ts-ignore
import FormInputs from '../src/components/FormInputs';
// @ts-ignore
import nft from '../src/lib/nft-storage';
// @ts-ignore
import MediaViewer from '../src/components/media-viewer';

import Navbar from '../src/components/Navbar';
import {
  toUnionAddress,
  UnionAddress,
  BigNumber,
  toBigNumber,
} from '@rarible/types';
import NFTInput from '../src/components/NFTInput';
import {ConnectOptions} from '../src/views/connect/connect-options';
import {setDefaultResultOrder} from 'dns/promises';
import TakoLink from '../src/components/TakoLink';
type MintFormProps = any;
interface NFTFormProps extends MintFormProps {
  address: UnionAddress;
  sdk: any;
  wallerAddress: any;
}

function currencyType(blockchain: string) {
  switch (blockchain) {
    case 'ETHEREUM':
      return 'ETH';
    case 'POLYGON':
      return 'MATIC';
    case 'TEZOS':
      return 'XTZ';
    case 'FLOW':
      return 'FLOW';
    case 'SOLANA':
      return 'SOL';
    default:
      return 'NONE';
  }
}

export default function Dragon() {
  const router = useRouter();
  const connection = React.useContext<any>(ConnectorContext);
  const sdk: string = connection.sdk;

  const _blockchain =
    typeof connection?.walletAddress?.split(':')[0] !== 'undefined'
      ? connection?.walletAddress?.split(':')[0]
      : '';
  const _address: string = connection.walletAddress?.split(':')[1];

  const [contractAddress, setContractAddress] = useState<any>(null);
  const [complete, setComplete] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [site_message, setSiteMessage] = useState<string | string[]>('');
  const [continuation, setContinuation] = useState<string | string[]>('');
  const [market_nfts, setMarketNFTS] = useState<Array<any>>([]);
  const [_error, setError] = useState<any>('');

  const query = gql`
    query Market_Sell_Orders($input: QueryInput) {
      Query_Market_Sell_Orders(input: $input) {
        continuations
        nfts {
          id
          name
          description
          supply
          creators {
            account
          }
          content {
            type
            width
            height
            mimeType
            url
          }
          orders {
            id
            filled
            platform
            status
            makeStock
            makePrice
            makePriceUsd
            maker
            take {
              type {
                type
                blockchain
              }
              value
            }
          }
        }
      }
    }
  `;
  const [Market_Sell_Orders, {loading, error, data}] = useLazyQuery(query, {
    onCompleted: async ({Query_Market_Sell_Orders}) => {
      console.log(Query_Market_Sell_Orders);
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
          console.log(
            '?',
            i == Query_Market_Sell_Orders.nfts.length,
            i,
            Query_Market_Sell_Orders.nfts.length
          );
          if (arr.length < 4 && i !== Query_Market_Sell_Orders.nfts.length) {
            arr.push(nft);
          } else if (i == Query_Market_Sell_Orders.nfts.length) {
            groupArr.push(arr);
          } else if (arr.length == 4) {
            groupArr.push(arr);
            arr = [];
            arr.push(nft);
          }
        }
        console.log('?', groupArr);
        setMarketNFTS(groupArr);
        setComplete(true);
      }
    },
  });

  useEffect((): any => {
    // typeof _address !== 'undefined' &&
    //   typeof _blockchain !== 'undefined' &&
    Market_Sell_Orders({
      variables: {
        input: {
          blockchains: [],
          origins: ['ETHEREUM:0x877728846bFB8332B03ac0769B87262146D777f3'],
          continuation: '',
          size: 100,
        },
      },
    });

    return () => {
      setComplete(false);
    };
  }, [_address, _blockchain]);

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
      <style jsx>
        {`
          .market {
            max-width: 1228px;
          }
          .nft-wrapper {
            width: 275px;
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
      <Navbar />
      <div className='d-flex flex-row justify-content-center align-items-center mx-auto position-relative'>
        <div className='market d-flex flex-column mx-auto m-5 p-3'>
          <p>Site Message: {site_message}</p>
          <p>
            Site Fees: 0.10% - is used to keep the lights on ❤
          </p>
          {market_nfts
            .sort((a, b) => a.length - b.length)
            .map((nfts: any, k) => {
              return (
                <div
                  className='d-flex flex-column flex-md-row flex-wrap w-100'
                  key={k}>
                  {nfts.map(
                    ({id, content: [media], name, orders, creators}: any) => {
                      return (
                        <div
                          id={id}
                          className='nft-wrapper  border border-dark m-2 p-2 d-flex flex-column col justify-content-between'>
                          <div className='icon-wrapper mx-auto'>
                            <img className='mx-auto' src={media.url} alt='' />
                          </div>
                          <div className='d-flex flex-column'>
                            <hr />
                            <p className='m-0'>{name}</p>
                            <hr />
                            <div className='d-flex flex-row'>
                              <p>
                                Price: {orders[0].makePrice}{' '}
                                {currencyType(id.split(':')[0])}
                              </p>
                            </div>
                            {connection.state.status === 'connected' && (
                              <Button
                                className='btn btn-dark'
                                onClick={async () => {
                                  console.log('buy', id, [
                                    {address: orders[0].maker, value: 5},
                                    {
                                      address: creators[0].account,
                                      value: 5,
                                    },
                                  ]);
                                  setSiteMessage('Buying ' + name);
                                  await TAKO.buy_nft({
                                    sdk,
                                    order_id: orders[0].id,
                                    amount: 1,
                                    blockchain: orders[0].id.split(':')[0],
                                    creators: [
                                      _blockchain == 'ETHEREUM'
                                        ? {
                                            account: 'ETHEREUM:0x877728846bFB8332B03ac0769B87262146D777f3' as any,
                                            value: 10,
                                          }
                                        : _blockchain == 'POLYGON'
                                        ? {
                                            account: 'POLYGON:0x877728846bFB8332B03ac0769B87262146D777f3' as any,
                                            value: 10,
                                          }
                                        : _blockchain == 'TEZOS'
                                        ? {
                                            account: 'TEZOS:tz1RrvP2FtnWAgGYKfoKSkLXYoqyHfXQjs8i' as any,
                                            value: 10,
                                          }
                                        : _blockchain == ' FLOW'
                                        ? {
                                            account: 'FLOW:0x54607bd2c9da71d0' as any,
                                            value: 10,
                                          }
                                        : _blockchain == 'SOLANA' && {
                                            account: 'SOLANA:98jiC2PfMNqLwUrabW3LxE15dfHCyaNX5V6nxHaP96NQ' as any,
                                            value: 10,
                                          },
                                    ],
                                  })
                                    .then((res) => {
                                      console.log(res);
                                      if (res.code === 4001) {
                                        setShow(false);
                                        setSiteMessage(
                                          'User Cancelled Transaction'
                                        );
                                      } else if (
                                        res.code === parseInt('-32603')
                                      ) {
                                        setShow(false);
                                        setSiteMessage(
                                          'Transaction Underpriced, Please Try Again and Check your Gas'
                                        );
                                      } else {
                                        setSiteMessage('Bought ' + name);
                                      }
                                    })
                                    .catch((err: any) => {
                                      setSiteMessage('Error Buying ' + name);
                                    });
                                  console.log('Bought', id);
                                }}>
                                Quick Buy
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

function BuyModal() {
  return (
    <div className=' bg-dark position-absolute top-50 start-50 translate-middle'></div>
  );
}
