import {useAddress, useDisconnect, useMetamask} from '@thirdweb-dev/react';
 function truncateAddress(address) {
  try {
    return `${address.substring(0, 6).toLowerCase()}...${address
      .substring(38, 42)
      .toLowerCase()}`;
  } catch (error) {
    console.log(`truncateAddress(): ${error}`);
    return `truncateAddress(): ${error}`;
  }
}
function WalletButton({
  isConnected = false,
  onPress = () => {},
}) {
    const connectWithMetamask = useMetamask();
    const address = useAddress();
  return (
    <div className={`position-relative  wallet-button h-100`}>
      <style jsx>
        {`
          .wallet-button {
            width: 175px;
            background-color: #fff;
          }
        `}
      </style>
      {address ? (
        <div
          className={`wallet-button-address hover-blackflame d-flex flex-column align-items-center justify-content-center px-3 h-100 w-100 cursor-pointer`}
          onClick={() => {
            onPress();
          }}>
          {truncateAddress(address)}
        </div>
      ) : (
        <div
          className={`wallet-button-address hover-blackflame d-flex flex-column align-items-center justify-content-center px-3 h-100 w-100 cursor-pointer`}
          onClick={() => connectWithMetamask()}>
          CONNECT
        </div>
      )}
    </div>
  );
}
export default WalletButton;

