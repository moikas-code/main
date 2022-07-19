//@ts-nocheck
import React from 'react';
import {ApolloProvider} from '@apollo/client';
import client from '../src/middleware/graphql/apollo-client';
import type {AppProps /*, AppContext */, NextWebVitalsMetric} from 'next/app';

import {Provider} from 'react-redux';
// @ts-ignore
import {store} from '../src/store';
import Head from 'next/head';
import metrics from '../src/metrics';
import 'bootstrap/dist/css/bootstrap.min.css';
import WalletProvider from '@/src/components/WalletProvider';
import {ChainId, ThirdwebProvider} from '@thirdweb-dev/react';
import dynamic from 'next/dynamic';
function MyApp({Component, pageProps}: AppProps) {
  return (
    <ThirdwebProvider
      desiredChainId={ChainId.Polygon}
      chainRpc={{
        [ChainId.Polygon]:
          'https://polygon-mainnet.infura.io/v3/157c8192a65149daa7bea1a4b17d3abf',
      }}
      supportedChains={[ChainId.Mainnet, ChainId.Polygon]}
      // sdkOptions={{
      //   gasSettings: {maxPriceInGwei: 500, speed: 'fast'},
      //   gasless: {
      //     openzeppelin: {
      //       relayerForwarderAddress:'0x140786e784015c1aebcac3238414a41bfcbc4ea9',
      //       relayerUrl: process.env.NEXT_PUBLIC_OPENZEPPELIN_URL,
      //     },
      //   },
      // }}
      >
      <ApolloProvider client={client}>
        <Head>
          <link href='bootstrap/dist/css/bootstrap.min.css' />
        </Head>
        <style jsx global>
          {`
            html,
            body,
            #__next {
              height: 100%;
              font-family: monospace;
            }

            #tako {
              height: calc(100% - 80px);
            }
            .bg-white {
              background-color: #fff;
            }
            .fnt-color-black {
              color: #000;
            }
            .fnt-color-black:hover {
              color: #000;
            }
            .text-decoraction-none {
              text-decoration: none;
            }
            .no-cursor {
              cursor: none;
            }
            .pointer,
            .cursor-pointer {
              cursor: pointer;
            }
            .no-select {
              -webkit-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              user-select: none;
            }
            .overflow-y-scroll {
              overflow-y: scroll;
            }
            .z-2 {
              z-index: 2;
            }
            .z-3 {
              z-index: 3;
            }
            .MuiButton-startIcon {
              display: none !important;
            }
            .img-wrap {
              height: 150px;
              width: 150px;
            }
            .width-10rem {
              width: 10rem !important;
            }
            .width-15rem {
              width: 15rem !important;
            }
            .width-20rem {
              width: 20rem !important;
            }
            .width-25rem {
              width: 25rem !important;
            }

            //fonts
            .h6 {
              font-size: 1.25rem;
            }
          `}
        </style>

        <Provider store={store}>
          <>
            {/*TODO: Create Layout*/}
            <div id='tako' className='position-relative'>
              <Component {...pageProps} />
            </div>
          </>
        </Provider>
      </ApolloProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;
