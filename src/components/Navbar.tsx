import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import TakoLink from './TakoLink';
import WalletButton from './walletbutton';
import WalletButtonItem from './walletbuttonitem';
import {login}from '../helpers'

function Navbar(props: any) {
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
      <div className='position-relative bg-white z-3'>
        <div className='navbar d-flex flex-row justify-content-between align-items-center border border-dark'>
          <span onClick={() => setShow(false)}>
            <TakoLink href={'/'} as={'/'}>
              <a className='d-flex flex-column justify-content-center h-100 fnt-color-black text-decoration-none text-center nav-brand width-10rem'>
                <span className='text-uppercase'>Tako Labs</span>
              </a>
            </TakoLink>
          </span>

          <div className='h-100' title={props.address}>
            <WalletButton
              isConnected={props.connected}
              onConnect={() =>
                login()
                  .then(() => window.location.reload())
              }
              onPress={() => setShow(!show)}
              // address={truncateAddress(props.address)}
            />
          </div>
        </div>
        {show && (
          <div
            className={`wallet-button-items d-flex flex-column bg-grey position-absolute end-0`}>
            <WalletButtonItem
              text={`Create Contract`}
              onPress={() => {
                router.push('https://deploy.takolabs.io');
                setShow(false);
              }}
            />
            <WalletButtonItem
              text={`Create`}
              onPress={() => {
                router.push('https://mint.takolabs.io');
                setShow(false);
              }}
            />
            <WalletButtonItem
              text={`List NFT`}
              onPress={() => {
                router.push('/list');
                setShow(false);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
export default Navbar;
