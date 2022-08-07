import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import TakoLink from './TakoLink';
import WalletButton from './walletbutton';
import WalletButtonItem from './walletbuttonitem';
import {login} from '../helpers';
import Button from './Button';
import Link from 'next/link';
import {useAddress, useDisconnect, useMetamask} from '@thirdweb-dev/react';
function Navbar(props: any) {
  const address = useAddress();
  const [show, setShow] = useState(false);

  const router = useRouter();
  // const [address, setAddress] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [err, setErr] = React.useState<any>('');

  return (
    <>
      <style jsx>{`
        .navbar {
          height: 5rem;
        }
        .nav-brand {
          vertical-align: middle;
        }
        .wallet-button-items {
          max-height: 18.75rem;
          width: 175px;
        }
      `}</style>
      <div className='position-relative bg-white z-3 d-flex flex-column'>
        <div className='navbar d-flex flex-row justify-content-between align-items-center border border-dark'>
          <Link href={'/'}>
            <a className='d-flex flex-column justify-content-center h-100 fnt-color-black text-decoration-none text-center nav-brand width-10rem ms-5'>
              <span className='text-uppercase'>Moika's Lookout</span>
            </a>
          </Link>

          <div className='h-100 d-flex flex-row'>
            <WalletButton
              isConnected={props.connected}
              onPress={() => setShow(!show)}
              // address={truncateAddress(props.address)}
            />
          </div>
        </div>
        <div className='d-flex flex-row justify-content-center align-items-center border-start border-end border-bottom border-dark bg-white px-4 py-2'>
          <Button
            onClick={() => {
              router.push('/');
            }}>
            Home
          </Button>
          |
          <Button
            onClick={() => {
              router.push('/about');
            }}>
            About
          </Button>
          |
          <Button
            onClick={() => {
              router.push('/trades');
            }}>
            Trades
          </Button>
          {address && (
            <>
              |
              <Button
                onClick={() => {
                  router.push('/profile');
                }}>
                My NFT
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
// {show && (
//   <div
//     className={`wallet-button-items d-flex flex-column bg-grey position-absolute end-0`}>
//     <WalletButtonItem
//       text={`Create Contract`}
//       onPress={() => {
//         router.push('https://deploy.takolabs.io');
//         setShow(false);
//       }}
//     />
//     <WalletButtonItem
//       text={`Create`}
//       onPress={() => {
//         router.push('https://mint.takolabs.io');
//         setShow(false);
//       }}
//     />
//   </div>
// )}
export default Navbar;
