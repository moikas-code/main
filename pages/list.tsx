import {gql, useLazyQuery} from '@apollo/client';
import React, {useRef, useState} from 'react';
import Navbar from '../src/components/Navbar';
//@ts-ignore
import TAKO from '@/src/tako';
import DABU from '../dabu';

//@ts-ignore
import SEO from '@/src/components/SEO';
//@ts-ignore
import Button from '@/src/components/Button';
//@ts-ignore
import WalletProvider from '@/src/components/WalletProvider';
import {useAddress} from '@thirdweb-dev/react';
import Web3 from 'web3';
import {ChainId, NATIVE_TOKEN_ADDRESS} from '@thirdweb-dev/sdk';

function ListPage() {
  const marketRef = useRef(null);
  const [nft_list, set_nft_list] = React.useState([]);

  const [_ID, setID] = React.useState(0);

  const [viewWidth, setViewWidth] = React.useState(285);
  const address = useAddress();

  const query = gql`
    query Query_Address_NFTS($input: QueryInput) {
      Query_Address_NFTS(input: $input) {
        unlisted {
          id
          blockchain
          tokenId
          collection
          contract
          lazySupply
          mintedAt
          lastUpdatedAt
          orders
          isListed
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
        listed {
          id
          blockchain
          tokenId
          collection
          contract
          lazySupply
          mintedAt
          lastUpdatedAt
          orders
          isListed
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

  const [Query_Address_NFTS, {loading, refetch}] = useLazyQuery(query, {
    onCompleted: async ({Query_Address_NFTS}) => {
      console.log(Query_Address_NFTS);
      if (
        Query_Address_NFTS !== null &&
        Query_Address_NFTS !== undefined &&
        Query_Address_NFTS.items !== null
      ) {
        let nfts: any = await Query_Address_NFTS.unlisted;

        var i = 0;
        let arr = [] as any;
        let groupArr = [] as any;
        for (const nft of nfts) {
          i = i + 1;
          console.log('?', i == nfts.length, i, nfts.length);
          if (!nft.isListed) {
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
          address: `${'ETHEREUM'}:${address}`,
          blockChain: 'POLYGON',
        },
      },
    });
  }, [address]);

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
            width: 100%;
            max-width: 1228px !important;
          }
        `}
      </style> 

      <Navbar />
      <div className='d-flex flex-column justify-content-center align-items-center mx-auto position-relative'>
        <h4>Listing</h4>
        <div
          ref={marketRef}
          className='market d-flex flex-row justify-content-center justify-content-md-start flex-wrap p-5'>
          {nft_list.flat().map((nft_item: any, k) => {
            if (!nft_item.isListed)
              return (
                <NFTListingCard
                  key={k}
                  address={address}
                  ID={nft_item.id}
                  Name={nft_item.meta?.name}
                  Content={nft_item.meta.content}
                  Type={
                    typeof nft_item.meta.content[0] !== 'undefined'
                      ? nft_item.meta.content[0].type
                      : 'IMAGE'
                  }
                  Url={nft_item.meta.content[0]?.url}
                  Orders={nft_item.orders}
                  isListed={nft_item.isListed}
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
      </div>
    </>
  );
}
export default ListPage;

function NFTListingCard({...props}) {
  const [show, setShow] = useState<boolean>(false);
  console.log(props.Type);
  return (
    <>
      <style jsx>
        {`
          .nft-wrapper {
            width: 264px;
          }

          .icon-wrapper img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }

          // Small devices (landscape phones, 576px and up)
          @media (min-width: 576px) {
          }

          // Medium devices (tablets, 768px and up)
          @media (min-width: 768px) {
          }

          // Large devices (desktops, 992px and up)
          @media (min-width: 992px) {
          }

          // X-Large devices (large desktops, 1200px and up)
          @media (min-width: 1200px) {
          }

          // XX-Large devices (larger desktops, 1400px and up)
          @media (min-width: 1400px) {
            .nft-wrapper {
              min-width: 425px;
              max-width: 425px;
            }
          }
        `}
      </style>

      <div
        id={props.ID}
        className='nft-wrapper border border-dark m-2 p-2 d-flex flex-column col justify-content-between'>
        <div className='icon-wrapper mx-auto'>
          {props.Content.length > 0 && props.Type === 'IMAGE' ? (
            <img
              className='mx-auto'
              src={props.Url || 'https:via.placeholder.com/350'}
              alt=''
            />
          ) : props.Type === 'VIDEO' ? (
            <video src={props.Url} />
          ) : (
            <></>
          )}
        </div>
        <div className='d-flex flex-column'>
          <hr />
          {!props.isListed && (
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
          {true && (
            <p className='mx-auto'>
              Please Switch Networks to {props.ID.split(':')[0]}
            </p>
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

function ListSection({ID, onsubmit, onClose}: any) {
  const [price, setPrice] = useState(0);
  var dabu =
    typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
      ? new DABU('POLYGON', window.ethereum)
      : new DABU('POLYGON');
  return (
    <div className=''>
      <form
        className=' p-2 bg-light d-flex flex-column'
        onSubmit={async (e) => {
          e.preventDefault();
          console.log('submit', price);
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
          {/* {currencyType(_blockchain)} */}
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
              // e.preventDefault();
              const date = Date.now();
              console.log('submit', {
                tokenId: ID.split(':')[2],
                assetContractAddress: ID.split(':')[1],
                startTimestamp: date.toString(),
                buyoutPricePerToken: price,
                quantity: 1,
                currencyContractAddress: NATIVE_TOKEN_ADDRESS,
                listingDurationInSeconds: (86400).toString(),
              });
              return dabu
                .create_direct_listing({
                  tokenId: ID.split(':')[2],
                  assetContractAddress: ID.split(':')[1],
                  startTimestamp: new Date(),
                  buyoutPricePerToken: price,
                  quantity: 1,
                  currencyContractAddress: NATIVE_TOKEN_ADDRESS,
                  listingDurationInSeconds: 86400,
                })
                .then((res) => {
                  onsubmit();
                })
                .catch((err) => {
                  console.log(err);
                });
            }}>
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
