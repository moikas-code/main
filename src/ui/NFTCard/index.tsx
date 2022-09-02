import React, {useEffect, useState, useRef, useMemo} from 'react';
import mime from 'mime/lite.js';
// @ts-ignore
import ANIM_Ellipsis from '../../components/ANIM-Ellipsis';
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
const queryClient = new QueryClient();
// @ts-ignore
import Button from '../../components/common/Button';
import {useRouter} from 'next/router';

const NFTCard = ({
  tradeId,
  name,
  currencySymbol,
  image,
  buyOutPrice,
  network,
  seller_address,
  quantity,
}: any): JSX.Element => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const imageLoaded = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    // resolimageLoaded();
  }, [image]);

  return (
    <>
      <style global jsx>
        {`
          .nft-wrapper {
            min-width: 21.875rem;
            max-width: 21.875rem;
          }
          .icon-wrapper {
            max-width: 37.5rem;
            width: 100%;
            height: 20rem;
            -o-object-fit: contain !important;
            object-fit: contain;
            overflow: hidden;
          }
          img {
            height: 400px;
            width: 37.5rem;
            object-fit: contain !important;
          }
        `}
      </style>
      <div className='nft-wrapper rounded border border-dark p-2 mb-3 d-flex flex-column justify-content-between bg-white'>
        <div
          onClick={async (e: any) => {
            return router.push(`/trade/${network}-${tradeId}`);
          }}
          className='icon-wrapper d-flex flex-column justify-content-center align-items-center pointer'>
          <QueryClientProvider client={queryClient}>
            <MediaRenderer
              onLoad={() => imageLoaded()}
              className={`${isLoading ? 'd-none' : ''}`}
              src={image}
            />
          </QueryClientProvider>
          <h1 className={isLoading ? '' : 'd-none'} role='status'>
            <ANIM_Ellipsis />
          </h1>
        </div>
        <div className='d-flex flex-column'>
          <hr className='my-1' />
          <p className='m-0'>
            {name}
            <br />
            <small>{truncateAddress(seller_address)}</small>
          </p>
          <div className='d-flex flex-row justify-content-between'>
            {buyOutPrice && (
              <>
                {/* <hr className='my-1' /> */}
                <p className='m-0'>
                  {buyOutPrice} {currencySymbol}
                </p>
              </>
            )}
            x{quantity}
          </div>
        </div>
      </div>
    </>
  );
};
export default NFTCard;

function MediaRenderer({
  src,
  onLoad,
  className,
}: {
  src: string;
  onLoad: () => any;
  className: string;
}): any {
  const DEFAULT_IPFS_GATEWAY = 'https://gateway.ipfscdn.io/ipfs/';
  const DEFAULT_IPFS_RESOLVER_OPTIONS: any = {
    gatewayUrl: DEFAULT_IPFS_GATEWAY,
  };
  function resolveIpfsUri(
    uri?: string,
    options = DEFAULT_IPFS_RESOLVER_OPTIONS
  ) {
    if (!uri) {
      return undefined;
    }
    if (uri.startsWith('ipfs://')) {
      return uri.replace('ipfs://', options.gatewayUrl);
    }
    return uri;
  }

  async function resolveMimeType(url?: string) {
    if (!url) {
      return undefined;
    }
    const mimeType = mime.getType(url);
    if (mimeType) {
      return mimeType;
    }

    const res = await fetch(url, {
      method: 'HEAD',
    });
    if (res.ok && res.headers.has('content-type')) {
      return res.headers.get('content-type') ?? undefined;
    }
    // we failed to resolve the mime type, return null
    return undefined;
  }
  function useResolvedMediaType(uri?: string) {
    const resolvedUrl = useMemo(() => resolveIpfsUri(uri), [uri]);
    const resolvedMimType = useQuery(
      ['mime-type', resolvedUrl],
      () => resolveMimeType(resolvedUrl),
      {
        enabled: !!resolvedUrl,
      }
    );

    return {
      url: resolvedUrl,
      mimeType: resolvedMimType.data,
    };
  }

  const {url, mimeType} = useResolvedMediaType(src);

  switch (mimeType) {
    case 'image/jpeg':
    case 'image/png':
    case 'image/gif':
      return <img className={className} onLoad={onLoad} src={url} />;

    case 'video/mp4':
      return <video className={className} onLoad={onLoad} src={url} />;

    default:
      return <div className={className}>Unsupported media type</div>;
  }
}

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
