import {gql, useLazyQuery} from '@apollo/client';
import React, {useState} from 'react';
import Navbar from '../src/components/Navbar';
// @ts-ignore
import TAKO from '@/src/tako';
import {ConnectorContext} from '../src/components/connector/sdk-connection-provider';
//@ts-ignore
import SEO from '@/src/components/SEO';
// @ts-ignore
import Button from '@/src/components/common/button';
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
function ListPage() {
  const [nft_list, set_nft_list] = React.useState([]);

  const [_ID, setID] = React.useState(0);
  const connection = React.useContext<any>(ConnectorContext);
  const sdk: string = connection.sdk;

  const _blockchain =
    typeof connection?.walletAddress?.split(':')[0] !== 'undefined'
      ? connection?.walletAddress?.split(':')[0]
      : '';
  const _address: string = connection.walletAddress?.split(':')[1];
  const queryNFTS = gql`
    query Query_Address_NFTS($input: QueryInput) {
      Query_Address_NFTS(input: $input) {
        totalSupply
        nfts {
          id
          blockchain
          tokenId
          collection
          contract
          lazySupply
          mintedAt
          lastUpdatedAt
          orders
          meta {
            name
            description
            content {
              type
              width
              height
              url
              representation
              mimeType
              size
            }
          }
        }
      }
    }
  `;

  const [Query_Address_NFTS, {loading, refetch}] = useLazyQuery(queryNFTS, {
    onCompleted: async ({Query_Address_NFTS}) => {
      // console.log(Query_Address_NFTS);
      if (
        Query_Address_NFTS !== null &&
        Query_Address_NFTS !== undefined &&
        Query_Address_NFTS.items !== null
      ) {
        let nfts: any = await Query_Address_NFTS.nfts;

        var i = 0;
        let arr = [] as any;
        let groupArr = [] as any;
        for (const nft of nfts) {
          i = i + 1;
          // console.log('?', i == nfts.length, i, nfts.length);
          if (arr.length < 4 && i !== nfts.length) {
            arr.push(nft);
          } else if (i == nfts.length) {
            groupArr.push(arr);
          } else if (arr.length == 4) {
            groupArr.push(arr);
            arr = [];
            arr.push(nft);
          }
        }

        console.log(Query_Address_NFTS, 'clean', groupArr);
        set_nft_list(groupArr);
        // setCollectionNfts([...collectionNfts, ...clean]);
        // setContinuation(Collection_NFTS.continuation);
        // setComplete(true);
      }
    },
  });
  React.useEffect(() => {
    Query_Address_NFTS({
      variables: {
        input: {
          address: `${_blockchain}:${_address}`,
        },
      },
    });
  }, [_blockchain, _address]);

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
      <Navbar />
      <div className='d-flex flex-row justify-content-center align-items-center mx-auto position-relative'>
        <div className='market d-flex flex-column mx-auto m-5 p-3'>
          {nft_list.map((rows: any, k) => {
            return (
              <div
                className='d-flex flex-column flex-md-row flex-wrap w-100'
                key={k}>
                {rows.map((nft_item, q) => {
                  return (
                    <NFT_ITEM
                      key={q}
                      ID={nft_item.id}
                      Name={nft_item.meta?.name}
                      Content={nft_item.meta.content}
                      Url={nft_item.meta.content[0]?.url}
                      Orders={nft_item.orders}
                      onClick={() => {
                        async () => {
                          console.log('Bought', nft_item.id);
                          setID(nft_item.id);
                        };
                      }}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
export default ListPage;
///
function NFT_ITEM({...props}) {
  const connection = React.useContext<any>(ConnectorContext);
  const sdk: string = connection.sdk;

  const _blockchain =
    typeof connection?.walletAddress?.split(':')[0] !== 'undefined'
      ? connection?.walletAddress?.split(':')[0]
      : '';
  const _address: string = connection.walletAddress?.split(':')[1];
  const [show, setShow] = useState<boolean>(false);
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
      <div
        id={props.ID}
        className='nft-wrapper  border border-dark m-2 p-2 d-flex flex-column col justify-content-between'>
        <div className='icon-wrapper mx-auto'>
          {props.Content.length > 0 && (
            <img
              className='mx-auto'
              src={props.Url || 'https://via.placeholder.com/350'}
              alt=''
            />
          )}
        </div>
        <div className='d-flex flex-column'>
          <hr />
          {connection.state.status === 'connected' &&
          props.Orders === 0 &&
          !show && (
            <>
              <p className='m-0'>{props.Name}</p>
              <hr />
              <Button
                className='btn btn-dark'
                onClick={() => {
                  props.onClick();
                  setShow(!show);
                }}>
                Quick List
              </Button>
            </>
          )}

          {show && (
            <ListSection
              ID={props.ID}
              onClose={() => setShow(false)}
              onsubmit={() => setShow(false)}
            />
          )}
        </div>
      </div>
    </>
  );
}

///
function ListSection({ID, onsubmit, onClose}: any) {
  const [price, setPrice] = useState(0);
  const connection = React.useContext<any>(ConnectorContext);
  const sdk: string = connection.sdk;

  const _blockchain =
    typeof connection?.walletAddress?.split(':')[0] !== 'undefined'
      ? connection?.walletAddress?.split(':')[0]
      : '';
  const _address: string = connection.walletAddress?.split(':')[1];

  return (
    <div className=''>
      <form
        className=' p-2 bg-light d-flex flex-column'
        onSubmit={async (e) => {
          e.preventDefault();
          console.log('submit', price);
          await TAKO.sell_nft({
            sdk,
            price,
            amount: 1,
            blockchain: _blockchain,
            nft_id: ID,
          }).then((res) => {
            onsubmit();
          });
        }}>
        <div className='d-flex flex-row'>
          <input
            type='text'
            className='pb-1 me-5'
            onChange={(e) => {
              const {value}: any = e.target;
              setPrice(value);
            }}
          />
          {''}
          {currencyType(_blockchain)}
        </div>
        <div className=' mt-2 d-flex flex-row btn-group w-100'>
          <Button
            className='btn btn-danger'
            onClick={() => {
              onClose(false);
            }}>
            Close
          </Button>
          <Button
            className='btn btn-success'
            onClick={async (e) => {
              e.preventDefault();
              console.log('submit', price);
              await TAKO.sell_nft({
                sdk,
                price,
                amount: 1,
                blockchain: _blockchain,
                nft_id: ID,
              }).then((res) => {
                onsubmit();
              });
            }}>
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
