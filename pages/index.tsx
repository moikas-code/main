import React, {Fragment, useEffect, useState} from 'react';
//@ts-ignore
import SEO from '../src/components/common/SEO';
// @ts-ignore
import NFTCARD from '../src/components/ui/NFTCard';
import DABU from '../dabu';
import H from '../src/components/common/H';
import {runTime} from '../dabu/helpers';
import Web3 from 'web3';
import TwitchEmbed from '@/src/components/blocks/TwitchEmbed';
var BN: any = Web3.utils.hexToNumberString;
// export async function getStaticProps(context: any, dabu: any) {
//   const getLatestListed = async () => {
//     // INIT Dabu
//     var dabu = new DABU(process.env.AKKORO_ENV);
//     console.log('dabu', dabu, await dabu.get_latest_nft_listing());
//     //Get Active Listings
//     const latestListing: any = await dabu.get_latest_nft_listing();

//     return latestListing;
//   };
//   const {scriptDuration: duration, res: latestListing} = await runTime(
//     getLatestListed
//   );
//   return {
//     props: {
//       latestListing: JSON.stringify(latestListing),
//       scriptDuration: duration,
//     },
//     // - At most once every 10 seconds
//     revalidate: 15, // In seconds
//   };
// }

export default function Dragon({latestListing}: any): JSX.Element {
  return (
    <>
      <style jsx global>
        {`
          .h-lg-fnt {
            font-size: 3.5rem;
          }
          .strokeme {
            color: #000;
            text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff,
              1px 1px 0 #fff;
          }
          .wrapper {
            height: 100%;
            width: 100%;
            margin: 0 auto;
          }
          .wrapper > div {
            height: 100%;
            width: 100%;
            padding-top: 1rem;
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
          }
        `}
      </style>

      <SEO
        title={`Home | Moka's Lookout`}
        description="Moika's Lookout is a WEB3 Community."
        twitter='moikaslookout'
        keywords='gaming, nfts, web3'
      />
      <div className='wrapper d-flex flex-column position-relative'>
        <h1 className='mt-5'>Welcome!</h1>
        {/* Our Contract Section */}
        <div className=' mb-5'>
          <h4>
            <span className='border-bottom border-dark pe-5'>
              Our Contracts
            </span>
          </h4>
          <p className='fs-6'>
            Ethereum Exchange Contract:{' '}
            <a
              target='_blank'
              href='https://etherscan.com/address/0x61f46e5835434DC2990492336dF84C3Fbd1ac468'>
              0x61f46e5835434DC2990492336dF84C3Fbd1ac468
            </a>
          </p>
          <p className='fs-6'>
            Polygon Exchange Contract:{' '}
            <a
              target={'_blank'}
              href='https://polygonscan.com/address/0x342a4abec68e1cdd917d6f33fbf9665a39b14ded'>
              0x342a4aBEc68E1cdD917D6f33fBF9665a39B14ded
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
