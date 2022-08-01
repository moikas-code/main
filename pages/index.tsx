import React, {useEffect} from 'react';
//@ts-ignore
import SEO from '@/src/components/SEO';
export default function Dragon({connected}: any) {
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{chainId: '0x89'}],
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x89',
                  chainName: 'Polygon',
                  rpcUrls: ['https://polygon-rpc.com/'] /* ... */,
                },
              ],
            });
          } catch (addError) {
            // handle "add" error
          }
        }
        // handle other "switch" errors
      }
    }
  }, []);
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
        title={`Moka's Lookout`}
        description="moikaslookout.com: Moika's Lookout is a WEB3 Community that is focused on the development of decentralized applications and services as well providing gaming content."
        twitter='takolabsio'
        keywords='gaming, nfts, web3'
      />
      <div className='d-flex flex-row justify-content-center position-relative w-100 h-100'>
        <div className='wrapper d-flex flex-column p-3'>
          <div className='s1 d-flex flex-column justify-content-center text-center neg-m-5rem'>
            <h2 className='display-1'>Welcome to Moika's Lookout!</h2>
            <h4>We are Currently in Open Alpha</h4>
            
            <p>We Support Polygon</p>
          </div>
        </div>
      </div>
    </>
  );
}
