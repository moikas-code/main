import React, {Fragment, useEffect, useState} from 'react';
//@ts-ignore
import SEO from '../src/components/common/SEO';
// @ts-ignore
// import NFTCARD from '../src/components/ui/NFTCard';
// import DABU from '../dabu';
// import H from '../src/components/common/H';
// import {runTime} from '../dabu/helpers';
import Web3 from 'web3';
// import TwitchEmbed from '@/src/components/blocks/TwitchEmbed';
// import Chatbot from '@/src/components/ui/Chatbot';
import MoiLinkTree from '@/src/components/ui/MoiLinkTree';
var BN: any = Web3.utils.hexToNumberString;

export default function Index(): JSX.Element {
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
      <div className='wrapper d-flex flex-column justify-content-center align-items-center'>
        <MoiLinkTree/>
      </div>
    </>
  );
}
