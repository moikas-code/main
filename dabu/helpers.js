import MetaMaskOnboarding from '@metamask/onboarding';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
// import { getProfile } from "./sessionActions";
/**
 * Detects the window.ethereum var
 */
const _provider = async () => {
  try {
    await detectEthereumProvider();
  } catch (error) {
    return false;
  }
  return true;
};
/**
 *  Handles the Web3.js Provider.
 *  If it detects MetaMask then it will use window.ethereum as the Provider.
 *  If MetaMask isn't detected then the INFURA_API will be used to as a provider.
 */

const _isMetaMask = async () => {
  try {
    ethereum.isMetaMask;
  } catch (error) {
    console.group();
    console.warn('isMetaMask: Ethereum Not Detected');
    console.warn('To Enjoy the full Experience');
    console.warn('Please visit: https://MetaMask.io ❤');
    console.groupEnd();
    return false;
  }
  return true;
};

export const initWeb3 = async () => {
  try {
    if (window.ethereum !== undefined) {
      ethereum.autoRefreshOnsNetworkChange = false;
      window.web3 = new Web3(window.ethereum);

      return true;
    } else {
      window.web3 = new Web3(
        new Web3.providers.HttpProvider('https://api.edennetwork.io/v1/beta')
      );

      return true;
    }
  } catch (error) {
    console.log('initWeb3()', error);
    return false;
  }
};
//

export const login = async (props) => {
  try {
    let ethereumProvider = await web3.currentProvider;
    await ethereumProvider.request({method: 'eth_requestAccounts'});
    await getAddress();
  } catch (error) {
    await console.log('Login(): ', error);
  }
};

//
export const setProfile = (data) => data;
//
export const getAddress = async () => {
  try {
    let address = await web3.eth.getAccounts();
    if (address) {
      let addr;
      web3.eth.defaultAccount = await address[0];
      addr = await address[0];
   

      return addr;
    }
  } catch (error) {
    return error;
  }
};
//

//
export const getBalance = async (addr) => {
  try {
    return await web3.eth
      .getBalance(addr)
      .then((res) => {
        return setBalance(web3.utils.fromWei(res, 'ether'));
      })
      .catch((error) => {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          console.log('Please Connect Wallet.');
          return 'Please Connect Wallet.';
        } else {
          console.error(error);
          return error;
        }
      });
  } catch (error) {
    return error;
  }
};
//
const getNetwork = async () => {
  return await web3.eth.net
    .getId()
    .then((res) => setChainId(res))
    .catch((err) => {
      console.log('getNetwork', err);
      return err;
    });
};
//
async function watchChain() {
  try {
    return await ethereum.on('chainChanged', (chainId) => {
      return chainId;
      // window.location.reload();
    });
  } catch (error) {
    console.log('watchChain()', error);
    return error;
  }
}
//
export const startCore = async (props) => {
  try {
    await initWeb3();
    await getNetwork();
    await getAddress();

    if (window.ethereum !== undefined) {
      await watchChain();
    }
    return {
      address: await getAddress(),
      network: await getNetwork(),
    };
  } catch (error) {
    throw error;
  }
};
//

// Setters
export const setAddress = async (addr) => {
  try {
    if (addr == null) addr = [];

    return addr;
  } catch (error) {
    return error;
  }
};
export const setChainId = async (payload) => {
  return payload;
};

export const setBalance = (payload) => payload;
