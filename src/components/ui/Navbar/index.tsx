import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import WalletButton from '../../blocks/WalletButton';
import Button from '../../common/Button';
import Link from 'next/link';
import NavItem from '../../blocks/NavItem';
function Navbar({wrapperCss = '', ...props}: any): React.ReactElement {
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
      </div>
    </>
  );
}
export default Navbar;
