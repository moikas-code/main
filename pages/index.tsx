import React, {useEffect, useState} from 'react';
//@ts-ignore
import SEO from '@/src/components/SEO';
import DABU from '../dabu';
const init = false;
export default function Dragon({connected}: any) {

  const [blockchain, setBlockchain] = useState('POLYGON');
  
  var dabu = new DABU();
  typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
    ? dabu.init(blockchain, window.ethereum)
    : dabu.init(blockchain);

  return (
    <>
      <style>
        {`
      .neg-m-5rem{
        margin-top: -5rem;
      }
      `}
      </style>
      <SEO
        title={`Moka's Lookout | Home`}
        description="Moika's Lookout is a WEB3 Community."
        twitter='takolabsio'
        keywords='gaming, nfts, web3'
      />
      <div className='d-flex flex-row justify-content-center position-relative w-100 h-100'>
        <div className='wrapper d-flex flex-column p-3'>
          <div className='s3 d-flex flex-column justify-content-center text-center neg-m-5rem'>
            <h2 className='display-1'>Welcome to The Lookout!</h2>
            <h4>Open Alpha</h4>

            <p>Building on Polygon</p>
          </div>
        </div>
      </div>
    </>
  );
}
