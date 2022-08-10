import DABU from './';
import { startCore } from '@/src/helpers';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import React, { useState, useEffect } from 'react';
function Wrap({ children }: any) {
  var dabu = new DABU();
  return <>{children(dabu)}</>;
}
export default function WalletProvider({
  desiredChainId,
  chainRpc,
  supportedChains,
  sdkOptions,
  children,
}: any) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    startCore().then((res) => {
      if (typeof res.address !== 'undefined') {
        // console.log(res)
        setConnected(true);
      }
    });
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');

      window.ethereum.on('accountsChanged', async (accounts: Array<string>) => {
        if (accounts.length === 0) {
          // window.location.reload();
          setConnected(false);
        }
        setConnected(true);
      });
      // window.ethereum.on('chainChanged', async (network: Array<string>) => {
      //   window.location.reload();
      // });
    }
  }, []);

  return (
    <ThirdwebProvider
      desiredChainId={desiredChainId}
      chainRpc={chainRpc}
      supportedChains={supportedChains}
      sdkOptions={sdkOptions}>
      <Wrap>
        {(dabu: any) => {
          return children({
            connected: connected,
            dabu: dabu,
          });
        }}
      </Wrap>
    </ThirdwebProvider>
  );
}
