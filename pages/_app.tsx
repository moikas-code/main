//@ts-nocheck
import React from 'react';
import {ApolloProvider} from '@apollo/client';
import client from '../src/middleware/graphql/apollo-client';
import type {AppProps /*, AppContext */, NextWebVitalsMetric} from 'next/app';
import Navbar from '../src/components/Navbar';
import {Provider} from 'react-redux';
// @ts-ignore
import {store} from '../src/store';
import Head from 'next/head';
import metrics from '../src/metrics';
import 'bootstrap/dist/css/bootstrap.min.css';
import WalletProvider from '../dabu/WalletProvider';
import {ChainId, ThirdwebProvider, useAddress} from '@thirdweb-dev/react';
import dynamic from 'next/dynamic';
import Footer from '@/src/components/Footer';
function MyApp({Component, pageProps}: AppProps) {
  return (
    <WalletProvider
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
      {({connected}) => {
        // console.log('pageProps', pageProps, connected, address, network);

        return (
          <ApolloProvider client={client}>
            <Head>
              <link href='bootstrap/dist/css/bootstrap.min.css' />
            </Head>
            <style jsx global>
              {`
                html,
                body,
                #__next {
                  display: flex;
                  flex-direction: column;
                  height: 100%;
                  font-family: monospace;
                }

                body {
                  background: url('lookoutbg.png');
                  background-size: cover;
                  background-repeat: no-repeat;
                  background-position: center;
                  background-attachment: fixed;
                  background-color: rgba(255, 255, 255, 0.8);
                  background-blend-mode: lighten;
                }

                #tako {
                  height: calc(100% - 110.25px);
                  overflow-y: scroll;
                }
                button,
                p{
                  font-size: 1.25rem;
                }
                .bg-white {
                  background-color: rgba(255, 255, 255, 0.6);
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
                // sections
                .wrapper {
                  width: 100%;
                  max-width: 1400px !important;
                }

                .s1 {
                  min-height: 800px;
                }
                .s2 {
                  min-height: 600px;
                }
                .s3 {
                  min-height: 400px;
                }
              `}
            </style>

            <Provider store={store}>
              <>
                <Navbar />
                {/*TODO: Create Layout*/}
                <div id='tako' className='position-relative'>
                  <Component
                    {...{
                      ...pageProps,
                      connected: connected,
                    }}
                  />
                </div>
                  {/* <Footer /> */}
              </>
            </Provider>
          </ApolloProvider>
        );
      }}
    </WalletProvider>
  );
}

export default MyApp;
