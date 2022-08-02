import React, {useRef, useState} from 'react';
import {gql, useLazyQuery} from '@apollo/client';
//@ts-ignore
import TAKO from '@/src/tako';
import DABU from '../dabu';

//@ts-ignore
import SEO from '@/src/components/SEO';
//@ts-ignore
import Button from '@/src/components/Button';

import {MediaRenderer, useAddress} from '@thirdweb-dev/react';

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

function ListPage({connected}) {
  const marketRef = useRef(null);
  const [nft_list, set_nft_list] = React.useState([]);

  const [_ID, setID] = React.useState(0);

  const address = useAddress();
  const [blockchain, setBlockchain] = useState('POLYGON');
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

  var dabu = new DABU();
  typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
    ? dabu.init(blockchain, window.ethereum)
    : dabu.init(blockchain);

    dabu.setNetwork(blockchain);

  const [Query_Address_NFTS, {loading, refetch}] = useLazyQuery(query, {
    onCompleted: async ({Query_Address_NFTS}) => {
      if (
        Query_Address_NFTS !== null &&
        Query_Address_NFTS !== undefined &&
        Query_Address_NFTS.items !== null
      ) {
        let nfts: any = await Query_Address_NFTS.unlisted;
        // console.log(Query_Address_NFTS.listed.length);
        var i = 0;
        const rowSize = 4;
        let arr = [] as any;
        let groupArr = [] as any;
        if (nfts.length > 4) {
          for (const nft of nfts) {
            if (arr.length < rowSize && i !== nfts.length) {
              arr.push(nft);
            } else if (i == nfts.length) {
              groupArr.push(arr);
            } else if (arr.length == rowSize) {
              groupArr.push(arr);
              arr = [];
              arr.push(nft);
            }

            i = i + 1;
          }
        } else {
          groupArr.push(nfts);
        }
        console.log('setting index', groupArr);
        set_nft_list(groupArr);
      }
    },
  });

  React.useEffect(() => {
    address &&
      Query_Address_NFTS({
        variables: {
          input: {
            address: `${'ETHEREUM'}:${address}`,
            blockChain: blockchain,
          },
        },
      });
  }, [address, connected]);
  if (loading) {
    return (
      <div className='h-100 w-100 d-flex flex-column justify-content-center align-items-center'>
        Walking Dog...
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
          ref={marketRef}
          className='wrapper d-flex flex-column justify-content-center p-5'>
          {nft_list.map((nft_row: any, k) => {
            return (
              <div
                className={`d-flex flex-row flex-wrap ${
                  nft_row.length > 1
                    ? 'justify-content-between'
                    : 'justify-content-start'
                } mb-3`}>
                {nft_row.map((nft_item: any, i) => (
                  <>
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
                  </>
                ))}
              </div>
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
        className='nft-wrapper border border-dark m-1 p-2 d-flex flex-column justify-content-between rounded'>
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
  var dabu =
    typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
      ? new DABU(blockchain, window.ethereum)
      : new DABU(blockchain);
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
