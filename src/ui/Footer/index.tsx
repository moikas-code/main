import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import WalletButton from '../../components/WalletButton';
import Button from '../../components/common/Button';
import Link from 'next/link';
function Footer({wrapperCss = '', ...props}: any) {
  const router = useRouter();
  const [show, setShow] = useState(false);

  return (
    <>
      <style jsx>{`
        .footer {
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
        <div className='d-flex flex-row justify-content-start align-items-center border-start border-end border-bottom border-dark bg-white px-4 py-2'>
          <Button
            onClick={() => {
              router.push('/about');
            }}>
            About us
          </Button>
        </div>
      </div>
    </>
  );
}
export default Footer;
