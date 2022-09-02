import React, {ReactNode} from 'react';
import H from '../../src/components/common/H';
//@ts-ignore
import SEO from '@/src/components/SEO';
export default function About(): ReactNode {
  return (
    <>
      <SEO
        title={`About - Moika's Lookout`}
        description="moikaslookout.com: Moika's Lookout is a WEB3 Community that is focused on the development of decentralized applications and services as well providing gaming content."
        twitter='takolabsio'
        keywords='gaming, nfts, web3'
      />
      <div
        className={`d-flex flex-row justify-content-center position-relative w-100 px-3 px-lg-0`}>
        <div className='wrapper d-flex flex-column p-3 pt-5 px-md-5 lh-lg'>
          {/* Header */}
          <div className=' mb-5'>
            <h1>
              <span className='border-bottom border-dark pe-5'>About</span>
            </h1>

            <H headerSize={'4'}>
              What is <span className=''>Moika's Lookout</span>?
            </H>

            <p>A Community built for Gamers, Developers, and Designers.</p>
            <H headerSize={'4'}>
              Why was <span className=''>Moika's Lookout</span> created?
            </H>
            <p>
              Moika's Lookout was created to be a community for the development
              of decentralized applications and services as well providing
              gaming and nft content.
            </p>
            {/* <p>
              To do this I decided to put my skills to the test, or learn what I
              could, and as a result a small ecosystem was put into development
              <ANIM_Ellipsis />
            </p> */}
            {/* <p>
              A Community Site to host le content and projects currently in
              development.
            </p> */}
            <p>
              A simple Marketplace to allow users to trade community drops as
              well as their own data at a low fee (0.05%). We honor{' '}
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
              I would like to create a game, but its almost as if everyone is
              doing so these day XD
            </p>
          </div>

          {/* Our Contract Section */}
          <div className=' mb-5'>
            <h4>
              <span className='border-bottom border-dark pe-5'>
                Our Contracts
              </span>
            </h4>
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

          {/* Our Team Section */}
          <div className=' mb-5'>
            <h4>
              <span className='border-bottom border-dark pe-5'>The Team</span>
            </h4>
            <div className='d-flex flex-column'>
              <p>
                <span className='border-bottom border-dark'>moika.eth</span>
              </p>
              <p>Lead Dev </p>
              <p>
                -
                <a
                  className='mx-2'
                  target={'_blank'}
                  href='https://etherscan.io/address/0x877728846bfb8332b03ac0769b87262146d777f3'>
                  Etherscan
                </a>
              </p>
              <p>
                -
                <a
                  className='mx-2'
                  target={'_blank'}
                  href='https://polygonscan.com/address/0x877728846bfb8332b03ac0769b87262146d777f3'>
                  Polygonscan
                </a>
              </p>
              <p>
                -
                <a
                  className='mx-2'
                  target={'_blank'}
                  href='https://twitter.com/0xmoika'>
                  Twitter
                </a>
              </p>
            </div>
          </div>

          {/* Our Socials Section */}
          <div className=' mb-5'>
            <h4>
              <span className='border-bottom border-dark pe-5'>
                The Socials
              </span>
            </h4>
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
            <p>
              Twitch:{' '}
              <a target={'_blank'} href='https://twitch.tv/moikapy'>
                Follow
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
