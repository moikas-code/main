import {Fragment, useState, useEffect, useMemo} from 'react';
import Web3 from 'web3';
import {startCore, login} from '../helpers';
export default function WalletProvider({children}: any) {
  const [connected, setConnected] = useState(false);
  const [state_Address, setAddress] = useState(null);
  const [state_Network, setNetwork] = useState(null);

  useEffect(() => {
    startCore().then((res) => {
      if (typeof res.address !== 'undefined') {
        // console.log(res)
        setConnected(true);
        setAddress(res.address);
        setNetwork(res.network);
      }
    });
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
      window.ethereum.on('accountsChanged', async (accounts: Array<string>) => {
        console.log('accountsChanged', accounts);
        if (accounts.length === 0) {
          // window.location.reload();
          setConnected(false);
        }
        setAddress(accounts[0]);
      });
      window.ethereum.on('chainChanged', async (network: Array<string>) => {
        window.location.reload();
      });
    }
  }, []);
  // console.log(useMemo());
  return (
    <Fragment>
      {children({
        connected: connected,
        address: state_Address,
        state_Network,
      })}
    </Fragment>
  );
}
