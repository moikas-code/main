import React, {useEffect, useState, useRef, useMemo} from 'react';
import mime from 'mime/lite.js';
import {useQuery} from '@tanstack/react-query';
// import {MediaRenderer} from '@thirdweb-dev/react';
// @ts-ignore
import Button from '../Button';
import {useRouter} from 'next/router';
const NFTCard = ({
  tradeId,
  name,
  currencySymbol,
  image,
  buyOutPrice,
  network,
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
          }
          .icon-wrapper {
            max-width: 37.5rem;
            width: 100%;
            height: 21.875rem;
            // height: 100%;
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
      <div className='nft-wrapper rounded border border-dark p-2 d-flex flex-column justify-content-between bg-white'>
        <div className='icon-wrapper d-flex flex-column justify-content-center align-items-center'>
          <MediaRenderer
            onLoad={() => imageLoaded()}
            className={`${isLoading ? 'd-none' : ''}`}
            src={image}
          />
          <div
            className={isLoading ? 'spinner-border text-primary' : 'd-none'}
            role='status'>
            <span className='sr-only'></span>
          </div>
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
          {
            <Button
              className='btn btn-dark'
              onClick={async (e: any) => {
                return router.push(`/trade/${network}-${tradeId}`);
              }}>
              View Trade
            </Button>
          }
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
}): React.ReactNode {
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
