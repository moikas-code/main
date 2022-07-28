import React, {ReactNode} from 'react';
import {
  useMarketplace,
  useAddress,
  useMetamask,
  useConnect,
} from '@thirdweb-dev/react';
//@ts-ignore
import SEO from '@/src/components/SEO';
// @ts-ignore
import Navbar from '@/src/components/Navbar';
export default function about({connected}): ReactNode {
  const address = useAddress();
  return (
    <>
      <SEO
        title={`About Us - Tako Labs`}
        description='TAKOLABS.IO: Tako Labs is a WEB3 Community that is focused on the development of decentralized applications and services as well providing gaming content.'
        twitter='takolabs'
        keywords='gaming, nfts, web3'
      />
      <div className='d-flex flex-row justify-content-center position-relative w-100 h-100'>
        <div className='wrapper d-flex flex-column p-3'>
          {/* Header */}
          <div>
            <h1>About</h1>
            <hr />
            <p>
              Tako Labs is a Community built around Gaming and Technology. Our
              goal is create a place where our users feel safe and secure while
              providing tools and resources to assist those interested in
              blockchain technologies.
            </p>
            <p>To do this we have created a small ecosystem starting with:</p>
            <p>
              {' '}
              A simple Marketplace to allow users to trade their data at a low
              fee (0.05%). We honor{' '}
              <a target='_blank' href='https://eips.ethereum.org/EIPS/eip-2981'>
                EIP-2981
              </a>{' '}
              allowing royalties to be transferred to the owner.
            </p>

            <p>
              A simple Minting Form is in development to allow users to upload
              their data to the blockchain.
            </p>
            <p>
              A simple NFT Contract Deployer is in development to allow users to
              deploy and create their own NFT contracts.
            </p>
            <p>
              A simple Dream to create an open-source and decentralized game.
            </p>
          </div>

          <hr />
          {/* Our Contract Section */}
          <div>
            <h4>Our Contracts:</h4>
            <p>
              Ethereum Exchange Contract:{' '}
              <a
                target='_blank'
                href='https://etherscan.com/address/0x61f46e5835434DC2990492336dF84C3Fbd1ac468'>
                0x61f46e5835434DC2990492336dF84C3Fbd1ac468
              </a>
            </p>
            <p>
              Polygon Exchange Contract:{' '}
              <a
                target={'_blank'}
                href='https://polygonscan.com/address/0x342a4abec68e1cdd917d6f33fbf9665a39b14ded'>
                0x342a4aBEc68E1cdD917D6f33fBF9665a39B14ded
              </a>
            </p>
          </div>
          <hr />
          {/* Our Team Section */}
          <div>
            <h4>Our Team:</h4>
            <p>
              Lead Dev -{' '}
              <a
                target={'_blank'}
                href='https://etherscan.io/address/0x877728846bfb8332b03ac0769b87262146d777f3'>
                moika.eth
              </a>
            </p>
          </div>
          <hr />
          {/* Our Socials Section */}
          <div>
            <h4>Our Socials:</h4>
            <p>
              Discord:{' '}
              <a target={'_blank'} href='https://discord.gg/DnbkrC8 '>
                Join
              </a>
            </p>
            <p>
              Twitter:{' '}
              <a target={'_blank'} href='https://twitter.com/takolabsio'>
                {' '}
                Follow
              </a>{' '}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
