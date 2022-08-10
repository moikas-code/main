import React, {useRef, useState} from 'react';
import { useRouter } from 'next/router';
import {gql, useLazyQuery} from '@apollo/client';
//@ts-ignore
import TAKO from '@/src/tako';
import DABU from '../dabu';

//@ts-ignore
import SEO from '@/src/components/SEO';
//@ts-ignore
import Button from '@/src/components/Button';
// @ts-ignore
import ANIM_Ellipsis from '@/src/components/ANIM-Ellipsis';
import {
  useAddress,
  MediaRenderer,
  useNetworkMismatch,
  useNetwork,
  ChainId,
} from '@thirdweb-dev/react';

import {NATIVE_TOKEN_ADDRESS} from '@thirdweb-dev/sdk';

function truncateAddress(address) {
  try {
    return `${address.substring(0, 6).toLowerCase()}...${address
      .substring(38, 42)
      .toLowerCase()}`;
  } catch (error) {
    console.log(`truncateAddress(): ${error}`);
    return `truncateAddress(): ${error}`;
  }
}
function removeDuplicateObjectFromArray(array, key) {
  return array.filter(
    (obj, index, self) => index === self.findIndex((el) => el[key] === obj[key])
  );
}

async function formatListings(listings: any, sort: string = 'latest') {
  var i = 0;
  let rowarr = [] as any;
  let groupArr = [] as any;

  const cleantListings = removeDuplicateObjectFromArray(listings, 'id');
  // console.log(cleantListings);
  for (const nft of cleantListings.sort((a: any, b: any) => {
    switch (sort) {
      case 'oldest':
        return a.id - b.id;
      case 'latest':
      default:
        return b.id - a.id;
    }
  })) {
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

function ListPage({connected}) {
  const router = useRouter();
  const [unclean_unlisted, set_unclean_unlisted] = React.useState([]);
  const [nft_list, set_nft_list] = React.useState([[]]);

  const [page, setPage] = useState<any>(0);
  const [_ID, setID] = React.useState(0);

  const address = useAddress();
  const [blockchain, setBlockchain] = useState('POLYGON');
  const [continuation, setContinuation] = useState('POLYGON');
  const query = gql`
    query Query_Address_NFTS($input: QueryInput) {
      Query_Address_NFTS(input: $input) {
        continuation
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

  var dabu = new DABU();
  dabu.init();

  const [Query_Address_NFTS, {loading, refetch}] = useLazyQuery(query, {
    onCompleted: async ({Query_Address_NFTS}) => {
      if (
        Query_Address_NFTS !== null &&
        Query_Address_NFTS !== undefined &&
        Query_Address_NFTS.unlisted !== null
      ) {
        let nfts: any = await Query_Address_NFTS.unlisted;
        set_unclean_unlisted(nfts);
        formatListings(nfts).then((arr: any) => {
          set_nft_list(arr);
          setContinuation(Query_Address_NFTS.continuation);
        });
      }
    },
  });

  const fetchMoreNFTS = async () => {
    // if (complete) {
    const res: any = await refetch({
      input: {
        continuation: continuation,
        address: `${'ETHEREUM'}:${address}`,
        blockchains: ['ETHEREUM', 'POLYGON'],
        size: 50,
      },
    });
    // console.log(data,data.Query_Address_NFTS);
    const {Query_Address_NFTS} = res.data;
    if (
      Query_Address_NFTS !== null &&
      Query_Address_NFTS !== undefined
      // data.Query_Address_NFTS.unlisted !== null
    ) {
      let nfts: any = await Query_Address_NFTS.unlisted;
      const flatten = function (arr, result = []) {
        for (let i = 0, length = arr.length; i < length; i++) {
          const value: any = arr[i];
          if (Array.isArray(value)) {
            flatten(value, result);
          } else {
            result.push(value);
          }
        }
        return result;
      };
      let vault = flatten(nft_list);
      // console.log(vault);
      const cleantListings = removeDuplicateObjectFromArray(
        [...vault, ...nfts],
        'id'
      );
      nfts.length > 0 &&
        formatListings(cleantListings).then((arr: any) => {
          // console.log([...nft_list, ...arr]);

          set_nft_list(arr);
          setContinuation(Query_Address_NFTS.continuation);
        });
    }
  };

  React.useEffect(() => {
    !connected&&router.push('/');
    address &&
      Query_Address_NFTS({
        variables: {
          input: {
            continuation: continuation,
            address: `${'ETHEREUM'}:${address}`,
            blockchains: ['ETHEREUM', 'POLYGON'],
          },
        },
      });
  }, [address, connected]);
  if (loading) {
    return (
      <div className='h-100 w-100 d-flex flex-row justify-content-center align-items-center'>
        <h4>
          Walking Dog
          <ANIM_Ellipsis />
        </h4>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`Profile of ${address} - Moika's Lookout`}
        description="moikaslookout.com: Moika's Lookout is a WEB3 Community that is focused on the development of decentralized applications and services as well providing gaming content."
        twitter='takolabsio'
        keywords='gaming, nfts, web3'
      />
      <div className='d-flex flex-column justify-content-center align-items-center mx-auto position-relative'>
        {address ? (
          <h4 className='mt-5'>
            Welcome{' '}
            <span className='border-bottom border-dark' title={address}>
              {truncateAddress(address)}
            </span>
          </h4>
        ) : (
          'Please Connect'
        )}
        {blockchain}
        <div
          className='wrapper d-flex flex-column justify-content-center p-5'>
          {typeof nft_list[page] !== 'undefined' &&
            nft_list[page].map((nft_row: any, k) => {
              return (
                <div
                  className={`d-flex flex-row flex-wrap ${
                    nft_row.length > 1
                      ? 'justify-content-between'
                      : 'justify-content-start'
                  } mb-3`}>
                  {nft_row.map((nft_item: any, i) => (
                    <NFTListingCard
                      key={i}
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
                  ))}
                </div>
              );
            })}
          <hr />
          <div className='d-flex flex-row justify-content-between align-items-center mb-3'>
            <Button disabled={page === 0} onClick={() => setPage(page - 1)}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                fill='currentColor'
                className='bi bi-arrow-left-circle'
                viewBox='0 0 16 16'>
                <path
                  fillRule='evenodd'
                  d='M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z'
                />
              </svg>
            </Button>
            {`${page + 1} of ${nft_list.length}`}
            <div>
              <Button
                disabled={!(page < nft_list.length - 1)}
                onClick={() => {
                  setPage(page + 1);
                }}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  fill='currentColor'
                  className='bi bi-arrow-right-circle'
                  viewBox='0 0 16 16'>
                  <path
                    fillRule='evenodd'
                    d='M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z'
                  />
                </svg>
              </Button>
            </div>
          </div>
          <Button
            disabled={page < nft_list.length - 1}
            onClick={() => {
              // setPage(page + 1);
              fetchMoreNFTS();
            }}>
            LoadMore
          </Button>
          <hr />
        </div>
      </div>
    </>
  );
}
export default ListPage;

function NFTListingCard({...props}) {
  const [show, setShow] = useState<boolean>(false);

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

      <div
        id={props.ID}
        className='nft-wrapper border border-dark m-1 p-2 d-flex flex-column justify-content-between rounded bg-white'>
        <div className='icon-wrapper d-flex flex-column justify-content-center align-items-center'>
          <MediaRenderer className='mx-auto h-100 w-100' src={props.Url} />
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
          {/* {true && (
            <p className='mx-auto'>
              Please Switch Networks to {props.ID.split(':')[0]}
            </p>
          )} */}
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

function ListSection({ID, onsubmit, onClose, connected}: any) {
  const [price, setPrice] = useState(0);
  const [blockchain, setBlockchain] = useState('POLYGON');
  var dabu = new DABU();
  dabu.init();
  // Ensure user is on the correct network
  const networkMismatch = useNetworkMismatch();

  const [, switchNetwork] = useNetwork();

  return (
    <div className=''>
      <div
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
              ID.split(':')[0] === 'ETHEREUM' && switchNetwork(ChainId.Mainnet);

              ID.split(':')[0] === 'POLYGON' && switchNetwork(ChainId.Polygon);

              e.preventDefault();
              console.log({
                tokenId: ID.split(':')[2],
                assetContractAddress: ID.split(':')[1],
                startTimestamp: new Date(),
                buyoutPricePerToken: price,
                quantity: 1,
                currencyContractAddress: NATIVE_TOKEN_ADDRESS,
                listingDurationInSeconds: 86400,
                network: ID.split(':')[0].toLowerCase(),
              });
              const date = Date.now();
              dabu
                .create_direct_listing({
                  tokenId: ID.split(':')[2],
                  assetContractAddress: ID.split(':')[1],
                  startTimestamp: new Date(),
                  buyoutPricePerToken: price,
                  quantity: 1,
                  currencyContractAddress: NATIVE_TOKEN_ADDRESS,
                  listingDurationInSeconds: 86400,
                  network: ID.split(':')[0].toLowerCase(),
                })
                .then((res) => {
                  console.log('res', res);
                  // onsubmit();
                })
                .catch((err) => {
                  console.log(err);
                });
            }}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
