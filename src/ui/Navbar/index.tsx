import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import WalletButton from '../../components/WalletButton';
import Button from '../../components/common/Button';
import Link from 'next/link';
import NavButton from '../../components/NavButton';
function Navbar({wrapperCss = '', ...props}: any) {
  const router = useRouter();
  const [show, setShow] = useState(false);

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
      <div
        className={
          wrapperCss + ' position-relative bg-white z-3 d-flex flex-column'
        }>
        <div className='navbar d-flex flex-row justify-content-between align-items-center border border-dark'>
          <Link href={'/'}>
            <a className='d-flex flex-column justify-content-center h-100 fnt-color-black text-decoration-none text-center nav-brand width-10rem ms-3 text-black'>
              <span className='text-uppercase'>{props.siteTitle}</span>
            </a>
          </Link>

          <div className='h-100 d-flex flex-row'>
            <WalletButton
              onPress={() => setShow(!show)}
              address={props.address}
              onLogin={() => props.connect()}
            />
          </div>
        </div>
        <div className='d-flex flex-row justify-content-center align-items-center border-start border-end border-bottom border-dark bg-white px-4 py-2'>
          <NavButton
            onClick={() => {
              router.push('/trade');
            }}>
            Trade
          </NavButton>
          -
          <NavButton
            onClick={() => {
              router.push('/auction-house');
            }}>
            Auction House
          </NavButton>
          {/* Temporarily rm */}
          {false && (
            <>
              -
              <NavButton
                onClick={() => {
                  router.push('/profile');
                }}>
                My NFT
              </NavButton>
            </>
          )}
        </div>
      </div>
    </>
  );
}
export default Navbar;
